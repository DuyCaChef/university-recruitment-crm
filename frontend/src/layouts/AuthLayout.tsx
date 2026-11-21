// src/layouts/AuthLayout.tsx
import type { ReactElement } from "react";
import { Outlet, Link } from "react-router-dom";
import { UI_LABELS } from "@/shared/constants/errors";
import { BrandSignatureBar } from "@/components/ui/BrandSignatureBar";
import { AuthBackgroundDecor } from "@/features/auth/components/AuthBackgroundDecor";

export const AuthLayout = (): ReactElement => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink flex flex-col justify-between">
      {/* Nền chữ ký AGU: 3 dải V mảnh góc trên trái + vòng đồng tâm + 2 cụm nơ-ron + 2 pill đối xứng */}
      <AuthBackgroundDecor />

      {/* Main container căn giữa — mobile full-width trừ lề 16px (px-4) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-lg overflow-hidden rounded-panel bg-surface border border-line shadow-lg flex flex-col">
          {/* Brand Signature Bar h-1 (4px) trên đỉnh thẻ */}
          <BrandSignatureBar />

          <div className="p-6 md:p-8 flex flex-col gap-6">
            {/* Header cụm Logo & Tên trường */}
            <div className="flex flex-col items-center text-center gap-3">
              <Link
                to="/"
                className="block w-full rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                aria-label="Trang chủ Cổng Việc làm Trường Đại học An Giang"
              >
                <img
                  src="/images/logo_AGU_HCM.png"
                  alt="Đại học Quốc gia Thành phố Hồ Chí Minh - Trường Đại học An Giang"
                  className="h-auto w-full"
                />
              </Link>
              <p className="text-small text-ink-2">
                {UI_LABELS.APP_PORTAL_SUBTITLE}
              </p>
            </div>

            {/* Nội dung trang con (LoginPage / RegisterPage) */}
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer liền mạch trên nền canvas, không vạch cắt ngang */}
      <footer className="relative z-10 py-5 px-4 text-center text-small text-ink-2">
        © 2026 Trường Đại học An Giang — ĐHQG-HCM. Hỗ trợ kỹ thuật:
        career@agu.edu.vn
      </footer>
    </div>
  );
};
