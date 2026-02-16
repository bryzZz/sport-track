export type WorkoutSessionSetPayload = {
  reps: number;
  partialReps?: number;
  weight: number;
  isCompleted: boolean;
};

export type WorkoutSessionExercisePayload = {
  exerciseTypeId: string;
  templateExerciseId: string;
  orderIndex: number;
  comment?: string;
  sets: WorkoutSessionSetPayload[];
};

export type CreateWorkoutSessionPayload = {
  templateId: string;
  performedAt: string;
  rpe: number;
  exercises: WorkoutSessionExercisePayload[];
};
