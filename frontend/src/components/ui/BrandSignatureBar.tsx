// src/components/ui/BrandSignatureBar.tsx
import type { ReactElement } from "react";
import { cn } from "@/shared/lib/cn";

export interface BrandSignatureBarProps {
  className?: string;
}

export const BrandSignatureBar = ({
  className,
}: BrandSignatureBarProps): ReactElement => {
  return (
    <div
      className={cn(
        "h-1 w-full bg-gradient-to-r from-brand-600 via-sand to-clay-600",
        className,
      )}
      aria-hidden="true"
    />
  );
};
