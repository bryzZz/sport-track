import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { exerciseTypes, type WorkoutTemplateNew } from "constants";

import type { WorkoutPerformFormValues } from "../WorkoutPerformForm";

import { Sets } from "./Sets";

type ExerciseItemProps = {
  index: number;
  planExercise?: WorkoutTemplateNew["exercises"][number];
};

const getExerciseName = (exerciseId: string) => {
  return (
    exerciseTypes.find((exercise) => exercise.id === exerciseId)?.name ??
    "Неизвестное упражнение"
  );
};

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  index,
  planExercise,
}) => {
  const { control, setValue } = useFormContext<WorkoutPerformFormValues>();

  const exerciseId =
    useWatch({
      control,
      name: `exercises.${index}.exerciseId`,
    }) ??
    planExercise?.exerciseId ??
    "";

  const sets =
    useWatch({
      control,
      name: `exercises.${index}.sets`,
    }) ?? [];

  const isAllCompleted =
    sets.length > 0 && sets.every((setItem) => setItem.isCompleted);

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const shouldCompleteAll = event.target.checked;

    if (!sets.length) {
      return;
    }

    for (let setIndex = 0; setIndex < sets.length; setIndex += 1) {
      setValue(
        `exercises.${index}.sets.${setIndex}.isCompleted`,
        shouldCompleteAll,
      );
    }
  };

  return (
    <div className="border-b pb-3">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-2xl">{getExerciseName(exerciseId)}</h2>
        {planExercise?.comment ? (
          <p className="text-sm text-slate-500">{planExercise.comment}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="grid grid-cols-[40px_1fr_90px_90px_48px] gap-2">
            <div className="py-1 text-center font-medium">Set</div>
            <div className="py-1 text-center font-medium">Plan</div>
            <div className="py-1 text-center font-medium">Kg</div>
            <div className="py-1 text-center font-medium">Reps</div>
            <div className="flex items-center justify-center">
              <input
                aria-label="Отметить все подходы"
                type="checkbox"
                checked={isAllCompleted}
                onChange={handleToggleAll}
              />
            </div>
          </div>

          <Sets exerciseIndex={index} planSets={planExercise?.sets ?? []} />
        </div>
      </div>
    </div>
  );
};
