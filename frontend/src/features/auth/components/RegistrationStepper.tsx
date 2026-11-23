// src/features/auth/components/RegistrationStepper.tsx
import type { ReactElement } from "react";
import { Check, KeyRound, Building2, UserCog } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface StepItem {
  id: 1 | 2 | 3;
  title: string;
  subtitle: string;
  icon: typeof KeyRound;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: "Tài khoản",
    subtitle: "Thông tin đăng nhập",
    icon: KeyRound,
  },
  {
    id: 2,
    title: "Doanh nghiệp",
    subtitle: "Pháp nhân & Liên hệ",
    icon: Building2,
  },
  {
    id: 3,
    title: "Người đại diện",
    subtitle: "Chức vụ & Xác nhận",
    icon: UserCog,
  },
];

interface RegistrationStepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
  maxAccessibleStep: 1 | 2 | 3;
}

export const RegistrationStepper = ({
  currentStep,
  onStepClick,
  maxAccessibleStep,
}: RegistrationStepperProps): ReactElement => {
  return (
    <nav
      aria-label="Tiến trình đăng ký tài khoản Doanh nghiệp"
      className="w-full"
    >
      <ol className="relative flex items-center justify-between">
        {/* Đường nối thanh tiến trình */}
        <div
          className="absolute left-6 right-6 top-5 -z-0 h-0.5 bg-line"
          aria-hidden="true"
        >
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{
              width:
                currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          />
        </div>

        {STEPS.map((step) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = step.id <= maxAccessibleStep;
          const StepIcon = step.icon;

          return (
            <li
              key={step.id}
              className="relative z-10 flex flex-1 flex-col items-center"
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-input p-1 transition-all",
                  isClickable
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-75",
                )}
              >
                {/* Vòng tròn biểu tượng bước */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-pill border-2 transition-all duration-200",
                    isCurrent &&
                      "border-brand-600 bg-brand-600 text-white shadow-sm ring-4 ring-brand-100",
                    isCompleted &&
                      "border-sage bg-sage-100 text-sage-ink",
                    !isCurrent &&
                      !isCompleted &&
                      "border-line-strong bg-surface text-ink-3 group-hover:border-brand-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <StepIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>

                {/* Tiêu đề bước */}
                <div className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors",
                      isCurrent && "text-brand-600",
                      isCompleted && "text-ink",
                      !isCurrent && !isCompleted && "text-ink-3",
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="hidden md:inline text-[11px] text-ink-3">
                    {step.subtitle}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
