import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormValues } from "../WorkoutTemplateForm";

import { SetItem } from "./SetItem";

interface SetsProps {
  exerciseIndex: number;
}

export const Sets: React.FC<SetsProps> = (props) => {
  const { exerciseIndex } = props;

  const { control } = useFormContext<WorkoutTemplateFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  const handleAddSet = () => {
    const lastSet = fields[fields.length - 1];

    append({
      reps: lastSet?.reps ?? 10,
      weight: lastSet?.weight ?? 10,
      partialReps: lastSet?.partialReps ?? undefined,
    });
  };

  const handleRemoveSet = (index: number) => {
    const shouldRemove = window.confirm("Remove set?");

    if (!shouldRemove) {
      return;
    }

    remove(index);
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex flex-col gap-2">
        {fields.map((setItem, index) => (
          <SetItem
            key={setItem.id}
            exerciseIndex={exerciseIndex}
            index={index}
            onRemove={() => handleRemoveSet(index)}
          />
        ))}
      </div>

      <div className="grid grid-cols-[40px_90px_140px] items-center gap-2">
        <div className="flex items-center justify-center">
          <button
            className="size-7 cursor-pointer rounded-full border text-center"
            type="button"
            aria-label="Add set"
            onClick={handleAddSet}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
