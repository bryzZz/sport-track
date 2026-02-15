import { apiClient } from "./client";
import type { ExerciseProgressDto, WorkoutCompletionDto } from "./types";

type StatsDateRange = {
  from?: string;
  to?: string;
};

const getCompletions = async (templateId: string, dateRange?: StatsDateRange) => {
  const response = await apiClient.get<WorkoutCompletionDto[]>("/stats/completions", {
    params: {
      templateId,
      from: dateRange?.from,
      to: dateRange?.to,
    },
  });

  return response.data;
};

const getExerciseProgress = async (
  templateId: string,
  exerciseTypeId: string,
  dateRange?: StatsDateRange,
) => {
  const response = await apiClient.get<ExerciseProgressDto[]>(
    "/stats/exercise-progress",
    {
      params: {
        templateId,
        exerciseTypeId,
        from: dateRange?.from,
        to: dateRange?.to,
      },
    },
  );

  return response.data;
};

export const statsApi = {
  getCompletions,
  getExerciseProgress,
};
