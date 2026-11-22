// src/components/ui/ThemeToggle.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Sun, Moon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "@/shared/hooks/useTheme";

const themeToggleVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus select-none",
  {
    variants: {
      variant: {
        outline:
          "rounded-button border border-line bg-surface text-ink-2 hover:bg-subtle hover:text-ink shadow-sm",
        ghost:
          "rounded-button text-ink-2 hover:bg-subtle hover:text-ink",
        subtle:
          "rounded-button bg-subtle text-ink-2 hover:bg-line-strong/20 hover:text-ink",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-9 w-9",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

export interface ThemeToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof themeToggleVariants> {
  showLabel?: boolean;
}

/**
 * Component nút chuyển đổi chế độ Sáng / Tối (Dark/Light mode) dùng chung cho toàn hệ thống.
 * Đồng bộ tự động qua useTheme (useSyncExternalStore + MutationObserver).
 */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      className,
      variant,
      size = "md",
      showLabel = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { isDark, toggleTheme } = useTheme();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      toggleTheme();
      onClick?.(event);
    };

    const label = isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";

    const iconSizeClass =
      size === "sm"
        ? "h-3.5 w-3.5"
        : size === "lg"
          ? "h-5 w-5"
          : "h-4 w-4";

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        aria-pressed={isDark}
        className={cn(
          themeToggleVariants({ variant, size }),
          showLabel && "w-auto px-3 gap-2",
          className,
        )}
        {...props}
      >
        {isDark ? (
          <Sun className={cn(iconSizeClass, "shrink-0")} aria-hidden="true" />
        ) : (
          <Moon className={cn(iconSizeClass, "shrink-0")} aria-hidden="true" />
        )}
        {showLabel && (
          <span className="text-small font-medium text-ink">
            {isDark ? "Giao diện sáng" : "Giao diện tối"}
          </span>
        )}
      </button>
    );
  },
);

ThemeToggle.displayName = "ThemeToggle";
