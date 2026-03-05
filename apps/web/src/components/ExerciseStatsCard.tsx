import React from "react";

import { ExerciseSetsChart } from "./ExerciseSetsChart";

type ExerciseSet = {
  reps: number;
  weight: number;
};

type ExerciseRecord = {
  date: string;
  done: boolean;
  sets: ExerciseSet[];
};

export type ExerciseStats = {
  id: string;
  name: string;
  bestSet: {
    reps: number;
    weight: number;
  };
  records: ExerciseRecord[];
};

type ExerciseStatsCardProps = {
  exercise: ExerciseStats;
};

export const ExerciseStatsCard: React.FC<ExerciseStatsCardProps> = ({
  exercise,
}) => {
  return (
    <div className="min-w-0 rounded-xl border p-4">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold">{exercise.name}</h3>
        <p className="text-sm text-neutral-600">
          Best set: {exercise.bestSet.reps} × {exercise.bestSet.weight} kg
        </p>
      </div>

      <ExerciseSetsChart records={exercise.records} />
    </div>
  );
};
