import { useEffect } from "react";
import { useSearchParams } from "react-router";

import {
  getRememberedTemplateId,
  setRememberedTemplateId,
  type TemplateMemoryKey,
} from "utils/templateMemory";

export const useRememberedTemplateId = (
  storageKey: TemplateMemoryKey,
): string | null => {
  const [searchParams] = useSearchParams();
  const queryTemplateId = searchParams.get("templateId");
  const rememberedTemplateId = getRememberedTemplateId(storageKey);
  const templateId = queryTemplateId ?? rememberedTemplateId;

  useEffect(() => {
    if (!queryTemplateId) {
      return;
    }

    setRememberedTemplateId(storageKey, queryTemplateId);
  }, [queryTemplateId, storageKey]);

  return templateId;
};
