import { api } from "../api";

import type { ExerciseProgress, StatsDateRange, WorkoutCompletion } from "./types";

export const getCompletions = (templateId: string, dateRange?: StatsDateRange) => {
  return api
    .get<WorkoutCompletion[]>("/stats/completions", {
      params: {
        templateId,
        from: dateRange?.from,
        to: dateRange?.to,
      },
    })
    .then((res) => res.data);
};

export const getExerciseProgress = (
  templateId: string,
  exerciseTypeId: string,
  dateRange?: StatsDateRange,
) => {
  return api
    .get<ExerciseProgress[]>("/stats/exercise-progress", {
      params: {
        templateId,
        exerciseTypeId,
        from: dateRange?.from,
        to: dateRange?.to,
      },
    })
    .then((res) => res.data);
};
