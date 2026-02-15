import { apiClient } from "./client";
import type { WorkoutTemplateDto } from "./types";

type UpdateWorkoutTemplateExerciseCommentPayload = {
  comment: string | null;
};

const getList = async () => {
  const response = await apiClient.get<WorkoutTemplateDto[]>("/workout-templates");

  return response.data;
};

const getById = async (id: string) => {
  const response = await apiClient.get<WorkoutTemplateDto>(`/workout-templates/${id}`);

  return response.data;
};

const updateExerciseComment = async (
  templateId: string,
  templateExerciseId: string,
  payload: UpdateWorkoutTemplateExerciseCommentPayload,
) => {
  const response = await apiClient.patch(
    `/workout-templates/${templateId}/exercises/${templateExerciseId}/comment`,
    payload,
  );

  return response.data;
};

export const workoutTemplatesApi = {
  getList,
  getById,
  updateExerciseComment,
};
