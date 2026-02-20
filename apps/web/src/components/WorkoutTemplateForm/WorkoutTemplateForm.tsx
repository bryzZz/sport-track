import React from "react";
import { FormProvider } from "react-hook-form";

import type { WeightUnit } from "api/workout-templates";
import { format } from "date-fns";
import { useFormWithDraft } from "utils/hooks/useFormDraft";

import { Exercises } from "./components/Exercises";

export type WorkoutTemplateFormSetValues = {
  reps: number;
  partialReps?: number;
  weight: number;
};

export type WorkoutTemplateFormExerciseValues = {
  exerciseTypeId: string;
  weightUnit: WeightUnit;
  comment: string;
  sets: WorkoutTemplateFormSetValues[];
};

export type WorkoutTemplateFormValues = {
  name: string;
  exercises: WorkoutTemplateFormExerciseValues[];
};

interface WorkoutTemplateFormProps {
  defaultValues: WorkoutTemplateFormValues;
  draftStorageKey: string;
  onSubmit: (values: WorkoutTemplateFormValues) => Promise<boolean> | boolean;
  submitLabel: string;
}

export const WorkoutTemplateForm: React.FC<WorkoutTemplateFormProps> = (
  props,
) => {
  const { defaultValues, draftStorageKey, onSubmit, submitLabel } = props;

  const { clearDraft, methods, restoredDraftAt, savedDraftAt } =
    useFormWithDraft<WorkoutTemplateFormValues>({
      storageKey: draftStorageKey,
      defaultValues,
    });

  const handleFormSubmit = async (values: WorkoutTemplateFormValues) => {
    let isSuccess = false;

    try {
      isSuccess = await onSubmit(values);
    } catch {
      isSuccess = false;
    }

    if (!isSuccess) {
      return;
    }

    clearDraft();
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
    register,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <fieldset className="flex flex-col gap-6" disabled={isSubmitting}>
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
            {isSubmitting ? "Сохраняем..." : submitLabel}
          </button>
        </fieldset>

        <div>
          {restoredDraftAt && (
            <p className="text-sm text-slate-500">
              Черновик восстановлен в {format(restoredDraftAt, "HH:mm:ss")}
            </p>
          )}

          {savedDraftAt && (
            <p className="text-sm text-slate-500">
              Черновик сохранен в {format(savedDraftAt, "HH:mm:ss")}
            </p>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
