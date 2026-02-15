import type { WorkoutTemplateDto } from "../../api/types";

export type WorkoutPerformSetValues = {
  reps: number;
  partialReps?: number;
  weight: number;
  isCompleted: boolean;
};

export type WorkoutPerformExerciseValues = {
  exerciseTypeId: string;
  templateExerciseId: string;
  sets: WorkoutPerformSetValues[];
};

export type WorkoutPerformFormValues = {
  rpe: number;
  exercises: WorkoutPerformExerciseValues[];
};

export type WorkoutPerformTemplate = WorkoutTemplateDto;
export type WorkoutPerformTemplateExercise =
  WorkoutPerformTemplate["exercises"][number];
