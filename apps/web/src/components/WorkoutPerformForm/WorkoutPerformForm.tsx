import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Exercises } from "./components/Exercises";
import type { WorkoutPerformFormValues, WorkoutPerformTemplate } from "./types";

type WorkoutPerformFormProps = {
  template: WorkoutPerformTemplate;
  defaultValues: WorkoutPerformFormValues;
  onSubmit: (values: WorkoutPerformFormValues) => Promise<void> | void;
};

export const WorkoutPerformForm: React.FC<WorkoutPerformFormProps> = ({
  template,
  defaultValues,
  onSubmit,
}) => {
  const methods = useForm<WorkoutPerformFormValues>({
    defaultValues,
  });

  const { handleSubmit, register } = methods;

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Exercises template={template} />

        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <label className="text-sm text-slate-600">RPE</label>
          <input
            className="w-28 rounded border px-3 py-2"
            type="number"
            min={1}
            max={10}
            defaultValue={7}
            {...register("rpe", { valueAsNumber: true })}
          />
        </div>

        <button
          className="cursor-pointer rounded border px-6 py-2"
          type="submit"
        >
          Завершить тренировку
        </button>
      </form>
    </FormProvider>
  );
};
