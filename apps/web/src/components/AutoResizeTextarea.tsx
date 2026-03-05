import { type ComponentPropsWithRef, useLayoutEffect, useRef } from "react";

type AutoResizeTextareaProps = Omit<
  ComponentPropsWithRef<"textarea">,
  "rows"
> & {
  minRows?: number;
  maxRows?: number;
};

const getLineHeight = (textarea: HTMLTextAreaElement) => {
  const styles = window.getComputedStyle(textarea);
  const parsedLineHeight = Number.parseFloat(styles.lineHeight);

  if (Number.isFinite(parsedLineHeight)) {
    return parsedLineHeight;
  }

  const parsedFontSize = Number.parseFloat(styles.fontSize);

  if (Number.isFinite(parsedFontSize)) {
    return parsedFontSize * 1.2;
  }

  return 20;
};

const resizeTextarea = (
  textarea: HTMLTextAreaElement,
  minRows: number,
  maxRows: number,
) => {
  textarea.style.height = "auto";

  const styles = window.getComputedStyle(textarea);
  const lineHeight = getLineHeight(textarea);
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const verticalPadding = paddingTop + paddingBottom;

  const minHeight = minRows * lineHeight + verticalPadding;
  const maxHeight = maxRows * lineHeight + verticalPadding;
  const nextHeight = Math.min(
    Math.max(textarea.scrollHeight, minHeight),
    maxHeight,
  );

  textarea.style.height = `${nextHeight}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

export const AutoResizeTextarea = (props: AutoResizeTextareaProps) => {
  const { minRows = 1, maxRows = 5, onInput, value, ref, ...restProps } = props;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSetRefs = (textarea: HTMLTextAreaElement | null) => {
    textareaRef.current = textarea;

    if (!ref) {
      return;
    }

    if (typeof ref === "function") {
      ref(textarea);
      return;
    }

    ref.current = textarea;
  };

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    resizeTextarea(textarea, minRows, maxRows);
  }, [maxRows, minRows, value]);

  return (
    <textarea
      {...restProps}
      ref={handleSetRefs}
      rows={minRows}
      value={value}
      onInput={(event) => {
        resizeTextarea(event.currentTarget, minRows, maxRows);
        onInput?.(event);
      }}
    />
  );
};
