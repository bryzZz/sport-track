export type WorkoutTemplateExerciseType = {
  id: string;
  name: string;
  createdAt: string;
};

export type WorkoutTemplateSet = {
  id: string;
  orderIndex: number;
  reps: number;
  partialReps: number | null;
  weight: string;
};

export type WorkoutTemplateExercise = {
  id: string;
  templateId: string;
  exerciseTypeId: string;
  orderIndex: number;
  comment: string | null;
  exerciseType: WorkoutTemplateExerciseType;
  sets: WorkoutTemplateSet[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutTemplateExercise[];
};

export type UpdateWorkoutTemplateExerciseCommentPayload = {
  templateId: string;
  templateExerciseId: string;
  comment: string | null;
};
