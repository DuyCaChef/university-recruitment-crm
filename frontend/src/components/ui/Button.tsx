// src/components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-button transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-brand-600 text-surface hover:bg-brand-700 shadow-sm",
        secondary: "bg-clay-600 text-surface hover:opacity-95 shadow-sm",
        outline:
          "bg-transparent border border-line-strong text-ink hover:border-brand-400 hover:bg-brand-50",
        ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
        danger: "bg-danger text-surface hover:opacity-95",
      },
      size: {
        sm: "h-9 px-3 text-small",
        md: "h-11 px-4 text-body",
        lg: "h-[52px] px-6 text-body font-semibold",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends
  ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="sr-only">Đang xử lý...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
