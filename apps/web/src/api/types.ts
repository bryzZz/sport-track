export type ExerciseTypeDto = {
  id: string;
  name: string;
  createdAt: string;
};

export type WorkoutTemplateSetDto = {
  id: string;
  orderIndex: number;
  reps: number;
  partialReps: number | null;
  weight: string;
};

export type WorkoutTemplateExerciseDto = {
  id: string;
  templateId: string;
  exerciseTypeId: string;
  orderIndex: number;
  comment: string | null;
  exerciseType: ExerciseTypeDto;
  sets: WorkoutTemplateSetDto[];
};

export type WorkoutTemplateDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutTemplateExerciseDto[];
};

export type WorkoutSessionSetPayload = {
  reps: number;
  partialReps?: number;
  weight: number;
  isCompleted: boolean;
};

export type WorkoutSessionExercisePayload = {
  exerciseTypeId: string;
  templateExerciseId?: string;
  orderIndex: number;
  sets: WorkoutSessionSetPayload[];
};

export type CreateWorkoutSessionPayload = {
  templateId: string;
  performedAt?: string;
  rpe: number;
  exercises: WorkoutSessionExercisePayload[];
};

export type WorkoutCompletionDto = {
  date: string;
  done: boolean;
};

export type ExerciseProgressSetDto = {
  orderIndex: number;
  reps: number;
  partialReps: number | null;
  weight: number;
  isCompleted: boolean;
};

export type ExerciseProgressDto = {
  sessionDate: string;
  sets: ExerciseProgressSetDto[];
};
