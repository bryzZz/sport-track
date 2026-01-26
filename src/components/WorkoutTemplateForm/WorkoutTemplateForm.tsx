import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { WorkoutTemplate } from "../../constants";
import { Exercises } from "./components/Exercises";

export type WorkoutTemplateFormFormValues = Omit<WorkoutTemplate, "id">;

interface WorkoutTemplateFormProps {
  defaultValues?: Partial<WorkoutTemplateFormFormValues>;
}

export const WorkoutTemplateForm: React.FC<WorkoutTemplateFormProps> = (
  props,
) => {
  const { defaultValues } = props;

  const methods = useForm<WorkoutTemplateFormFormValues>({
    defaultValues: {
      name: "",
      exercises: [],
      ...defaultValues,
    },
  });

  const { register } = methods;

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4">
        <input
          className="w-full rounded border px-4 py-2"
          placeholder="Template Name"
          type="text"
          {...register("name")}
        />

        <Exercises />
      </div>
    </FormProvider>
  );
};
