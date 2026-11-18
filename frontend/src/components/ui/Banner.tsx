import { type HTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { bannerVariants } from "./variants";

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  action?: React.ReactNode;
}

export function Banner({ className, variant = "info", action, children, ...props }: BannerProps) {
  const Icon = ICONS[variant || "info"];

  return (
    <div
      role="status"
      className={cn(bannerVariants({ variant, className }))}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <div>{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
