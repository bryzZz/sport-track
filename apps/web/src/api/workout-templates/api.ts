import { api } from "../api";

import type { UpsertWorkoutTemplatePayload, WorkoutTemplate } from "./types";

export const getWorkoutTemplates = () => {
  return api
    .get<WorkoutTemplate[]>("/workout-templates")
    .then((res) => res.data);
};

export const getWorkoutTemplate = (templateId: string) => {
  return api
    .get<WorkoutTemplate>(`/workout-templates/${templateId}`)
    .then((res) => res.data);
};

export const createWorkoutTemplate = (
  payload: UpsertWorkoutTemplatePayload,
) => {
  return api
    .post<WorkoutTemplate>("/workout-templates", payload)
    .then((res) => res.data);
};

export const updateWorkoutTemplate = (
  templateId: string,
  payload: UpsertWorkoutTemplatePayload,
) => {
  return api
    .put<WorkoutTemplate>(`/workout-templates/${templateId}`, payload)
    .then((res) => res.data);
};
