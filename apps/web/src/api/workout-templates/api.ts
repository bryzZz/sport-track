import { api } from "../api";

import type {
  UpdateWorkoutTemplateExerciseCommentPayload,
  WorkoutTemplate,
  WorkoutTemplateExercise,
} from "./types";

export const getWorkoutTemplates = () => {
  return api.get<WorkoutTemplate[]>("/workout-templates").then((res) => res.data);
};

export const getWorkoutTemplate = (templateId: string) => {
  return api
    .get<WorkoutTemplate>(`/workout-templates/${templateId}`)
    .then((res) => res.data);
};

export const updateWorkoutTemplateExerciseComment = (
  payload: UpdateWorkoutTemplateExerciseCommentPayload,
) => {
  const { templateId, templateExerciseId, comment } = payload;

  return api
    .patch<WorkoutTemplateExercise>(
      `/workout-templates/${templateId}/exercises/${templateExerciseId}/comment`,
      { comment },
    )
    .then((res) => res.data);
};
