import { api } from "../api";

import type { ExerciseType } from "./types";

export const getExerciseTypes = () => {
  return api.get<ExerciseType[]>("/exercise-types").then((res) => res.data);
};
