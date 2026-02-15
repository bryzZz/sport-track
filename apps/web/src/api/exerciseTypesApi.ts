import { apiClient } from "./client";
import type { ExerciseTypeDto } from "./types";

const getAll = async () => {
  const response = await apiClient.get<ExerciseTypeDto[]>("/exercise-types");

  return response.data;
};

export const exerciseTypesApi = {
  getAll,
};
