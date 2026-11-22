// src/layouts/FocusLayout.tsx
import { useState, type ReactElement } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/api/authApi";
import { BrandSignatureBar } from "@/components/ui/BrandSignatureBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * FocusLayout — Giao diện tập trung tối giản, bảo mật cao.
 * Dùng cho: Bắt buộc đổi mật khẩu lần đầu (EMPLOYER, CAREER_CENTER, SYSTEM_ADMIN) & Chờ duyệt.
 * TUYỆT ĐỐI KHÔNG dùng cho STUDENT (Sinh viên dùng Google SSO + JIT, không có mật khẩu tạm).
 * Tuân thủ nghiêm ngặt DESIGN_SYSTEM.md 7.1, 10.3 & UI/UX Pro Max.
 */
export function FocusLayout(): ReactElement {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Vẫn tiếp tục dọn dẹp storage ngay cả khi API logout gặp lỗi mạng
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col justify-between bg-canvas text-ink transition-colors duration-200">
      {/* ── Top Bar: Thanh điều hướng bảo mật tối giản ────────────────── */}
      <header className="sticky top-0 z-20 w-full border-b border-line bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 md:h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          {/* Logo chính thức của Trường Đại học An Giang - ĐHQG-HCM */}
          <Link
            to="/"
            className="flex items-center rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Trang chủ Cổng Việc làm Trường Đại học An Giang"
          >
            <img
              src="/images/logo_AGU_HCM.png"
              alt="Đại học Quốc gia Thành phố Hồ Chí Minh - Trường Đại học An Giang"
              className="h-10 md:h-9.5 w-auto max-w-[240px] sm:max-w-[340px] md:max-w-none object-contain"
            />
          </Link>

          {/* Thao tác Theme & Đăng xuất */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Nút chuyển đổi Dark/Light mode tái sử dụng */}
            <ThemeToggle variant="outline" size="md" />

            {/* Nút Đăng xuất ở Header */}
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="flex h-9 items-center gap-1.5 rounded-button border border-line-strong px-3 text-small font-medium text-ink hover:bg-danger-bg hover:text-danger-ink hover:border-danger-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-colors disabled:opacity-50"
              aria-label="Đăng xuất khỏi phiên làm việc hiện tại"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content: Card căn giữa, chiều rộng max-w-lg (512px) ───── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-lg overflow-hidden rounded-panel bg-surface border border-line shadow-md flex flex-col">
          {/* Brand Signature Bar 4px trên đỉnh thẻ */}
          <BrandSignatureBar />

          {/* Vùng nội dung biểu mẫu con */}
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer liền mạch trên nền canvas, không vạch cắt ngang */}
      <footer className="relative z-10 py-5 px-4 text-center text-small text-ink-2">
        © 2026 Trường Đại học An Giang — ĐHQG-HCM. Hỗ trợ kỹ thuật:{" "}
        <a
          href="mailto:career@agu.edu.vn"
          className="hover:underline hover:text-brand-600 transition-colors"
        >
          career@agu.edu.vn
        </a>
      </footer>
    </div>
  );
}

export default FocusLayout;
