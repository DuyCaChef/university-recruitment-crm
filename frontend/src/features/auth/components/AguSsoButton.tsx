// src/features/auth/components/AguSsoButton.tsx
import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { UI_LABELS } from "@/shared/constants/errors";
import { getAguGoogleSsoUrl } from "../api/authApi";

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
          className="inline-flex h-7 w-7 items-center justify-center"
          aria-hidden="true"
        >
          <img
            src="/icons/google-color.svg"
            alt=""
            className="h-7 w-7"
            aria-hidden="true"
          />
        </span>
        <span className="text-white text-base">
          {UI_LABELS.SSO_BUTTON_TEXT}
        </span>
      </Button>

      <p className="text-center text-sm text-caption text-ink-2">
        {UI_LABELS.SSO_HELPER_TEXT}
      </p>
    </section>
  );
};
