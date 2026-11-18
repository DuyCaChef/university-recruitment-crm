import { Building2 } from "lucide-react";

/**
 * CareerCenterCrmPage — Quản lý quan hệ doanh nghiệp (CRM 360°).
 * SYSTEM_ADMIN không có quyền truy cập trang này (FR-CRM-05).
 */
export default function CareerCenterCrmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-ink">Quản lý Quan hệ Doanh nghiệp (CRM 360°)</h1>
        <p className="mt-1 text-sm text-ink-2">
          Theo dõi toàn diện quan hệ hợp tác với doanh nghiệp đối tác AGU
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50">
            <Building2 className="h-7 w-7 text-brand-600" aria-hidden="true" />
          </div>
          <h3 className="font-bold text-ink">Màn Company CRM 360°</h3>
          <p className="max-w-sm text-sm text-ink-2">
            Khung giao diện CareerCenterCrmPage với AppLayout (role=CAREER_CENTER).
            Dữ liệu CRM sẽ được tích hợp qua TanStack Query.
          </p>
          <p className="text-xs text-warning-ink bg-warning-bg rounded-xs px-3 py-1">
            Lưu ý: SYSTEM_ADMIN không có quyền truy cập khu vực CRM (FR-CRM-05)
          </p>
        </div>
      </div>
    </div>
  );
}
