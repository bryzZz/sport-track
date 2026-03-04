import React from "react";

import { useGetWorkoutOverviewStats } from "api/stats";
import { useRememberedTemplateId } from "utils/hooks/useRememberedTemplateId";

import Fire from "assets/icons/fire.svg?react";
import { ExerciseStatsCard } from "components/ExerciseStatsCard";
import { WorkoutHeatmapCompact } from "components/WorkoutHeatmapCompact";

export const WorkoutStats: React.FC = () => {
  const templateId = useRememberedTemplateId("last-template-id:stats") ?? "";
  const { data, isLoading, isError } = useGetWorkoutOverviewStats(templateId);

  if (!templateId) {
    return <p>templateId is required</p>;
  }

  if (isLoading) {
    return <p>Загрузка статистики...</p>;
  }

  if (isError || !data) {
    return <p>Не удалось загрузить статистику.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl">{data.template.name} Workout Stats</h1>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            Сессий: {data.summary.sessionsCount}{" "}
            <Fire className="size-4 shrink-0" />
          </div>
          <p>Последняя: {data.summary.lastSessionDate ?? "Нет данных"}</p>
        </div>

        <div>
          <p>
            Общий объём (tonnage): {data.summary.totalVolume.value}{" "}
            {data.summary.totalVolume.unit}
          </p>
          {data.summary.totalVolume.trend.deltaPercent === null ? (
            <p className="text-neutral-500">
              Нет данных для тренда за 4 недели
            </p>
          ) : (
            <p className="text-lime-600">
              {data.summary.totalVolume.trend.deltaPercent >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(data.summary.totalVolume.trend.deltaPercent)}% за 4
              недели
            </p>
          )}
        </div>

        <div>
          <p>
            Средняя интенсивность:{" "}
            {data.summary.averageIntensity.rpe === null
              ? "Нет данных"
              : `RPE ${data.summary.averageIntensity.rpe}`}
          </p>
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
