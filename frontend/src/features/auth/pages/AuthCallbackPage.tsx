import axios from "axios";
import { useEffect, type ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "../api/authApi";
import type { ApiErrorPayload } from "../types";

/**
 * AuthCallbackPage — Hoàn tất Google SSO và nạp ngữ cảnh người dùng.
 *
 * Luồng: nhận token → lưu access_token → GET /users/me → lưu user_info
 * → chuyển đến danh sách việc làm của sinh viên.
 */
const getAuthErrorCode = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const responseData = error.response?.data;
    if (responseData?.errorCode) {
      return responseData.errorCode;
    }

    if (error.response?.status === 403) {
      return "FORBIDDEN";
    }
    if (error.response?.status === 401) {
      return "UNAUTHORIZED";
    }
  }

  return "NETWORK_ERROR";
};

const getErrorRedirect = (errorCode: string): string => {
  if (errorCode === "STUDENT_MASTER_NOT_FOUND") {
    return "/unauthorized";
  }

  if (
    errorCode === "STUDENT_SUSPENDED" ||
    errorCode === "STUDENT_SUPPEND"
  ) {
    return "/forbidden";
  }

  return `/login?error=${encodeURIComponent(errorCode)}`;
};

export default function AuthCallbackPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const callbackErrorCode = searchParams.get("error");
    let isActive = true;

    const completeAuthentication = async (): Promise<void> => {
      if (!token) {
        navigate(
          getErrorRedirect(callbackErrorCode ?? "UNAUTHORIZED"),
          { replace: true },
        );
        return;
      }

      localStorage.setItem("access_token", token);

      try {
        const currentUser = await getCurrentUser();
        if (!isActive) {
          return;
        }

        localStorage.setItem("user_info", JSON.stringify(currentUser));
        navigate("/student/jobs", { replace: true });
      } catch (error: unknown) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");

        if (isActive) {
          navigate(getErrorRedirect(getAuthErrorCode(error)), {
            replace: true,
          });
        }
      }
    };

    void completeAuthentication();

    return () => {
      isActive = false;
    };
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-8">
      <main
        className="w-full max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-lg md:p-8"
        aria-live="polite"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">
          Đang xác thực tài khoản AGU
        </h1>
        <p className="mt-2 text-sm leading-5 text-ink-2">
          Đang nạp thông tin người dùng và chuẩn bị không gian làm việc của bạn.
        </p>
        <Loader2
          className="mx-auto mt-6 h-5 w-5 animate-spin text-brand-600"
          aria-label="Đang xác thực"
        />
        <p className="mt-3 text-xs text-ink-3">
          Vui lòng không đóng cửa sổ này
        </p>
      </main>
    </div>
  );
}
