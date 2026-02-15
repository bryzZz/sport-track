import React from "react";

import Fire from "assets/icons/fire.svg?react";
import {
  type ExerciseStats,
  ExerciseStatsCard,
} from "components/ExerciseStatsCard";
import { WorkoutHeatmapCompact } from "components/WorkoutHeatmapCompact";

const recordDates = [
  "2026-01-01",
  "2026-01-02",
  "2026-01-03",
  "2026-01-04",
  "2026-01-05",
  "2026-01-06",
  "2026-01-07",
  "2026-01-08",
  "2026-01-09",
  "2026-01-10",
  "2026-01-11",
  "2026-01-12",
  "2026-01-13",
  "2026-01-14",
  "2026-01-15",
  "2026-01-16",
  "2026-01-17",
  "2026-01-18",
  "2026-01-19",
];

const missedDates = new Set(["2026-01-06", "2026-01-14"]);

const createRecords = ({
  baseWeight,
  baseReps,
  weightStep,
  repsStep,
  cheatingEvery,
}: {
  baseWeight: number;
  baseReps: number;
  weightStep: number;
  repsStep: number;
  cheatingEvery: number;
}): ExerciseStats["records"] =>
  recordDates.map((date, index) => {
    const done = !missedDates.has(date);
    if (!done) {
      return { date, done, sets: [] };
    }

    const weight = baseWeight + index * weightStep;
    const reps = baseReps + (index % 2) * repsStep;
    const hasCheating = index % cheatingEvery === 0;

    return {
      date,
      done,
      sets: [
        { phases: [{ reps, weight, type: "strict" }] },
        { phases: [{ reps, weight, type: "strict" }] },
        {
          phases: hasCheating
            ? [
                { reps: Math.max(1, reps - 2), weight, type: "strict" },
                { reps: 2, weight, type: "cheating" },
              ]
            : [{ reps, weight, type: "strict" }],
        },
      ],
    };
  });

const data = {
  template: {
    id: "push-a",
    name: "Push A",
  },

  summary: {
    sessionsCount: 19,
    lastSessionDate: "2026-01-21",

    totalVolume: {
      value: 18420,
      unit: "kg",
      trend: {
        period: "4w",
        deltaPercent: 8,
      },
    },

    averageIntensity: {
      rpe: 7.6,
    },
  },

  exercises: [
    {
      id: "shoulder-press",
      name: "Shoulder Press",

      bestSet: {
        reps: 12,
        weight: 45,
      },

      records: createRecords({
        baseWeight: 42,
        baseReps: 10,
        weightStep: 2,
        repsStep: 1,
        cheatingEvery: 5,
      }),
    },
    {
      id: "incline-press",
      name: "Incline Dumbbell Press",

      bestSet: {
        reps: 10,
        weight: 20,
      },

      records: createRecords({
        baseWeight: 18,
        baseReps: 8,
        weightStep: 1,
        repsStep: 1,
        cheatingEvery: 4,
      }),
    },
    {
      id: "triceps-pushdown",
      name: "Triceps Pushdown",

      bestSet: {
        reps: 12,
        weight: 50,
      },

      records: createRecords({
        baseWeight: 45,
        baseReps: 10,
        weightStep: 2,
        repsStep: 1,
        cheatingEvery: 6,
      }),
    },
  ],
};

export const WorkoutStats: React.FC = () => {
  return (
    <div>
      <h1 className="mb-6 text-4xl">{data.template.name} Workout Stats</h1>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            Сессий: {data.summary.sessionsCount}{" "}
            <Fire className="size-4 shrink-0" />
          </div>
          <p>Последняя: {data.summary.lastSessionDate}</p>
        </div>

        <div>
          <p>Общий объём (tonnage): {data.summary.totalVolume.value}</p>
          <p className="text-lime-600">
            ↑ {data.summary.totalVolume.trend.deltaPercent}% за 4 недели
          </p>
        </div>

        <div>
          <p>Средняя интенсивность: RPE 7.6</p>
          <WorkoutHeatmapCompact />
        </div>

        <div className="flex flex-col gap-6">
          {data.exercises.map((exercise) => (
            <ExerciseStatsCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
};
