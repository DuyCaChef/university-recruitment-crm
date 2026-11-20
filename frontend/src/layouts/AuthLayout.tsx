// src/layouts/AuthLayout.tsx
import type { ReactElement } from "react";
import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { UI_LABELS } from "@/shared/constants/errors";

export const AuthLayout = (): ReactElement => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink flex flex-col justify-between">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sand-100 opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-mist-100 opacity-80 blur-3xl"
        aria-hidden="true"
      />

      {/* Main container căn giữa */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md rounded-panel bg-surface border-2 border-line shadow-lg p-6 md:p-8 flex flex-col gap-6">
          {/* Header cụm Logo & Tên trường theo mẫu thiết kế */}
          <div className="flex flex-col items-center text-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-input p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-label="Trang chủ Cổng Việc làm Trường Đại học An Giang"
            >
              <div className="h-12 w-12 rounded-input bg-brand-600 text-surface flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="block text-caption font-semibold tracking-wider text-brand-600 uppercase">
                  {UI_LABELS.APP_UNIVERSITY_PARENT}
                </span>
                <span className="block text-h3 font-bold text-brand-600 leading-tight">
                  {UI_LABELS.APP_UNIVERSITY_NAME}
                </span>
              </div>
            </Link>
            <p className="text-small text-ink-2">
              {UI_LABELS.APP_PORTAL_SUBTITLE}
            </p>
          </div>

          {/* Nội dung trang con (LoginPage / RegisterPage) */}
          <Outlet />
        </div>
      </main>

      {/* Footer tối giản */}
      <footer className="py-4 px-4 text-center text-caption text-ink-2 border-t border-line bg-surface">
        © 2026 Trường Đại học An Giang — ĐHQG-HCM. Hỗ trợ kỹ thuật:
        career@agu.edu.vn
      </footer>
    </div>
  );
};
