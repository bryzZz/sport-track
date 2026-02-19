import type { WeightUnit } from "../../api/workout-templates";

export type WorkoutPerformSetValues = {
  reps: number;
  partialReps?: number;
  weight: number;
  isCompleted: boolean;
};

export type WorkoutPerformTemplateSetValues = {
  orderIndex: number;
  reps: number;
  partialReps?: number;
  weight: number;
};

export type WorkoutPerformTemplateValues = {
  comment: string;
  weightUnit: WeightUnit;
  sets: WorkoutPerformTemplateSetValues[];
};

export type WorkoutPerformPlanSet = {
  reps: number;
  partialReps: number | null;
  weight: number;
};

export type WorkoutPerformExerciseValues = {
  templateExerciseId: string;
  template: WorkoutPerformTemplateValues;
  sets: WorkoutPerformSetValues[];
};

export type WorkoutPerformFormValues = {
  rpe: number;
  exercises: WorkoutPerformExerciseValues[];
};
