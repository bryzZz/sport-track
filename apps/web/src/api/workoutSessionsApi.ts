import { apiClient } from "./client";
import type { CreateWorkoutSessionPayload } from "./types";

const create = async (payload: CreateWorkoutSessionPayload) => {
  const response = await apiClient.post("/workout-sessions", payload);

  return response.data;
};

export const workoutSessionsApi = {
  create,
};
