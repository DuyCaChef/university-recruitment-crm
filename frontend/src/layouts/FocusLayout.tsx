import { Outlet, Link } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";

/**
 * FocusLayout — Tối giản, chỉ có logo + 1 nút đăng xuất.
 * Dùng cho: đổi mật khẩu bắt buộc (EMPLOYER/CAREER_CENTER/SYSTEM_ADMIN),
 * chờ duyệt tài khoản. KHÔNG dùng cho STUDENT (SSO, không cần đổi mật khẩu).
 */
export function FocusLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-input bg-brand-600 text-white shadow-sm">
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <span className="block text-base font-bold leading-tight text-ink">AGU CAREER</span>
          <span className="block text-xs text-ink-3">Cổng Việc làm &amp; Hướng nghiệp AGU</span>
        </div>
      </div>

      {/* Content card */}
      <div className="w-full max-w-sm rounded-panel bg-surface p-6 shadow-md border border-line">
        <Outlet />
      </div>

      {/* Logout */}
      <Link
        to="/login"
        className="mt-6 flex items-center gap-2 text-sm text-ink-2 hover:text-danger-ink transition-colors"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Đăng xuất
      </Link>
    </div>
  );
}
