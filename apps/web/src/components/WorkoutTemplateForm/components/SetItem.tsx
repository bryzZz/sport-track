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

  const handleSelectAllOnFocus = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    event.target.select();
  };

  return (
    <div className="grid grid-cols-[40px_90px_140px] items-center gap-2">
      <div className="flex items-center justify-center">
        <button
          className="size-7 cursor-pointer rounded-full border text-center"
          type="button"
          onClick={onRemove}
        >
          {index + 1}
        </button>
      </div>

      <div>
        <input
          className="w-full rounded-md border px-3 py-1.5 text-center outline-black"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          onFocus={handleSelectAllOnFocus}
          {...register(`exercises.${exerciseIndex}.sets.${index}.weight`, {
            valueAsNumber: true,
          })}
        />
      </div>

      <div>
        <input
          className="w-full rounded-md border px-3 py-1.5 text-center outline-black"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          onFocus={handleSelectAllOnFocus}
          {...register(`exercises.${exerciseIndex}.sets.${index}.reps`, {
            valueAsNumber: true,
          })}
        />
      </div>
    </div>
  );
};
