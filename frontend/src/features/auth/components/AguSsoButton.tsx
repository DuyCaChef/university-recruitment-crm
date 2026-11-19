// src/features/auth/components/AguSsoButton.tsx
import { useState, type ReactElement } from "react";
import { Mail } from "lucide-react";
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
        className="text-center text-caption font-semibold uppercase tracking-wider text-ink-2"
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
          className="inline-flex h-6 w-6 items-center justify-center rounded-xs bg-surface text-brand-600"
          aria-hidden="true"
        >
          <Mail className="h-4 w-4" />
        </span>
        <span>{UI_LABELS.SSO_BUTTON_TEXT}</span>
      </Button>

      <p className="text-center text-caption text-ink-2">
        {UI_LABELS.SSO_HELPER_TEXT}
      </p>
    </section>
  );
};
