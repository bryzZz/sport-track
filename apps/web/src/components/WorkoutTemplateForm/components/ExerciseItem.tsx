import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import type { ExerciseType } from "api/exercise-types";
import type { WeightUnit } from "api/workout-templates";

import { AutoResizeTextarea } from "components/AutoResizeTextarea";

import type { WorkoutTemplateFormValues } from "../WorkoutTemplateForm";

import { Sets } from "./Sets";

interface ExerciseItemProps {
  index: number;
  exerciseTypes: ExerciseType[];
  isExerciseTypesLoading: boolean;
  isExerciseTypesError: boolean;
  onRemove: () => void;
}

const convertWeight = (value: number, from: WeightUnit, to: WeightUnit) => {
  const KG_TO_LBS = 2.2046226218;
  const converted =
    from === "KG" && to === "LBS" ? value * KG_TO_LBS : value / KG_TO_LBS;

  return Math.round(converted / 0.25) * 0.25;
};

export const ExerciseItem: React.FC<ExerciseItemProps> = (props) => {
  const {
    index,
    exerciseTypes,
    isExerciseTypesLoading,
    isExerciseTypesError,
    onRemove,
  } = props;

  const { control, register, setValue } =
    useFormContext<WorkoutTemplateFormValues>();

  const currentWeightUnit = useWatch({
    control,
    name: `exercises.${index}.weightUnit`,
  });
  const sets = useWatch({
    control,
    name: `exercises.${index}.sets`,
  });

  const handleToggleWeightUnit = () => {
    const nextWeightUnit = currentWeightUnit === "KG" ? "LBS" : "KG";

    sets.forEach((setItem, setIndex) => {
      const convertedWeight = convertWeight(
        Number(setItem.weight),
        currentWeightUnit,
        nextWeightUnit,
      );

      setValue(`exercises.${index}.sets.${setIndex}.weight`, convertedWeight, {
        shouldDirty: true,
      });
    });

    setValue(`exercises.${index}.weightUnit`, nextWeightUnit, {
      shouldDirty: true,
    });
  };

  return (
    <div className="border-b pb-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          aria-label="Move exercise"
          className="exercise-drag-handle inline-flex cursor-grab items-center rounded border px-3 py-1.5 text-base leading-5 active:cursor-grabbing"
          type="button"
        >
          Drag
        </button>

        <Controller
          control={control}
          name={`exercises.${index}.exerciseTypeId`}
          render={({ field }) => (
            <select
              className="min-w-55 flex-1 appearance-none rounded border border-zinc-600 bg-transparent px-3 py-1.5 text-base leading-5"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isExerciseTypesLoading || isExerciseTypesError}
            >
              <option value="">
                {isExerciseTypesLoading
                  ? "Loading exercises..."
                  : isExerciseTypesError
                    ? "Failed to load exercises"
                    : "Select exercise"}
              </option>
              {exerciseTypes.map((exerciseType) => (
                <option key={exerciseType.id} value={exerciseType.id}>
                  {exerciseType.name}
                </option>
              ))}
            </select>
          )}
        />

        <button
          className="inline-flex cursor-pointer items-center rounded border px-3 py-1.5 text-base leading-5"
          type="button"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-[40px_90px_140px] gap-2 text-sm">
        <div className="py-1 text-center font-medium">Set</div>
        <button
          className="cursor-pointer py-1 text-center font-medium"
          type="button"
          onClick={handleToggleWeightUnit}
        >
          {currentWeightUnit}
        </button>
        <div className="py-1 text-center font-medium">Reps</div>
      </div>

      <Sets exerciseIndex={index} />

      <div className="mt-2">
        <AutoResizeTextarea
          className="w-full rounded border border-zinc-600 bg-transparent px-2 py-1"
          placeholder="Comment"
          minRows={1}
          maxRows={5}
          {...register(`exercises.${index}.comment`)}
        />
      </div>
    </div>
  );
};
