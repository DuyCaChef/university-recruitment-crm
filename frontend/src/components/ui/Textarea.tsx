// src/components/ui/Textarea.tsx
import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type ChangeEventHandler,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  FIELD_BASE_CLASS,
  FIELD_BORDER_DEFAULT,
  FIELD_BORDER_ERROR,
  FIELD_CONTAINER_CLASS,
  FIELD_ERROR_MESSAGE_CLASS,
  FIELD_HELPER_TEXT_CLASS,
  FIELD_LABEL_CLASS,
} from "./fieldStyles";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      containerClassName,
      className,
      value,
      defaultValue,
      onChange,
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const describedBy =
      [error ? errorId : null, !error && helperText ? helperId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const [isEmpty, setIsEmpty] = useState<boolean>(
      () => String(value ?? defaultValue ?? "").trim().length === 0,
    );

    useEffect(() => {
      if (value !== undefined) {
        setIsEmpty(String(value).trim().length === 0);
      }
    }, [value]);

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      setIsEmpty(event.target.value.trim().length === 0);
      onChange?.(event);
    };

    const shouldShowErrorBorder = Boolean(error) && !isEmpty;

    return (
      <div className={cn(FIELD_CONTAINER_CLASS, containerClassName)}>
        <label
          htmlFor={textareaId}
          className={FIELD_LABEL_CLASS}
          title={label}
        >
          {label}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            FIELD_BASE_CLASS,
            "py-2.5 resize-y",
            shouldShowErrorBorder ? FIELD_BORDER_ERROR : FIELD_BORDER_DEFAULT,
            className,
          )}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleChange}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className={FIELD_ERROR_MESSAGE_CLASS}>
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className={FIELD_HELPER_TEXT_CLASS}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
