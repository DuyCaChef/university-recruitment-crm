// src/features/auth/components/CompanyRegisterSuccessState.tsx
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Mail,
  UserCheck,
  ArrowRight,
  Info,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { CompanyRegisterResponseData } from "../types";

interface CompanyRegisterSuccessStateProps {
  data: CompanyRegisterResponseData;
  onGoToLogin: () => void;
}

export const CompanyRegisterSuccessState = ({
  data,
  onGoToLogin,
}: CompanyRegisterSuccessStateProps): ReactElement => {
  const companyName = data.company?.name || "Doanh nghiệp đối tác";
  const accountEmail = data.user?.email || "";
  const companyEmail = data.company?.email || "";
  const taxCode = data.company?.taxCode;
  const representativeName = data.contact?.fullName || "";
  const position = data.contact?.position;

  return (
    <div
      role="region"
      aria-label="Kết quả đăng ký tài khoản doanh nghiệp"
      className="flex flex-col gap-6 animate-fadeIn"
    >
      {/* Icon & Tiêu đề trạng thái thành công */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-success-bg text-success-ink ring-8 ring-success-bg/40">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h1 className="text-h2 font-bold text-ink">
            Đăng ký thành công!
          </h1>
          <p className="text-small text-ink-2 max-w-md mx-auto">
            Hồ sơ pháp nhân và tài khoản tuyển dụng của{" "}
            <span className="font-semibold text-ink">{companyName}</span> đã
            được tạo và ghi nhận an toàn trên hệ thống Cổng Việc làm AGU.
          </p>
        </div>

        {/* Các huy hiệu trạng thái nghiệp vụ theo DESIGN_SYSTEM.md 3.7 */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Badge variant="warning" className="gap-1.5 py-1 px-3">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Trạng thái: Chờ thẩm định (PENDING)
          </Badge>
          <Badge variant="neutral" className="gap-1.5 py-1 px-3">
            Quan hệ CRM: Đối tác mới (NEW)
          </Badge>
          <Badge variant="brand" className="gap-1.5 py-1 px-3">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Vai trò: EMPLOYER
          </Badge>
        </div>
      </div>

      {/* Thông điệp chốt chặn Onboarding Gate (Module 04 & FR-CVR-01) */}
      <div
        role="alert"
        className="rounded-card border border-warning-border bg-warning-bg p-4 text-small text-warning-ink flex items-start gap-3"
      >
        <Clock className="h-5 w-5 shrink-0 text-sand-ink mt-0.5" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sand-ink">
            Quy định chốt chặn thẩm định (Onboarding Gate)
          </span>
          <p className="text-xs leading-relaxed text-ink-2">
            Tài khoản hiện tại ở trạng thái{" "}
            <strong className="text-sand-ink font-semibold">PENDING</strong>.
            Doanh nghiệp có thể đăng nhập để hoàn thiện hồ sơ, nhưng{" "}
            <strong>quyền đăng tin tuyển dụng và tìm kiếm ứng viên</strong> sẽ
            tạm thời bị khóa cho đến khi Trung tâm Hướng nghiệp & HTSV Trường
            Đại học An Giang kiểm tra thông tin pháp nhân và phê duyệt chính thức
            (APPROVED).
          </p>
        </div>
      </div>

      {/* Bảng tóm tắt thông tin đã khởi tạo thành công */}
      <div className="rounded-card border border-line bg-subtle/50 p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-2 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Thông tin tài khoản & Pháp nhân khởi tạo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-small">
          <div className="flex items-start gap-2 bg-surface p-2.5 rounded-input border border-line">
            <Building2 className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">Doanh nghiệp:</span>
              <span className="font-semibold text-ink truncate block">
                {companyName}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-surface p-2.5 rounded-input border border-line">
            <Mail className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">Email đăng nhập:</span>
              <span className="font-medium text-ink truncate block">
                {accountEmail}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-surface p-2.5 rounded-input border border-line">
            <Hash className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">Mã số thuế:</span>
              <span className="font-mono text-ink">
                {taxCode || "Chưa cung cấp (Bổ sung sau)"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-surface p-2.5 rounded-input border border-line">
            <UserCheck className="h-4 w-4 shrink-0 text-brand-600 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">Đại diện chính:</span>
              <span className="font-medium text-ink truncate block">
                {representativeName}{" "}
                {position ? `(${position})` : ""}
              </span>
            </div>
          </div>
        </div>

        {companyEmail && companyEmail !== accountEmail && (
          <p className="text-xs text-ink-3">
            Email liên hệ chính thức:{" "}
            <span className="font-medium text-ink-2">{companyEmail}</span>
          </p>
        )}
      </div>

      {/* Hành động điều hướng sau đăng ký */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onGoToLogin}
          className="gap-2 shadow-sm font-semibold"
        >
          <span>Đăng nhập vào hệ thống ngay</span>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex items-center justify-center">
          <Link
            to="/login"
            className="text-small font-medium text-brand-600 hover:text-brand-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xs px-2 py-1"
          >
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
