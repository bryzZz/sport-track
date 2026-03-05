import React, { useState } from "react";

import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ExerciseSet = {
  reps: number;
  weight: number;
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
  weight: "Weight",
  reps: "Reps",
  volume: "Volume",
};

const metricOrder: MetricType[] = ["weight", "reps", "volume"];

const setColors = [
  "#7fc65c",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f59e0b",
];

const getSetMetricValue = (setItem: ExerciseSet, metric: MetricType) => {
  if (metric === "weight") {
    return setItem.weight;
  }

  if (metric === "reps") {
    return setItem.reps;
  }

  return setItem.reps * setItem.weight;
};

export const ExerciseSetsChart: React.FC<ExerciseSetsChartProps> = ({
  records,
}) => {
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>(["weight"]);

  if (records.length === 0) {
    return <p>No exercise data</p>;
  }

  const sortedRecords = [...records].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
  );

  const maxSetsCount = sortedRecords.reduce((maxSets, record) => {
    return Math.max(maxSets, record.sets.length);
  }, 0);

  const doneByDate = new Map(
    sortedRecords.map((record) => [record.date, record.done]),
  );

  const data = sortedRecords.map((record) => {
    const row: Record<string, number | string | boolean> = {
      date: record.date,
      done: record.done,
    };

    metricOrder.forEach((metric) => {
      for (let setIndex = 0; setIndex < maxSetsCount; setIndex += 1) {
        const setItem = record.sets[setIndex];

        row[`${metric}_set_${setIndex + 1}`] =
          !record.done || !setItem ? 0 : getSetMetricValue(setItem, metric);
      }
    });

    return row;
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
                autoComplete="off"
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
          Select at least one metric
        </p>
      )}

      {hasActiveMetrics && (
        <ResponsiveContainer
          width="100%"
          height={260}
          minWidth={280}
          initialDimension={{ width: 320, height: 260 }}
        >
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
            {activeMetrics.map((metric) => {
              return Array.from({ length: maxSetsCount }).map((_, setIndex) => (
                <Bar
                  key={`${metric}_set_${setIndex + 1}`}
                  dataKey={`${metric}_set_${setIndex + 1}`}
                  stackId={metric}
                  fill={setColors[setIndex % setColors.length]}
                  isAnimationActive={false}
                  name={`${metricLabels[metric]} • Set ${setIndex + 1}`}
                />
              ));
            })}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
