import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PhaseType = "strict" | "cheating";

type ExercisePhase = {
  reps: number;
  weight: number;
  type: PhaseType;
};

type ExerciseSet = {
  phases: ExercisePhase[];
};

type ExerciseRecord = {
  date: string;
  done: boolean;
  sets: ExerciseSet[];
};

type MetricType = "weight" | "reps" | "volume";

type ExerciseSetsChartProps = {
  records: ExerciseRecord[];
};

const metricLabels: Record<MetricType, string> = {
  weight: "Вес",
  reps: "Повторения",
  volume: "Объём",
};

const phaseColors: Record<PhaseType, string> = {
  strict: "#7fc65c",
  cheating: "#f59e0b",
};

const metricOrder: MetricType[] = ["weight", "reps", "volume"];

const getPhaseValue = (phase: ExercisePhase, metric: MetricType) => {
  if (metric === "weight") {
    return phase.weight;
  }

  if (metric === "reps") {
    return phase.reps;
  }

  return phase.reps * phase.weight;
};

export const ExerciseSetsChart: React.FC<ExerciseSetsChartProps> = ({
  records,
}) => {
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>([
    "weight",
    "reps",
  ]);

  if (records.length === 0) {
    return <p>Нет данных по упражнениям</p>;
  }

  const sortedRecords = [...records].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
  );

  const doneByDate = new Map(
    sortedRecords.map((record) => [record.date, record.done]),
  );

  const data = sortedRecords.map((record) => {
    if (!record.done || record.sets.length === 0) {
      return {
        date: record.date,
        done: record.done,
        weight_strict: 0,
        weight_cheating: 0,
        reps_strict: 0,
        reps_cheating: 0,
        volume_strict: 0,
        volume_cheating: 0,
      };
    }

    const totals = record.sets.reduce(
      (acc, setItem) => {
        setItem.phases.forEach((phase) => {
          const metricValue = metricOrder.reduce(
            (metricAcc, metric) => {
              metricAcc[metric] += getPhaseValue(phase, metric);
              return metricAcc;
            },
            { weight: 0, reps: 0, volume: 0 },
          );

          acc[phase.type].weight += metricValue.weight;
          acc[phase.type].reps += metricValue.reps;
          acc[phase.type].volume += metricValue.volume;
        });
        return acc;
      },
      {
        strict: { weight: 0, reps: 0, volume: 0 },
        cheating: { weight: 0, reps: 0, volume: 0 },
      },
    );

    return {
      date: record.date,
      done: record.done,
      weight_strict: totals.strict.weight,
      weight_cheating: totals.cheating.weight,
      reps_strict: totals.strict.reps,
      reps_cheating: totals.cheating.reps,
      volume_strict: totals.strict.volume,
      volume_cheating: totals.cheating.volume,
    };
  });

  const metricLabelList = metricOrder.map((metric) => ({
    key: metric,
    label: metricLabels[metric],
  }));

  const hasActiveMetrics = activeMetrics.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {metricLabelList.map((metricItem) => {
          const isChecked = activeMetrics.includes(metricItem.key);
          return (
            <label
              key={metricItem.key}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  setActiveMetrics((prev) =>
                    prev.includes(metricItem.key)
                      ? prev.filter((item) => item !== metricItem.key)
                      : [...prev, metricItem.key],
                  )
                }
              />
              {metricItem.label}
            </label>
          );
        })}
      </div>

      {!hasActiveMetrics && (
        <p className="text-sm text-neutral-500">
          Выберите хотя бы один показатель
        </p>
      )}

      {hasActiveMetrics && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const isMissed = doneByDate.get(value) === false;
                const formattedDate = format(parseISO(value), "dd.MM");
                return isMissed ? `${formattedDate} x` : formattedDate;
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => format(parseISO(value), "dd MMM yyyy")}
            />
            {activeMetrics.map((metric) => (
              <React.Fragment key={metric}>
                <Bar
                  dataKey={`${metric}_strict`}
                  stackId={metric}
                  fill={phaseColors.strict}
                  name={`${metricLabels[metric]} (strict)`}
                />
                <Bar
                  dataKey={`${metric}_cheating`}
                  stackId={metric}
                  fill={phaseColors.cheating}
                  name={`${metricLabels[metric]} (cheating)`}
                />
              </React.Fragment>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
