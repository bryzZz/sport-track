import type { WorkoutTemplate } from "../../api/workout-templates";

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

export type WorkoutPerformTemplate = WorkoutTemplate;
export type WorkoutPerformTemplateExercise =
  WorkoutPerformTemplate["exercises"][number];
