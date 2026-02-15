import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { WorkoutTemplateNew } from "constants";

import type { WorkoutPerformFormValues } from "../WorkoutPerformForm";

type SetItemProps = {
  exerciseIndex: number;
  index: number;
  planSet?: WorkoutTemplateNew["exercises"][number]["sets"][number];
  onRemove: (index: number) => void;
};

export const SetItem: React.FC<SetItemProps> = ({
  exerciseIndex,
  index,
  planSet,
  onRemove,
}) => {
  const { control, register } = useFormContext<WorkoutPerformFormValues>();

  const partialReps =
    useWatch({
      control,
      name: `exercises.${exerciseIndex}.sets.${index}.partialReps`,
    }) ?? undefined;

  const hasPartialReps = partialReps !== undefined;
  const planText = planSet
    ? `${planSet.weight}кг x ${planSet.reps}${
        planSet.partialReps !== undefined ? ` | ${planSet.partialReps}` : ""
      }`
    : "-";

  return (
    <div className="grid grid-cols-[40px_1fr_90px_90px_48px] items-center gap-2">
      <div className="flex items-center justify-center">
        <button
          className="size-7 cursor-pointer rounded-full border text-center"
          type="button"
          aria-label={`Удалить подход ${index + 1}`}
          onClick={() => onRemove(index)}
        >
          {index + 1}
        </button>
      </div>
      <div className="text-center leading-tight">{planText}</div>
      <div>
        <input
          className="w-full rounded-md border px-3 py-1.5 text-center outline-black"
          inputMode="numeric"
          {...register(`exercises.${exerciseIndex}.sets.${index}.weight`, {
            valueAsNumber: true,
          })}
        />
      </div>
      <div className="relative flex items-center rounded-md border outline-black has-focus:outline">
        <input
          className="w-full px-3 py-1.5 text-center outline-none"
          inputMode="numeric"
          {...register(`exercises.${exerciseIndex}.sets.${index}.reps`, {
            valueAsNumber: true,
          })}
        />

        {hasPartialReps && (
          <>
            <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px bg-black" />
            <input
              className="w-full px-3 py-1.5 text-center outline-none"
              inputMode="numeric"
              {...register(
                `exercises.${exerciseIndex}.sets.${index}.partialReps`,
                { valueAsNumber: true },
              )}
            />
          </>
        )}
      </div>
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          aria-label={`Подход ${index + 1}`}
          {...register(`exercises.${exerciseIndex}.sets.${index}.isCompleted`)}
        />
      </div>
    </div>
  );
};
