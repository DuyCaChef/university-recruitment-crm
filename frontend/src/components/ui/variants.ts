import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800",
        secondary: "bg-clay-600 text-white shadow-sm hover:opacity-90 active:opacity-100",
        outline: "border border-line-strong bg-transparent text-ink hover:bg-brand-50 hover:border-brand-400 active:bg-brand-100",
        ghost: "bg-transparent text-brand-text hover:bg-brand-50 active:bg-brand-100",
        danger: "bg-danger-ink text-white shadow-sm hover:opacity-90 active:opacity-100",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-button",
        md: "h-11 px-4 text-sm rounded-button",
        lg: "h-13 px-6 text-base rounded-button",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase tabular-nums transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success-bg text-success-ink border border-success-border",
        warning: "bg-warning-bg text-warning-ink border border-warning-border",
        danger:  "bg-danger-bg text-danger-ink border border-danger-border",
        info:    "bg-info-bg text-info-ink border border-info-border",
        neutral: "bg-neutral-bg text-neutral-ink border border-neutral-border",
        brand:   "bg-brand-100 text-brand-700 border border-brand-200",
        clay:    "bg-clay-100 text-clay-ink border border-clay-600/20",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export const alertVariants = cva(
  "relative w-full rounded-card border p-4 text-sm transition-colors flex items-start gap-3",
  {
    variants: {
      variant: {
        info:    "bg-info-bg text-info-ink border-info-border",
        success: "bg-success-bg text-success-ink border-success-border",
        warning: "bg-warning-bg text-warning-ink border-warning-border",
        danger:  "bg-danger-bg text-danger-ink border-danger-border",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export const bannerVariants = cva(
  "w-full px-4 py-3 text-xs font-medium flex items-center justify-between gap-3 border-b transition-colors",
  {
    variants: {
      variant: {
        info:    "bg-info-bg text-info-ink border-info-border",
        warning: "bg-warning-bg text-warning-ink border-warning-border",
        danger:  "bg-danger-bg text-danger-ink border-danger-border",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);
