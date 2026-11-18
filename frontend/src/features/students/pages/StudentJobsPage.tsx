import { Briefcase, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * StudentJobsPage — Danh sách việc làm dành cho sinh viên.
 * Container page: sẽ dùng TanStack Query hook khi tích hợp API.
 */
export default function StudentJobsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-ink">Việc làm tuyển dụng</h1>
          <p className="mt-1 text-sm text-ink-2">
            Khám phá các cơ hội việc làm từ doanh nghiệp đối tác AGU
          </p>
        </div>
        <button
          className={cn(
            "flex items-center gap-2 rounded-button px-4 py-2.5",
            "bg-brand-600 text-sm font-semibold text-white shadow-sm",
            "hover:bg-brand-700 transition-colors duration-150",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Lọc nâng cao
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Tìm theo tên công việc, doanh nghiệp..."
          className={cn(
            "h-11 w-full rounded-input border border-line-strong bg-surface pl-10 pr-4",
            "text-sm text-ink placeholder:text-ink-3",
            "hover:border-brand-400 focus:border-brand-600 focus:outline-none",
            "focus-visible:ring-4 focus-visible:ring-brand-100 transition-colors",
          )}
        />
      </div>

      {/* Job list placeholder */}
      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50">
            <Briefcase className="h-7 w-7 text-brand-600" aria-hidden="true" />
          </div>
          <h3 className="font-bold text-ink">Danh sách Việc làm AGU</h3>
          <p className="max-w-sm text-sm text-ink-2">
            Khung giao diện StudentJobsPage với AppLayout (role=STUDENT) đang hiển thị
            chuẩn xác. Dữ liệu thực sẽ được tải qua TanStack Query.
          </p>
        </div>
      </div>
    </div>
  );
}
