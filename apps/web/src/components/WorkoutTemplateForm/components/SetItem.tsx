import React from "react";
import { useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormValues } from "../WorkoutTemplateForm";

interface SetItemProps {
  exerciseIndex: number;
  index: number;
  onRemove: () => void;
}

export const SetItem: React.FC<SetItemProps> = (props) => {
  const { exerciseIndex, index, onRemove } = props;
  const { register } = useFormContext<WorkoutTemplateFormValues>();

  return (
    <div className="rounded border border-zinc-700 p-2">
      <div className="mb-2 flex items-center justify-between">
        <span>{index + 1}.</span>
        <button
          className="cursor-pointer rounded border px-2 py-1 text-sm"
          type="button"
          onClick={onRemove}
        >
          Remove Set
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          className="w-full rounded border border-zinc-600 bg-transparent px-2 py-1"
          type="number"
          min={0}
          step={0.5}
          placeholder="Вес"
          {...register(`exercises.${exerciseIndex}.sets.${index}.weight`, {
            valueAsNumber: true,
          })}
        />

        <input
          className="w-full rounded border border-zinc-600 bg-transparent px-2 py-1"
          type="number"
          min={1}
          placeholder="Повторы"
          {...register(`exercises.${exerciseIndex}.sets.${index}.reps`, {
            valueAsNumber: true,
          })}
        />

        <input
          className="w-full rounded border border-zinc-600 bg-transparent px-2 py-1"
          type="number"
          min={0}
          placeholder="Частичные"
          {...register(`exercises.${exerciseIndex}.sets.${index}.partialReps`, {
            setValueAs: (value: string) =>
              value === "" ? undefined : Number(value),
          })}
        />
      </div>
    </div>
  );
};
