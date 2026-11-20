// src/features/auth/components/AguSsoButton.tsx
import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { UI_LABELS } from "@/shared/constants/errors";
import { getAguGoogleSsoUrl } from "../api/authApi";

const GoogleLogo = (): ReactElement => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    role="img"
    aria-label="Google"
  >
    <path
      fill="#4285F4"
      d="M21.805 10.201h-.685V10.16H12v3.84h5.513a5.073 5.073 0 0 1-2.096 2.32l.017.112 3.348 2.58.232.023c2.147-1.974 3.385-4.885 3.385-8.834Z"
    />
    <path
      fill="#34A853"
      d="M12 21.94c2.72 0 5.01-.89 6.68-2.41l-3.246-2.52A7.1 7.1 0 0 1 12 18.1a7.02 7.02 0 0 1-6.6-4.62l-.096.008-3.17 2.45-.04.105A11.98 11.98 0 0 0 12 21.94Z"
    />
    <path
      fill="#FBBC05"
      d="M5.4 13.48a7.47 7.47 0 0 1-.4-2.36c0-.82.13-1.61.38-2.36V6.17l-3.19-2.47-.104.05A11.95 11.95 0 0 0 .12 11.12c0 1.94.47 3.77 1.28 5.39l3.1-2.87.1-.16Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.5c1.73 0 3.29.59 4.53 1.75l3.31-3.24A11.5 11.5 0 0 0 12 .1A11.96 11.96 0 0 0 2.1 6.17l3.29 2.59A7.09 7.09 0 0 1 12 5.5Z"
    />
  </svg>
);

interface AguSsoButtonProps {
  disabled?: boolean;
}

export const AguSsoButton = ({
  disabled = false,
}: AguSsoButtonProps): ReactElement => {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleSsoRedirect = (): void => {
    setIsRedirecting(true);
    window.location.assign(getAguGoogleSsoUrl());
  };

  return (
    <section
      aria-labelledby="sso-login-heading"
      className="flex flex-col gap-3"
    >
      <h2
        id="sso-login-heading"
        className="mx-auto rounded-pill bg-mist-100 px-3 py-1 text-center text-caption font-semibold uppercase tracking-wider text-mist-ink"
      >
        {UI_LABELS.SSO_SECTION_LABEL}
      </h2>

      {/* Nút Primary duy nhất trên toàn màn hình theo Mục 6.1 DESIGN_SYSTEM.md */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isRedirecting}
        disabled={disabled}
        onClick={handleSsoRedirect}
      >
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs bg-surface shadow-sm"
          aria-hidden="true"
        >
          <GoogleLogo />
        </span>
        <span>{UI_LABELS.SSO_BUTTON_TEXT}</span>
      </Button>

      <p className="text-center text-caption text-ink-2">
        {UI_LABELS.SSO_HELPER_TEXT}
      </p>
    </section>
  );
};
