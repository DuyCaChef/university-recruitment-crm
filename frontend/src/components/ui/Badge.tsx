import { type HTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";
import { badgeVariants } from "./variants";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {icon}
      <span>{children}</span>
    </span>
  );
}
