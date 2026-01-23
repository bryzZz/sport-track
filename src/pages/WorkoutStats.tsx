import React from "react";

import Fire from "../assets/icons/fire.svg?react";
import { WorkoutVolumeChart } from "../components/WorkoutVolumeChart";

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
      exerciseId: "shoulder-press",
      name: "Shoulder Press",

      volume: {
        average: 1620,
        last: 1680,
      },

      bestSet: {
        reps: 12,
        weight: 45,
        date: "2026-01-21",
      },

      trend: {
        metric: "volume",
        points: [
          { date: "2025-12-15", value: 1500 },
          { date: "2026-01-01", value: 1580 },
          { date: "2026-01-21", value: 1680 },
        ],
      },
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

        <div>Средняя интенсивность: RPE 7.6</div>

        <div>
          <WorkoutVolumeChart />
        </div>
      </div>
    </div>
  );
};
