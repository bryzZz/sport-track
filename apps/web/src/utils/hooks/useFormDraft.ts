import { useEffect, useRef, useState } from "react";
import type {
  DefaultValues,
  FieldValues,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";

type DraftEnvelope<TValues extends FieldValues> = {
  values: TValues;
  updatedAt: string;
};

type ReadFormDraftParams = {
  storageKey: string;
};

type ReadFormDraftResult<TValues extends FieldValues> = {
  values: TValues | null;
  restoredDraftAt: Date | null;
  shouldClearInvalidDraft: boolean;
};

const readFormDraft = <TValues extends FieldValues>({
  storageKey,
}: ReadFormDraftParams): ReadFormDraftResult<TValues> => {
  try {
    const draftRaw = window.localStorage.getItem(storageKey);

    if (!draftRaw) {
      return {
        values: null,
        restoredDraftAt: null,
        shouldClearInvalidDraft: false,
      };
    }

    const parsedDraft: unknown = JSON.parse(draftRaw);

    if (!parsedDraft || typeof parsedDraft !== "object") {
      return {
        values: null,
        restoredDraftAt: null,
        shouldClearInvalidDraft: true,
      };
    }

    const candidate = parsedDraft as Partial<DraftEnvelope<TValues>>;

    if (candidate.values === undefined) {
      return {
        values: null,
        restoredDraftAt: null,
        shouldClearInvalidDraft: true,
      };
    }

    if (typeof candidate.updatedAt !== "string") {
      return {
        values: null,
        restoredDraftAt: null,
        shouldClearInvalidDraft: true,
      };
    }

    return {
      values: candidate.values as TValues,
      restoredDraftAt: new Date(candidate.updatedAt),
      shouldClearInvalidDraft: false,
    };
  } catch {
    return {
      values: null,
      restoredDraftAt: null,
      shouldClearInvalidDraft: true,
    };
  }
};

type UseFormWithDraftParams<TValues extends FieldValues> = {
  storageKey: string;
  saveDelayMs?: number;
  defaultValues: TValues;
  formOptions?: Omit<UseFormProps<TValues>, "defaultValues">;
};

type UseFormWithDraftResult<TValues extends FieldValues> = {
  methods: UseFormReturn<TValues>;
  restoredDraftAt: Date | null;
  savedDraftAt: Date | null;
  clearDraft: () => void;
};

export const useFormWithDraft = <TValues extends FieldValues>({
  storageKey,
  saveDelayMs = 400,
  defaultValues,
  formOptions,
}: UseFormWithDraftParams<TValues>): UseFormWithDraftResult<TValues> => {
  const [restoredDraft] = useState<ReadFormDraftResult<TValues>>(() =>
    readFormDraft<TValues>({
      storageKey,
    }),
  );
  const saveDraftTimeoutRef = useRef<number | null>(null);
  const [savedDraftAt, setSavedDraftAt] = useState<Date | null>(
    restoredDraft.restoredDraftAt,
  );

  const methods = useForm<TValues>({
    ...formOptions,
    defaultValues: (restoredDraft.values ??
      defaultValues) as DefaultValues<TValues>,
  });
  const { getValues, watch } = methods;

  useEffect(() => {
    if (!restoredDraft.shouldClearInvalidDraft) {
      return;
    }

    window.localStorage.removeItem(storageKey);
  }, [restoredDraft.shouldClearInvalidDraft, storageKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch(() => {
      if (saveDraftTimeoutRef.current) {
        window.clearTimeout(saveDraftTimeoutRef.current);
      }

      saveDraftTimeoutRef.current = window.setTimeout(() => {
        const currentFormValues = getValues();
        const updatedAt = new Date();
        const draft: DraftEnvelope<TValues> = {
          values: currentFormValues,
          updatedAt: updatedAt.toISOString(),
        };

        try {
          window.localStorage.setItem(storageKey, JSON.stringify(draft));
          setSavedDraftAt(updatedAt);
        } catch {
          // ignore localStorage write errors in MVP
        }
      }, saveDelayMs);
    });

    return () => {
      if (saveDraftTimeoutRef.current) {
        window.clearTimeout(saveDraftTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [getValues, saveDelayMs, storageKey, watch]);

  const clearDraft = () => {
    window.localStorage.removeItem(storageKey);
    setSavedDraftAt(null);
  };

  return {
    clearDraft,
    methods,
    restoredDraftAt: restoredDraft.restoredDraftAt,
    savedDraftAt,
  };
};
