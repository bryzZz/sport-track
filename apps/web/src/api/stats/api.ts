import { api } from "../api";

import type { StatsDateRange, WorkoutOverviewStats } from "./types";

export const getWorkoutOverviewStats = (templateId: string, dateRange?: StatsDateRange) => {
  return api
    .get<WorkoutOverviewStats>("/stats/workout-overview", {
      params: {
        templateId,
        from: dateRange?.from,
        to: dateRange?.to,
      },
    })
    .then((res) => res.data);
};
