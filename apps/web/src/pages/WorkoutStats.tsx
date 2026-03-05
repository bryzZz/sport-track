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
    return (
      <div>
        <h1 className="mb-6 text-4xl">Workout Stats</h1>
        <p>Template id is required.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Workout Stats</h1>
        <p>Loading stats...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <h1 className="mb-6 text-4xl">Workout Stats</h1>
        <p>Failed to load stats.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl">{data.template.name} Workout Stats</h1>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            Sessions: {data.summary.sessionsCount}{" "}
            <Fire className="size-4 shrink-0" />
          </div>
          <p>Last: {data.summary.lastSessionDate ?? "No data"}</p>
        </div>

        <div>
          <p>
            Total volume (tonnage): {data.summary.totalVolume.value}{" "}
            {data.summary.totalVolume.unit}
          </p>
          {data.summary.totalVolume.trend.deltaPercent === null ? (
            <p className="text-neutral-500">
              No trend data for the last 4 weeks
            </p>
          ) : (
            <p className="text-lime-600">
              {data.summary.totalVolume.trend.deltaPercent >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(data.summary.totalVolume.trend.deltaPercent)}% over 4
              weeks
            </p>
          )}
        </div>

        <div>
          <p>
            Average intensity:{" "}
            {data.summary.averageIntensity.rpe === null
              ? "No data"
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
