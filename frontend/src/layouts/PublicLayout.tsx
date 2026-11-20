import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Floating header */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-sm px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-ink">AGU CAREER</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-button px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="rounded-button bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Đăng ký doanh nghiệp
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-surface px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-input bg-brand-600 text-white">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-sm font-bold text-ink">AGU CAREER</span>
                <span className="text-xs text-ink-3">Cổng Việc làm &amp; Hướng nghiệp</span>
              </div>
            </div>
            <p className="text-xs text-ink-3">
              © 2026 Trường Đại học An Giang – ĐHQG-HCM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
