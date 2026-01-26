import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormFormValues } from "../WorkoutTemplateForm";
import { SetItem } from "./SetItem";

interface SetsProps {
  exerciseIndex: number;
}

export const Sets: React.FC<SetsProps> = (props) => {
  const { exerciseIndex } = props;

  const { control } = useFormContext<WorkoutTemplateFormFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  const handleAddSet = () => {
    append({
      phases: [{ reps: 10, weight: 10, type: "strict" }],
    });
  };

  const handleRemoveSet = (index: number) => {
    remove(index);
  };

  return (
    <div className="mt-2">
      <p>Sets: </p>

      <div className="flex w-full flex-col gap-2">
        {fields.map((setItem, index) => (
          <SetItem
            key={setItem.id}
            exerciseIndex={exerciseIndex}
            index={index}
            onRemove={() => handleRemoveSet(index)}
          />
        ))}
      </div>

      <button
        className="mt-2 cursor-pointer rounded border px-4 py-2"
        type="button"
        onClick={handleAddSet}
      >
        Add Set
      </button>
    </div>
  );
};
