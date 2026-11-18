import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Header */}
      <header className="border-b border-line bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-input bg-brand-600 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-base font-bold leading-tight text-ink">
                AGU CAREER
              </span>
              <span className="block text-xs text-ink-2">
                Cổng Việc làm &amp; Hướng nghiệp AGU
              </span>
            </div>
          </Link>
          <p className="hidden text-xs text-ink-3 md:block">
            Hỗ trợ:{" "}
            <span className="font-medium text-brand-text">career@agu.edu.vn</span>
          </p>
        </div>
      </header>

      {/* Main: form card */}
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md rounded-panel bg-surface p-6 shadow-md border border-line md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface px-6 py-4 text-center text-xs text-ink-3">
        © 2026 Trường Đại học An Giang – ĐHQG-HCM. Phát triển phục vụ Khóa luận Tốt nghiệp.
      </footer>
    </div>
  );
}
