import { useEffect, type ReactElement, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface FormDialogProps {
  open: boolean;
  title: string;
  description?: string;
  size?: "md" | "lg";
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function FormDialog({
  open,
  title,
  description,
  size = "md",
  onClose,
  footer,
  children,
}: FormDialogProps): ReactElement | null {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-lg",
          size === "lg" ? "max-w-2xl" : "max-w-lg",
        )}
      >
        {/* Header cố định */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 py-4 md:px-6">
          <div>
            <h3 id="profile-dialog-title" className="text-h3 text-ink">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs leading-5 text-ink-2">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="rounded-button p-1.5 text-ink-3 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung biểu mẫu cuộn mượt */}
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex-1 overflow-y-auto px-5 py-4 md:px-6 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {/* Footer cố định */}
        {footer && (
          <div className="shrink-0 border-t border-line bg-canvas/70 px-5 py-3.5 md:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
