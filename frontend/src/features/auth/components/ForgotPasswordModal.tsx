// src/features/auth/components/ForgotPasswordModal.tsx
import { useEffect, type ReactElement } from "react";
import { X, HelpCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
}: ForgotPasswordModalProps): ReactElement | null => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Esc" || event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-panel bg-surface border border-line shadow-lg p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-input bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3
              id="forgot-password-title"
              className="text-h3 font-bold text-ink"
            >
              Hỗ trợ khôi phục mật khẩu
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="h-9 w-9 rounded-input inline-flex items-center justify-center text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-small text-ink-2">
          <div className="rounded-card bg-subtle p-3.5 flex flex-col gap-1">
            <span className="font-semibold text-ink">
              1. Đối với Sinh viên AGU:
            </span>
            <p>
              Sinh viên sử dụng tài khoản Google Workspace của trường (
              <span className="font-mono text-ink">@student.agu.edu.vn</span>).
              Nếu quên mật khẩu email trường, vui lòng liên hệ Trung tâm Tin học
              AGU để đặt lại.
            </p>
          </div>

          <div className="rounded-card bg-mist-100 p-3.5 flex flex-col gap-1.5 text-mist-ink">
            <span className="font-semibold">
              2. Đối với Doanh nghiệp & Cán bộ Career Center:
            </span>
            <p>
              Vui lòng liên hệ bộ phận Quản trị hệ thống / Trung tâm Hướng
              nghiệp AGU để xác minh và nhận mật khẩu tạm thời mới:
            </p>
            <div className="flex flex-col gap-1 pt-1 font-medium">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>career@agu.edu.vn</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono">(0296) 625 6565</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Đã hiểu và đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
