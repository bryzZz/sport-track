export type StatsDateRange = {
  from?: string;
  to?: string;
};

export type WorkoutOverviewStats = {
  template: {
    id: string;
    name: string;
  };
  summary: {
    sessionsCount: number;
    lastSessionDate: string | null;
    totalVolume: {
      value: number;
      unit: "kg";
      trend: {
        period: "4w";
        deltaPercent: number | null;
      };
    };
    averageIntensity: {
      rpe: number | null;
    };
  };
  exercises: WorkoutOverviewExercise[];
};

export type WorkoutOverviewExercisePhase = {
  reps: number;
  weight: number;
  type: "strict" | "cheating";
};

export type WorkoutOverviewExerciseSet = {
  phases: WorkoutOverviewExercisePhase[];
};

export type WorkoutOverviewExerciseRecord = {
  date: string;
  done: boolean;
  sets: WorkoutOverviewExerciseSet[];
};

export type WorkoutOverviewExercise = {
  id: string;
  name: string;
  bestSet: {
    reps: number;
    weight: number;
  };
  records: WorkoutOverviewExerciseRecord[];
};
