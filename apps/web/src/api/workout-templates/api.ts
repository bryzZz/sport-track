import { api } from "../api";

import type { WorkoutTemplate } from "./types";

export const getWorkoutTemplates = () => {
  return api.get<WorkoutTemplate[]>("/workout-templates").then((res) => res.data);
};

export const getWorkoutTemplate = (templateId: string) => {
  return api
    .get<WorkoutTemplate>(`/workout-templates/${templateId}`)
    .then((res) => res.data);
};
