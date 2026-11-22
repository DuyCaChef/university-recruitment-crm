import type { ReactElement } from "react";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * UnauthorizedPage — Giải thích lỗi SSO khi email hợp lệ nhưng
 * chưa có trong dữ liệu sinh viên của nhà trường.
 */
export default function UnauthorizedPage(): ReactElement {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-canvas px-4 py-8 text-ink md:px-6">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-brand-200 opacity-60 md:h-96 md:w-96"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full border border-sand opacity-40"
        aria-hidden="true"
      />

      <main className="relative z-10 w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Link
            to="/login"
            className="inline-flex rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Về trang đăng nhập AGU CAREER"
          >
            <img
              src="/images/logo_AGU_HCM.png"
              alt="Trường Đại học An Giang - ĐHQG-HCM"
              className="h-auto w-56 md:w-64"
            />
          </Link>
        </div>

        <section
          role="alert"
          aria-labelledby="unauthorized-title"
          className="overflow-hidden rounded-panel border border-line bg-surface shadow-lg"
        >
          <div className="h-1 bg-danger-border" aria-hidden="true" />

          <div className="p-6 md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-pill bg-danger-bg text-danger-ink">
                <ShieldAlert className="h-8 w-8" aria-hidden="true" />
              </div>

              <p className="mt-5 text-caption font-bold uppercase tracking-[0.08em] text-danger-ink">
                Lỗi 401 · Tài khoản chưa được xác thực
              </p>
              <h1
                id="unauthorized-title"
                className="mt-3 text-2xl font-extrabold leading-tight text-ink md:text-[26px] md:leading-[34px]"
              >
                Tài khoản chưa có trong dữ liệu nhà trường
              </h1>
              <p className="mt-3 max-w-prose text-base leading-6 text-ink-2">
                Email Google bạn vừa sử dụng chưa được ghi nhận trong dữ liệu
                sinh viên của Trường Đại học An Giang nên chưa thể truy cập
                Cổng Việc làm.
              </p>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <div className="rounded-card border border-line bg-subtle p-4">
                <p className="text-sm font-bold text-ink">Nếu bạn là sinh viên AGU</p>
                <p className="mt-1.5 text-sm leading-5 text-ink-2">
                  Hãy thử lại bằng email có đuôi{" "}
                  <span className="font-mono font-medium text-ink">@student.agu.edu.vn</span>.
                </p>
              </div>
              <div className="rounded-card border border-line bg-subtle p-4">
                <p className="text-sm font-bold text-ink">Nếu thông tin chưa được cập nhật</p>
                <p className="mt-1.5 text-sm leading-5 text-ink-2">
                  Liên hệ Career Center để được kiểm tra và đồng bộ dữ liệu.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-center">
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Quay lại đăng nhập
              </Link>
              <a
                href="mailto:career@agu.edu.vn"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-line-strong bg-surface px-5 py-3 text-sm font-bold text-brand-text transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-ink-3">
          Cần hỗ trợ? career@agu.edu.vn · Cổng Việc làm &amp; Kết nối Doanh nghiệp AGU
        </p>
      </main>
    </div>
  );
}
