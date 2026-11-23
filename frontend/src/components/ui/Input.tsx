// src/components/ui/Input.tsx
import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
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

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      containerClassName,
      rightElement,
      className,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
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

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setIsEmpty(event.target.value.trim().length === 0);
      onChange?.(event);
    };

    const shouldShowErrorBorder = Boolean(error) && !isEmpty;

    return (
      <div className={cn(FIELD_CONTAINER_CLASS, containerClassName)}>
        <label
          htmlFor={inputId}
          className={FIELD_LABEL_CLASS}
          title={label}
        >
          {label}
        </label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              FIELD_BASE_CLASS,
              "h-11",
              shouldShowErrorBorder ? FIELD_BORDER_ERROR : FIELD_BORDER_DEFAULT,
              rightElement ? "pr-11" : "",
              className,
            )}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            onChange={handleChange}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-1.5 flex items-center pointer-events-auto">
              {rightElement}
            </div>
          )}
        </div>

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

Input.displayName = "Input";
