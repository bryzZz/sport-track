import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { WeightUnit, WorkoutTemplate } from "api/workout-templates";

import type { WorkoutPerformFormValues } from "../types";

import { Sets } from "./Sets";

type ExerciseItemProps = {
  index: number;
  planExercise: WorkoutTemplate["exercises"][number];
};

const convertWeight = (value: number, from: WeightUnit, to: WeightUnit) => {
  const KG_TO_LBS = 2.2046226218;
  const converted =
    from === "KG" && to === "LBS" ? value * KG_TO_LBS : value / KG_TO_LBS;

  return Math.round(converted / 0.25) * 0.25;
};

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  index,
  planExercise,
}) => {
  const { control, register, setValue } =
    useFormContext<WorkoutPerformFormValues>();

  const currentWeightUnit = useWatch({
    control,
    name: `exercises.${index}.template.weightUnit`,
  });
  const templateSets = useWatch({
    control,
    name: `exercises.${index}.template.sets`,
  });
  const sets = useWatch({
    control,
    name: `exercises.${index}.sets`,
  });

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

  const handleToggleWeightUnit = () => {
    const nextWeightUnit = currentWeightUnit === "KG" ? "LBS" : "KG";

    sets.forEach((setItem, setIndex) => {
      const convertedWeight = convertWeight(
        setItem.weight,
        currentWeightUnit,
        nextWeightUnit,
      );

      setValue(`exercises.${index}.sets.${setIndex}.weight`, convertedWeight, {
        shouldDirty: true,
      });
    });

    templateSets.forEach((setItem, setIndex) => {
      const convertedWeight = convertWeight(
        Number(setItem.weight),
        currentWeightUnit,
        nextWeightUnit,
      );

      setValue(
        `exercises.${index}.template.sets.${setIndex}.weight`,
        convertedWeight,
        { shouldDirty: true },
      );
    });

    setValue(`exercises.${index}.template.weightUnit`, nextWeightUnit, {
      shouldDirty: true,
    });
  };

  return (
    <div className="border-b pb-3">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-2xl">{planExercise.exerciseType.name}</h2>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          rows={2}
          placeholder="Комментарий к упражнению"
          {...register(`exercises.${index}.template.comment`)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="grid grid-cols-[40px_1fr_90px_90px_48px] gap-2">
            <div className="py-1 text-center font-medium">Set</div>
            <div className="py-1 text-center font-medium">Plan</div>
            <button
              className="cursor-pointer py-1 text-center font-medium"
              type="button"
              onClick={handleToggleWeightUnit}
            >
              {currentWeightUnit}
            </button>
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

          <Sets
            exerciseIndex={index}
            planSets={templateSets}
            weightUnit={currentWeightUnit}
          />
        </div>
      </div>
    </div>
  );
};
