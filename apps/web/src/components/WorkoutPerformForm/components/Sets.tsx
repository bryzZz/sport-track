import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WeightUnit } from "api/workout-templates";

import type {
  WorkoutPerformFormValues,
  WorkoutPerformTemplateSetValues,
} from "../types";

import { SetItem } from "./SetItem";

type SetsProps = {
  exerciseIndex: number;
  planSets: WorkoutPerformTemplateSetValues[];
  weightUnit: WeightUnit;
};

export const Sets: React.FC<SetsProps> = ({
  exerciseIndex,
  planSets,
  weightUnit,
}) => {
  const { control } = useFormContext<WorkoutPerformFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  const handleAddSet = () => {
    const lastSet = fields[fields.length - 1];

    const nextSet = {
      reps: lastSet?.reps ?? 0,
      weight: lastSet?.weight ?? 0,
      partialReps: lastSet?.partialReps,
      isCompleted: false,
    };

    append(nextSet);
  };

  const handleRemoveSet = (setIndex: number) => {
    const shouldRemove = window.confirm("Удалить подход?");

    if (!shouldRemove) {
      return;
    }

    remove(setIndex);
  };

  return (
    <div className="flex flex-col gap-2">
      {fields.map((setItem, index) => (
        <SetItem
          key={setItem.id}
          exerciseIndex={exerciseIndex}
          index={index}
          planSet={planSets[index]}
          onRemove={handleRemoveSet}
          weightUnit={weightUnit}
        />
      ))}

      <div className="grid grid-cols-[40px_1fr_90px_90px_48px] items-center gap-2">
        <div className="flex items-center justify-center">
          <button
            className="size-7 cursor-pointer rounded-full border text-center"
            type="button"
            aria-label="Добавить подход"
            onClick={handleAddSet}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
