import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type {
  WorkoutPerformFormValues,
  WorkoutPerformTemplate,
} from "../types";

import { ExerciseItem } from "./ExerciseItem";

type ExercisesProps = {
  template: WorkoutPerformTemplate;
};

export const Exercises: React.FC<ExercisesProps> = ({ template }) => {
  const { control } = useFormContext<WorkoutPerformFormValues>();

  const { fields } = useFieldArray({
    control,
    name: "exercises",
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {fields.map((exercise, index) => (
        <ExerciseItem
          key={exercise.id}
          index={index}
          planExercise={template.exercises[index]}
        />
      ))}
    </div>
  );
};
