import { FormProvider } from "react-hook-form";

import type { WorkoutTemplate } from "api/workout-templates";
import { format } from "date-fns";
import { useFormWithDraft } from "utils/hooks/useFormDraft";

import { Exercises } from "./components/Exercises";
import type { WorkoutPerformFormValues } from "./types";

type WorkoutPerformFormProps = {
  template: WorkoutTemplate;
  defaultValues: WorkoutPerformFormValues;
  onSubmit: (values: WorkoutPerformFormValues) => Promise<boolean> | boolean;
};

export const WorkoutPerformForm = ({
  template,
  defaultValues,
  onSubmit,
}: WorkoutPerformFormProps) => {
  const { clearDraft, methods, restoredDraftAt, savedDraftAt } =
    useFormWithDraft<WorkoutPerformFormValues>({
      storageKey: `workout-perform:draft:v3:${template.id}`,
      defaultValues,
    });

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = methods;

  const handleFormSubmit = async (values: WorkoutPerformFormValues) => {
    const isSuccess = await onSubmit(values);

    if (!isSuccess) {
      return;
    }

    clearDraft();
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <fieldset className="flex flex-col gap-6" disabled={isSubmitting}>
          <Exercises template={template} />

          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <label className="text-sm text-slate-600">RPE</label>
            <input
              className="w-28 rounded border px-3 py-2"
              type="number"
              min={1}
              max={10}
              {...register("rpe", { valueAsNumber: true })}
            />
          </div>

          <button
            className="cursor-pointer rounded border px-6 py-2 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохраняем..." : "Завершить тренировку"}
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
