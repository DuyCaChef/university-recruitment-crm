import type { ReactElement } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { FormDialog } from "@/components/ui/FormDialog";
import type { ConfirmDeleteTarget } from "../types";

export interface DeleteConfirmDialogProps {
  target: ConfirmDeleteTarget | null;
  isPending: boolean;
  isSuspended: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  target,
  isPending,
  isSuspended,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps): ReactElement {
  return (
    <FormDialog
      open={Boolean(target)}
      title="Xác nhận xóa thông tin"
      onClose={() => !isPending && onClose()}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isPending}
            disabled={isPending || isSuspended}
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4" />
            Xác nhận xóa
          </Button>
        </div>
      }
    >
      {target && (
        <div className="flex items-start gap-3 rounded-card border border-danger-border bg-danger-bg/60 p-3.5 text-xs text-danger-ink">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">
              Bạn có chắc chắn muốn xóa &ldquo;{target.label}&rdquo;?
            </p>
            {target.type === "cv" ? (
              <p className="text-ink-2">
                {target.isDefaultCv
                  ? "Đây là CV mặc định hiện tại. Sau khi xóa, hệ thống sẽ tự động đặt bản CV gần nhất còn lại làm mặc định. Các đơn đã ứng tuyển trước đó vẫn giữ nguyên bản sao lưu."
                  : "Tệp CV sẽ bị xóa khỏi kho cá nhân. Các đơn đã ứng tuyển trước đó vẫn giữ nguyên bản sao lưu."}
              </p>
            ) : (
              <p className="text-ink-2">
                Hành động này không thể hoàn tác sau khi xác nhận.
              </p>
            )}
          </div>
        </div>
      )}
    </FormDialog>
  );
}
