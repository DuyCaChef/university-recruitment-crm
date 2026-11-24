import type { ReactElement } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import { extractApiErrorMessage } from "@/shared/lib/apiError";

export interface VisibilityToggleCardProps {
  visibility: boolean;
  isSuspended: boolean;
  isPending: boolean;
  onToggle: (
    nextVisibility: boolean,
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function VisibilityToggleCard({
  visibility,
  isSuspended,
  isPending,
  onToggle,
  onNotice,
  onError,
}: VisibilityToggleCardProps): ReactElement {
  const handleToggle = (): void => {
    const nextVisibility = !visibility;
    onToggle(nextVisibility, {
      onSuccess: () => {
        onNotice(
          nextVisibility
            ? "Đã bật hiển thị công khai hồ sơ năng lực cho Nhà tuyển dụng."
            : "Đã chuyển hồ sơ năng lực sang chế độ riêng tư.",
        );
      },
      onError: (err) => {
        onError(
          extractApiErrorMessage(
            err,
            "Không thể cập nhật trạng thái hiển thị hồ sơ.",
          ),
        );
      },
    });
  };

  return (
    <div className="flex flex-col justify-between rounded-panel border border-line bg-surface p-5 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50">
            {visibility ? (
              <Eye className="h-5 w-5 text-brand-600" />
            ) : (
              <EyeOff className="h-5 w-5 text-ink-2" />
            )}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(visibility)}
            onClick={handleToggle}
            disabled={isSuspended || isPending}
            className={cn(
              "relative h-7 w-12 rounded-pill border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50",
              visibility
                ? "border-brand-600 bg-brand-600"
                : "border-danger-border bg-danger-border",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-5 w-5 rounded-pill bg-surface shadow-sm transition-transform",
                visibility ? "left-6" : "left-1",
              )}
            />
            <span className="sr-only">Hiển thị hồ sơ công khai</span>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-small font-bold text-ink">Hồ sơ công khai</h3>
          <Badge variant={visibility ? "success" : "danger"}>
            {visibility ? "Đang bật" : "Riêng tư"}
          </Badge>
        </div>

        <p className="mt-1.5 text-xs leading-5 text-ink-2">
          {visibility
            ? "Doanh nghiệp đã xác thực có thể tìm thấy thông tin nghề nghiệp (Ngành, Kỹ năng, Kinh nghiệm, Dự án) của bạn."
            : "Hồ sơ nghề nghiệp đang ẩn khỏi kết quả tìm kiếm của Nhà tuyển dụng."}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-caption text-ink-3">
        <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>SĐT, địa chỉ, GPA và CV cá nhân luôn được ẩn</span>
      </div>
    </div>
  );
}
