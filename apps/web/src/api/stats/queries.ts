import { useQuery } from "@tanstack/react-query";

import { getCompletions, getExerciseProgress } from "./api";
import type { StatsDateRange } from "./types";

type GetExerciseProgressParams = {
  templateId: string;
  exerciseTypeId: string;
  dateRange?: StatsDateRange;
};

export const useGetCompletions = (templateId: string, dateRange?: StatsDateRange) => {
  return useQuery({
    queryKey: ["stats-completions", templateId, dateRange?.from, dateRange?.to],
    queryFn: () => getCompletions(templateId, dateRange),
    enabled: Boolean(templateId),
  });
};

export const useGetExerciseProgress = (params: GetExerciseProgressParams) => {
  const { templateId, exerciseTypeId, dateRange } = params;

  return useQuery({
    queryKey: [
      "stats-exercise-progress",
      templateId,
      exerciseTypeId,
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: () => getExerciseProgress(templateId, exerciseTypeId, dateRange),
    enabled: Boolean(templateId && exerciseTypeId),
  });
};
