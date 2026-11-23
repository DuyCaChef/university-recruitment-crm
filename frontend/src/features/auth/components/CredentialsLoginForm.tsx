// src/features/auth/components/CredentialsLoginForm.tsx
import { useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ERROR_MESSAGES, UI_LABELS } from "@/shared/constants/errors";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLoginMutation } from "../hooks/useLoginMutation";
import type { ApiErrorPayload } from "../types";

interface CredentialsLoginFormProps {
  onOpenForgotPassword: () => void;
}

export const CredentialsLoginForm = ({
  onOpenForgotPassword,
}: CredentialsLoginFormProps): ReactElement => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSsoRequired, setIsSsoRequired] = useState<boolean>(false);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    if (values.email.trim().toLowerCase().endsWith("@student.agu.edu.vn")) {
      setIsSsoRequired(true);
      return;
    }
    setIsSsoRequired(false);
    loginMutation.mutate(values);
  };

  // Trích xuất mã lỗi từ phản hồi API (ACCOUNT_LOCKED, INVALID_CREDENTIALS...)
  const getServerErrorMessage = (): {
    code?: string;
    message: string;
  } | null => {
    if (!loginMutation.isError) return null;

    const error = loginMutation.error;
    if (isAxiosError<ApiErrorPayload>(error)) {
      const status = error.response?.status;
      const errorCode = error.response?.data?.errorCode;

      if (errorCode && ERROR_MESSAGES[errorCode]) {
        return { code: errorCode, message: ERROR_MESSAGES[errorCode] };
      }
      if (status === 401) {
        return {
          code: "INVALID_CREDENTIALS",
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }
      if (status === 403) {
        return {
          code: "ACCOUNT_LOCKED",
          message: ERROR_MESSAGES.ACCOUNT_LOCKED,
        };
      }
    }

    return { message: ERROR_MESSAGES.DEFAULT };
  };

  const serverError = getServerErrorMessage();
  const isAccountLocked = serverError?.code === "ACCOUNT_LOCKED";
  const isAccountInactive = serverError?.code === "ACCOUNT_INACTIVE";
  const isAccountBlocked = isAccountLocked || isAccountInactive;
  const emailValue = getValues("email") ?? "";
  const passwordValue = getValues("password") ?? "";
  const shouldShowEmailError =
    Boolean(errors.email) && (isSubmitted || emailValue.trim().length > 0);
  const shouldShowPasswordError =
    Boolean(errors.password) && (isSubmitted || passwordValue.length > 0);

  return (
    <section
      aria-labelledby="credentials-login-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1 text-center">
        <h2
          id="credentials-login-heading"
          className="mx-auto w-fit px-3 text-caption font-bold uppercase tracking-wider text-sand-ink"
        >
          {UI_LABELS.CREDENTIALS_SECTION_LABEL}
        </h2>
        <p className="text-sm text-ink-2">
          {UI_LABELS.CREDENTIALS_HELPER_TEXT}
        </p>
      </div>

      {/* Hiển thị cảnh báo lỗi từ Server ở đầu Form (Mục 8.6 & 10.3 DESIGN_SYSTEM.md) */}
      {isSsoRequired && (
        <div
          role="alert"
          className="rounded-input border border-danger bg-clay-100 p-3.5 text-small text-clay-ink flex items-start gap-2.5"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-danger mt-0.5"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-danger">
              Sinh viên phải dùng Google SSO
            </span>
            <span>{ERROR_MESSAGES.SSO_REQUIRED}</span>
          </div>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-input border border-danger bg-clay-100 p-3.5 text-small text-clay-ink flex items-start gap-2.5"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-danger mt-0.5"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-danger">
              {isAccountLocked
                ? "Tài khoản bị khóa truy cập"
                : isAccountInactive
                  ? "Tài khoản ngừng hoạt động"
                  : "Đăng nhập không thành công"}
            </span>
            <span>{serverError.message}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          id="login-email"
          type="email"
          label="Email tài khoản"
          placeholder="Nhập email doanh nghiệp hoặc cán bộ..."
          autoComplete="email"
          disabled={loginMutation.isPending || isAccountBlocked}
          error={shouldShowEmailError ? errors.email?.message : undefined}
          {...register("email")}
        />

        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          label="Mật khẩu"
          placeholder="Nhập mật khẩu..."
          autoComplete="current-password"
          disabled={loginMutation.isPending || isAccountBlocked}
          error={shouldShowPasswordError ? errors.password?.message : undefined}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="inline-flex h-8 w-10 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          }
          {...register("password")}
        />

        <div className="pt-1">
          <Button
            type="submit"
            variant="outline"
            size="lg"
            fullWidth
            isLoading={loginMutation.isPending}
            disabled={isAccountBlocked}
            className="border-sand text-white bg-sand-ink font-semibold hover:bg-[#4F3713] hover:border-[#4F3713] hover:text-white"
          >
            Đăng nhập
          </Button>
        </div>

        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-small font-medium text-brand-600 hover:text-brand-500 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xs px-2 py-1"
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-3 border-t border-line text-center">
          <p className="text-small text-ink-2">
            Doanh nghiệp chưa có tài khoản?{" "}

          </p>
          <p>
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-500 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xs px-1"
            >
              Đăng ký tài khoản Doanh nghiệp
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};
