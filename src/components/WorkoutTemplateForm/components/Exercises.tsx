import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";

import type { WorkoutTemplateFormFormValues } from "../WorkoutTemplateForm";
import { ExerciseItem } from "./ExerciseItem";

export const Exercises: React.FC = () => {
  const { control, getValues } =
    useFormContext<WorkoutTemplateFormFormValues>();

  const { fields, append, remove, move } = useFieldArray({
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

  const handleReorderExercises = (newOrder: typeof fields) => {
    const currentOrder = fields.map((item) => item.id);
    const nextOrder = newOrder.map((item) => item.id);

    nextOrder.forEach((id, toIndex) => {
      const fromIndex = currentOrder.indexOf(id);
      if (fromIndex === -1 || fromIndex === toIndex) return;

      move(fromIndex, toIndex);
      currentOrder.splice(toIndex, 0, currentOrder.splice(fromIndex, 1)[0]);
    });
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <ReactSortable
        animation={150}
        handle=".exercise-drag-handle"
        list={fields}
        setList={handleReorderExercises}
        className="flex w-full flex-col items-start gap-2"
      >
        {fields.map((exercise, index) => (
          <ExerciseItem
            key={exercise.id}
            index={index}
            onRemove={() => handleRemoveExercise(index)}
          />
        ))}
      </ReactSortable>

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
