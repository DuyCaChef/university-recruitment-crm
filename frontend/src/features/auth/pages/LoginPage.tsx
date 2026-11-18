import { Link } from "react-router-dom";
import { GraduationCap, Building2, Shield } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * LoginPage — Trang đăng nhập / chọn vai trò.
 * STUDENT: Google SSO (@student.agu.edu.vn) — JIT Provisioning tại backend.
 * EMPLOYER/CAREER_CENTER/SYSTEM_ADMIN: đăng nhập mật khẩu nội bộ.
 */
export default function LoginPage() {
  const googleLoginUrl =
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1") +
    "/auth/google";

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="text-center">
        <h1 className="text-h2 font-bold text-ink">Đăng nhập</h1>
        <p className="mt-1 text-sm text-ink-2">
          Chọn phương thức đăng nhập phù hợp với vai trò của bạn
        </p>
      </div>

      {/* Phân vùng Sinh viên */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-3">
          Sinh viên AGU
        </p>
        <a
          href={googleLoginUrl}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-button",
            "bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm",
            "hover:bg-brand-700 transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-focus",
          )}
        >
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
          Đăng nhập bằng Google AGU
          <span className="text-xs opacity-80 font-normal">(@student.agu.edu.vn)</span>
        </a>
        <p className="mt-2 text-center text-xs text-ink-3">
          Tài khoản được tạo tự động lần đầu đăng nhập (JIT Provisioning)
        </p>
      </section>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-line" />
        <span className="text-xs text-ink-3">hoặc</span>
        <div className="flex-1 border-t border-line" />
      </div>

      {/* Phân vùng Doanh nghiệp & Cán bộ (demo) */}
      <section className="space-y-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-3">
          Doanh nghiệp & Cán bộ trường
        </p>
        <Link
          to="/employer/jobs"
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-button",
            "border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink",
            "hover:border-brand-400 hover:bg-brand-50 transition-colors duration-150",
          )}
        >
          <Building2 className="h-4 w-4 text-ink-2" aria-hidden="true" />
          Vào cổng Doanh nghiệp (Demo)
        </Link>
        <Link
          to="/career-center/approvals/companies"
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-button",
            "border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink",
            "hover:border-brand-400 hover:bg-brand-50 transition-colors duration-150",
          )}
        >
          <Shield className="h-4 w-4 text-ink-2" aria-hidden="true" />
          Vào cổng Cán bộ Hướng nghiệp (Demo)
        </Link>
      </section>

      {/* Đăng ký doanh nghiệp */}
      <p className="text-center text-xs text-ink-3">
        Doanh nghiệp chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-brand-text hover:underline">
          Đăng ký hợp tác
        </Link>
      </p>
    </div>
  );
}
