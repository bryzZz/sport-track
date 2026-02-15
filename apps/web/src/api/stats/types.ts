export type StatsDateRange = {
  from?: string;
  to?: string;
};

export type WorkoutCompletion = {
  date: string;
  done: boolean;
};

export type ExerciseProgressSet = {
  orderIndex: number;
  reps: number;
  partialReps: number | null;
  weight: number;
  isCompleted: boolean;
};

export type ExerciseProgress = {
  sessionDate: string;
  sets: ExerciseProgressSet[];
};
