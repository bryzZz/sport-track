import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Exercises } from "./components/Exercises";

export type WorkoutTemplateFormSetValues = {
  reps: number;
  partialReps?: number;
  weight: number;
};

export type WorkoutTemplateFormExerciseValues = {
  exerciseTypeId: string;
  comment: string;
  sets: WorkoutTemplateFormSetValues[];
};

export type WorkoutTemplateFormValues = {
  name: string;
  exercises: WorkoutTemplateFormExerciseValues[];
};

interface WorkoutTemplateFormProps {
  defaultValues: WorkoutTemplateFormValues;
  onSubmit: (values: WorkoutTemplateFormValues) => Promise<void> | void;
  submitLabel: string;
}

export const WorkoutTemplateForm: React.FC<WorkoutTemplateFormProps> = (
  props,
) => {
  const { defaultValues, onSubmit, submitLabel } = props;

  const methods = useForm<WorkoutTemplateFormValues>({
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="mx-auto flex max-w-3xl flex-col items-start gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="w-full rounded border px-4 py-2"
          placeholder="Название шаблона"
          type="text"
          {...register("name")}
        />

        <Exercises />

        <button
          className="cursor-pointer rounded border px-6 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
      </form>
    </FormProvider>
  );
};
