import type { ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const brandMarkSizeVariants = cva("shrink-0 select-none", {
  variants: {
    size: {
      sm: "h-7 w-7",
      md: "h-9 w-9",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const brandTextSizeVariants = cva("flex flex-col justify-center leading-none", {
  variants: {
    size: {
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-1.5",
      xl: "gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type BrandLogoTone = "default" | "inverse" | "mono";
export type BrandLogoVariant = "mark" | "horizontal" | "watermark";

export interface BrandLogoProps extends VariantProps<typeof brandMarkSizeVariants> {
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  animated?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

interface TonePalette {
  pillar: string;
  bridge: string;
  dot: string;
  titleText: string;
  accentText: string;
  subtitleText: string;
}

const TONE_PALETTES: Record<BrandLogoTone, TonePalette> = {
  default: {
    pillar: "fill-brand-600",
    bridge: "fill-sand",
    dot: "fill-clay-600",
    titleText: "text-ink",
    accentText: "text-brand-600",
    subtitleText: "text-ink-2",
  },
  inverse: {
    pillar: "fill-surface",
    bridge: "fill-sand",
    dot: "fill-clay-600",
    titleText: "text-surface",
    accentText: "text-sand",
    subtitleText: "text-brand-100",
  },
  mono: {
    pillar: "fill-current",
    bridge: "fill-current",
    dot: "fill-current",
    titleText: "text-current",
    accentText: "text-current",
    subtitleText: "text-current opacity-80",
  },
};

const TITLE_SIZE_MAP = {
  sm: "text-xs tracking-wide",
  md: "text-sm tracking-wide",
  lg: "text-lg tracking-normal",
  xl: "text-2xl tracking-tight",
} as const;

const SUBTITLE_SIZE_MAP = {
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-xs",
  xl: "text-sm",
} as const;

export const BrandLogo = ({
  variant = "horizontal",
  tone = "default",
  size = "md",
  animated = false,
  title = "AGU CAREER",
  subtitle = "University Recruitment CRM",
  className,
}: BrandLogoProps): ReactElement => {
  const palette = TONE_PALETTES[tone];
  const resolvedSize = size ?? "md";

  const renderSvgMark = (svgClassName: string): ReactElement => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={cn(svgClassName, animated && "animate-agu-logo-float")}
      aria-hidden="true"
    >
      <path
        d="M 12 42 L 24.5 42 C 28 42 29.5 51 33 51 L 47 51 L 47 64.5 Q 37 67 27 71 Z"
        className={cn(
          palette.pillar,
          tone === "mono" && "opacity-75",
          animated && "animate-agu-pillar-1",
        )}
      />
      <path
        d="M 52 37 L 67 37 L 67 62 Q 59.5 62.2 52 62.8 Z"
        className={cn(
          palette.pillar,
          tone === "mono" && "opacity-90",
          animated && "animate-agu-pillar-2",
        )}
      />
      <path
        d="M 71 24 L 87 24 L 87 37.3 L 73.2 62.4 L 71 62.2 Z"
        className={cn(palette.pillar, animated && "animate-agu-pillar-3")}
      />
      <circle
        cx="79"
        cy="13.5"
        r="5.5"
        className={cn(
          palette.dot,
          "transition-transform duration-200 ease-out group-hover/brand:-translate-y-0.5",
          animated && "animate-agu-dot-bounce",
        )}
      />
      <path
        d="M 10 85 Q 58 55 104 72 L 98 78 Q 58 65.5 23 85 Z"
        className={cn(
          palette.bridge,
          tone === "mono" && "opacity-65",
          animated && "animate-agu-bridge-wave",
        )}
      />
      <path
        d="M 32 81.5 L 45 104 C 50 112.5 61 112.5 66 104 L 77.5 78 L 65.5 76 L 57.5 92.5 C 56 95.5 54 95.5 52.5 92.5 L 43.5 79 Z"
        className={cn(palette.bridge, tone === "mono" && "opacity-80")}
      />
      <path
        d="M 77 62 L 96.5 22 Q 98.5 18 103.5 18 L 116 18 L 89 64 Z"
        className={cn(
          palette.bridge,
          tone === "mono" && "opacity-80",
          animated && "animate-agu-wing-lift",
        )}
      />
    </svg>
  );

  if (variant === "watermark") {
    return (
      <div
        className={cn("pointer-events-none select-none opacity-[0.07]", className)}
        aria-hidden="true"
      >
        {renderSvgMark("h-full w-full")}
      </div>
    );
  }

  if (variant === "mark") {
    return (
      <span
        className={cn("group/brand inline-flex items-center justify-center", className)}
        role="img"
        aria-label={`${title} — ${subtitle}`}
      >
        {renderSvgMark(brandMarkSizeVariants({ size: resolvedSize }))}
      </span>
    );
  }

  return (
    <span
      className={cn("group/brand inline-flex items-center gap-3", className)}
    >
      {renderSvgMark(brandMarkSizeVariants({ size: resolvedSize }))}
      <span className={brandTextSizeVariants({ size: resolvedSize })}>
        <span
          className={cn(
            "font-bold uppercase",
            TITLE_SIZE_MAP[resolvedSize],
            palette.titleText,
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={cn(
              "font-medium",
              SUBTITLE_SIZE_MAP[resolvedSize],
              palette.subtitleText,
            )}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
};
