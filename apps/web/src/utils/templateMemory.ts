export type TemplateMemoryKey =
  | "last-template-id:template"
  | "last-template-id:perform"
  | "last-template-id:stats";

const isBrowser = () => typeof window !== "undefined";

export const getRememberedTemplateId = (storageKey: TemplateMemoryKey) => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const value = window.sessionStorage.getItem(storageKey);

    if (!value) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
};

export const setRememberedTemplateId = (
  storageKey: TemplateMemoryKey,
  templateId: string,
) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey, templateId);
  } catch {
    return;
  }
};

export const createPathWithTemplateId = (
  basePath: string,
  templateId: string | null,
) => {
  if (!templateId) {
    return basePath;
  }

  return `${basePath}?templateId=${encodeURIComponent(templateId)}`;
};
