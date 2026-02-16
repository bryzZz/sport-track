import { useQuery } from "@tanstack/react-query";

import { getWorkoutOverviewStats } from "./api";
import type { StatsDateRange } from "./types";

export const useGetWorkoutOverviewStats = (
  templateId: string,
  dateRange?: StatsDateRange,
) => {
  return useQuery({
    queryKey: ["stats-workout-overview", templateId, dateRange?.from, dateRange?.to],
    queryFn: () => getWorkoutOverviewStats(templateId, dateRange),
    enabled: Boolean(templateId),
  });
};
