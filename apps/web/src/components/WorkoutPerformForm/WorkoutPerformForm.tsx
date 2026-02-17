import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { format, isValid } from "date-fns";

import { Exercises } from "./components/Exercises";
import type { WorkoutPerformFormValues, WorkoutPerformTemplate } from "./types";

type WorkoutPerformFormProps = {
  template: WorkoutPerformTemplate;
  defaultValues: WorkoutPerformFormValues;
  onSubmit: (values: WorkoutPerformFormValues) => Promise<void> | void;
  draftStorageKey: string;
};

type WorkoutPerformDraft = {
  version: number;
  values: WorkoutPerformFormValues;
  updatedAt: string;
};

const DRAFT_VERSION = 1;
const DRAFT_SAVE_DELAY_MS = 400;

const isValidDraft = (value: unknown): value is WorkoutPerformDraft => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<WorkoutPerformDraft>;

  if (candidate.version !== DRAFT_VERSION) {
    return false;
  }

  if (!candidate.values || typeof candidate.values !== "object") {
    return false;
  }

  if (typeof candidate.values.rpe !== "number") {
    return false;
  }

  if (!Array.isArray(candidate.values.exercises)) {
    return false;
  }

  return true;
};

const formatDraftTime = (value: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (!isValid(date)) {
    return "";
  }

  return format(date, "HH:mm:ss");
};

export const WorkoutPerformForm = ({
  template,
  defaultValues,
  onSubmit,
  draftStorageKey,
}: WorkoutPerformFormProps) => {
  const methods = useForm<WorkoutPerformFormValues>({
    defaultValues,
  });

  const {
    formState: { isSubmitting },
    getValues,
    handleSubmit,
    register,
    reset,
    watch,
  } = methods;
  const hasRestoredDraftRef = useRef(false);
  const saveDraftTimeoutRef = useRef<number | null>(null);
  const [restoredDraftAt, setRestoredDraftAt] = useState<string | null>(null);
  const [savedDraftAt, setSavedDraftAt] = useState<string | null>(null);

  useEffect(() => {
    if (hasRestoredDraftRef.current) {
      return;
    }

    hasRestoredDraftRef.current = true;

    try {
      const draftRaw = window.localStorage.getItem(draftStorageKey);

      if (!draftRaw) {
        return;
      }

      const parsedDraft: unknown = JSON.parse(draftRaw);

      if (!isValidDraft(parsedDraft)) {
        window.localStorage.removeItem(draftStorageKey);
        return;
      }

      reset(parsedDraft.values);
      setRestoredDraftAt(parsedDraft.updatedAt);
      setSavedDraftAt(parsedDraft.updatedAt);
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, reset]);

  useEffect(() => {
    const subscription = watch(() => {
      if (saveDraftTimeoutRef.current) {
        window.clearTimeout(saveDraftTimeoutRef.current);
      }

      saveDraftTimeoutRef.current = window.setTimeout(() => {
        const currentFormValues = getValues();
        const draft: WorkoutPerformDraft = {
          version: DRAFT_VERSION,
          values: currentFormValues,
          updatedAt: new Date().toISOString(),
        };

        try {
          window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
          setSavedDraftAt(draft.updatedAt);
        } catch {
          // ignore localStorage write errors in MVP
        }
      }, DRAFT_SAVE_DELAY_MS);
    });

    return () => {
      if (saveDraftTimeoutRef.current) {
        window.clearTimeout(saveDraftTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [draftStorageKey, getValues, watch]);

  const restoredDraftTime = formatDraftTime(restoredDraftAt);
  const savedDraftTime = formatDraftTime(savedDraftAt);

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
          {restoredDraftTime && (
            <p className="text-sm text-slate-500">
              Черновик восстановлен в {restoredDraftTime}
            </p>
          )}

          {savedDraftTime && (
            <p className="text-sm text-slate-500">
              Черновик сохранен в {savedDraftTime}
            </p>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
