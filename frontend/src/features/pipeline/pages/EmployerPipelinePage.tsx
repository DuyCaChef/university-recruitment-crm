import { Kanban } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * EmployerPipelinePage — Bảng Kanban quản lý phễu ứng viên.
 */
export default function EmployerPipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-ink">Phễu ứng viên (Kanban Pipeline)</h1>
        <p className="mt-1 text-sm text-ink-2">
          Quản lý quy trình tuyển dụng theo từng bước xét duyệt
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50">
            <Kanban className="h-7 w-7 text-brand-600" aria-hidden="true" />
          </div>
          <h3 className="font-bold text-ink">Bảng Kanban Pipeline</h3>
          <p className="max-w-sm text-sm text-ink-2">
            Khung giao diện EmployerPipelinePage với AppLayout (role=EMPLOYER).
            Kanban 6 cột sẽ được tích hợp khi kết nối API.
          </p>
        </div>

        {/* Pipeline stages preview */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 desktop:grid-cols-6">
          {["Đã nộp", "Xem xét", "Sàng lọc", "Phỏng vấn", "Nhận đề nghị", "Trúng tuyển"].map(
            (stage, i) => (
              <div
                key={stage}
                className={cn(
                  "rounded-card border border-line bg-subtle p-3 text-center",
                  i === 0 && "border-l-4 border-l-mist-ink",
                  i === 1 && "border-l-4 border-l-sand",
                  i === 2 && "border-l-4 border-l-brand-400",
                  i === 3 && "border-l-4 border-l-brand-600",
                  i === 4 && "border-l-4 border-l-clay-600",
                  i === 5 && "border-l-4 border-l-sage",
                )}
              >
                <p className="text-xs font-semibold text-ink">{stage}</p>
                <p className="mt-1 text-lg font-bold text-ink-2 tabular-nums">0</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
