// src/components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, rightElement, className, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-small font-medium text-ink">
          {label}
        </label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={cn(
              "h-11 w-full rounded-input border bg-surface px-3.5 text-body text-ink placeholder:text-ink-3 transition-all duration-150",
              "hover:border-brand-400",
              "focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100",
              "disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-3",
              error
                ? "border-2 border-danger focus:border-danger focus:ring-4 focus:ring-danger/10"
                : "border-2 border-line-strong",
              rightElement ? "pr-11" : "",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-1.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-1.5 text-small text-danger"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
