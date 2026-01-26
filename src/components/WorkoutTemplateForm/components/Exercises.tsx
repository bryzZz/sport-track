import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { WorkoutTemplateFormFormValues } from "../WorkoutTemplateForm";
import { ExerciseItem } from "./ExerciseItem";

export const Exercises: React.FC = () => {
  const { control, getValues } =
    useFormContext<WorkoutTemplateFormFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleAddExercise = () => {
    const currentExercises = getValues("exercises");
    const lastExercise = currentExercises.at(-1);

    if (lastExercise?.exerciseId === "") return;

    append({
      exerciseId: "",
      sets: [{ phases: [{ reps: 10, weight: 10, type: "strict" }] }],
      comment: "",
    });
  };

  const handleRemoveExercise = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      {fields.map((exercise, index) => (
        <ExerciseItem
          key={exercise.id}
          index={index}
          onRemove={() => handleRemoveExercise(index)}
        />
      ))}

      <button
        className="cursor-pointer rounded border px-6 py-2"
        type="button"
        onClick={handleAddExercise}
      >
        Add Exercise
      </button>
    </div>
  );
};
