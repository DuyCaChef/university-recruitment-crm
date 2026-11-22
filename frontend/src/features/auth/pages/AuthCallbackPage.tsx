import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * AuthCallbackPage — Hứng token từ Google SSO redirect.
 *
 * Luồng: Backend /api/v1/auth/google → Google OAuth →
 *   Backend /auth/callback?token=<access_token> → (frontend) /auth/callback?token=...
 *   → Lưu token → redirect /student/jobs
 *
 * CHỈ DÀNH CHO STUDENT (SSO). EMPLOYER/CAREER_CENTER/SYSTEM_ADMIN
 * không đi qua callback này (must_change_password / PASSWORD_CHANGE_REQUIRED
 * chỉ áp dụng cho tài khoản mật khẩu nội bộ).
 */
export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const errorCode = searchParams.get("error");

    if (token) {
      // Lưu Access Token — backend JIT đã tạo / cập nhật tài khoản sinh viên
      localStorage.setItem("access_token", token);
      navigate("/student/jobs", { replace: true });
    } else if (errorCode === "STUDENT_MASTER_NOT_FOUND") {
      navigate("/unauthorized", { replace: true });
    } else if (
      errorCode === "STUDENT_SUSPENDED" ||
      errorCode === "STUDENT_SUPPEND"
    ) {
      navigate("/forbidden", { replace: true });
    } else {
      // Không có token — quay về login
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="h-10 w-10 animate-spin text-brand-600"
          aria-hidden="true"
        />
        <p className="text-sm font-semibold text-ink-2">
          Đang hoàn tất phiên đăng nhập tài khoản sinh viên AGU...
        </p>
        <p className="text-xs text-ink-3">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}
