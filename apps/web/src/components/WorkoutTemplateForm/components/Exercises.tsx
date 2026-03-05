import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ReactSortable } from "react-sortablejs";

import { useGetExerciseTypes } from "api/exercise-types";

import type { WorkoutTemplateFormValues } from "../WorkoutTemplateForm";

import { ExerciseItem } from "./ExerciseItem";

export const Exercises: React.FC = () => {
  const { control, getValues } = useFormContext<WorkoutTemplateFormValues>();
  const {
    data: exerciseTypes = [],
    isLoading: isExerciseTypesLoading,
    isError: isExerciseTypesError,
  } = useGetExerciseTypes();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleAddExercise = () => {
    const currentExercises = getValues("exercises");
    const lastExercise = currentExercises.at(-1);

    if (lastExercise?.exerciseTypeId === "") {
      return;
    }

    append({
      exerciseTypeId: "",
      weightUnit: "KG",
      sets: [{ reps: 10, weight: 10 }],
      comment: "",
    });
  };

  const handleRemoveExercise = (index: number) => {
    const shouldRemove = window.confirm("Remove exercise?");

    if (!shouldRemove) {
      return;
    }

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
    <div className="flex w-full flex-col gap-4">
      <ReactSortable
        animation={150}
        handle=".exercise-drag-handle"
        list={fields}
        setList={handleReorderExercises}
        className="flex w-full flex-col gap-4"
      >
        {fields.map((exercise, index) => (
          <ExerciseItem
            key={exercise.id}
            index={index}
            exerciseTypes={exerciseTypes}
            isExerciseTypesError={isExerciseTypesError}
            isExerciseTypesLoading={isExerciseTypesLoading}
            onRemove={() => handleRemoveExercise(index)}
          />
        ))}
      </ReactSortable>

      <button
        className="cursor-pointer rounded border px-4 py-2"
        type="button"
        onClick={handleAddExercise}
      >
        Add Exercise
      </button>
    </div>
  );
};
