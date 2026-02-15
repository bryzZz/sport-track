import { api } from "../api";

import type { CreateWorkoutSessionPayload } from "./types";

export const createWorkoutSession = (payload: CreateWorkoutSessionPayload) => {
  return api.post("/workout-sessions", payload).then((res) => res.data);
};
