import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

/**
 * NotFoundPage — Trang 404 dùng chung.
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-pill bg-subtle">
        <SearchX className="h-10 w-10 text-ink-3" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-6xl font-black text-line-strong tabular-nums">404</h1>
      <p className="mt-2 text-base font-semibold text-ink">Trang không tồn tại</p>
      <p className="mt-1 max-w-sm text-sm text-ink-2">
        Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        to="/login"
        className="mt-6 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm"
      >
        Quay về trang đăng nhập
      </Link>
    </div>
  );
}
