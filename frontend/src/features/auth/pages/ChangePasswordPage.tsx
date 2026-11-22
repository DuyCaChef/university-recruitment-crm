// src/features/auth/pages/ChangePasswordPage.tsx
import {
  useState,
  useRef,
  type ReactElement,
  useEffect,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Lock,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { changePassword, logout, authKeys } from "../api/authApi";
import {
  changePasswordSchema,
  evaluatePasswordCriteria,
  type ChangePasswordFormValues,
} from "../schemas/changePassword.schema";
import {
  getStoredUser,
  getDefaultRouteByRole,
} from "../utils/authSession";
import type { ApiErrorPayload, UserRole } from "../types";

const ROLE_NAME_MAP: Record<UserRole, string> = {
  STUDENT: "Sinh viên",
  EMPLOYER: "Doanh nghiệp",
  CAREER_CENTER: "Cán bộ Career Center",
  SYSTEM_ADMIN: "Quản trị viên",
};

export default function ChangePasswordPage(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Trạng thái hiển thị mật khẩu độc lập cho từng ô nhập
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Trạng thái gửi biểu mẫu và thông báo lỗi server
  const [serverError, setServerError] = useState<{
    code?: string;
    message: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Đọc thông tin tài khoản hiện tại từ phiên
  const currentUser = getStoredUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Theo dõi giá trị realtime bằng useWatch (tương thích React Compiler và memoization)
  const currentPasswordVal = useWatch({ control, name: "currentPassword" }) || "";
  const newPasswordVal = useWatch({ control, name: "newPassword" }) || "";
  const confirmPasswordVal = useWatch({ control, name: "confirmPassword" }) || "";

  const criteria = evaluatePasswordCriteria(
    newPasswordVal,
    currentPasswordVal,
    confirmPasswordVal,
  );

  // Tự động focus vào Error Summary khi submit gặp lỗi (WCAG 2.2 Form Accessibility)
  useEffect(() => {
    if (serverError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [serverError]);

  const onSubmit = async (values: ChangePasswordFormValues): Promise<void> => {
    setServerError(null);

    try {
      // 1. Gửi request đổi mật khẩu — Backend thực thi câu lệnh nguyên tử
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      // 2. Cập nhật cờ mustChangePassword = false trong phiên cục bộ
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          mustChangePassword: false,
        };
        localStorage.setItem("user_info", JSON.stringify(updatedUser));
        queryClient.setQueryData(authKeys.currentUser(), updatedUser);
      }

      // 3. Hiển thị màn hình thành công & mở khóa quyền hạn
      setIsSuccess(true);

      // 4. Tự động chuyển hướng vào không gian làm việc chính sau 1.5 giây
      const targetRoute = getDefaultRouteByRole(currentUser?.roles);
      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 1500);
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorPayload>(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        const errorCode = data?.errorCode;

        // Xử lý xung đột cập nhật đồng thời (HTTP 409 Conflict)
        if (status === 409) {
          setServerError({
            code: "CONFLICT",
            message:
              "Đã xảy ra xung đột phiên làm việc: Mật khẩu đã được cập nhật từ một phiên khác hoặc yêu cầu bị trùng lặp. Vui lòng đăng nhập lại.",
          });
          return;
        }

        // Xử lý sai mật khẩu cũ hoặc không hợp lệ (HTTP 400 Bad Request)
        if (status === 400) {
          const rawMsg = data?.message;
          const msg =
            (Array.isArray(rawMsg) ? rawMsg.join(". ") : rawMsg) ||
            "Mật khẩu hiện tại không chính xác hoặc dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
          setServerError({
            code: errorCode || "BAD_REQUEST",
            message: msg,
          });
          return;
        }

        // Xử lý phiên làm việc hết hạn (HTTP 401)
        if (status === 401) {
          setServerError({
            code: "UNAUTHORIZED",
            message: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
          });
          return;
        }

        // Xử lý lỗi cấm quyền (HTTP 403)
        if (status === 403) {
          setServerError({
            code: "FORBIDDEN",
            message:
              "Phiên hạn chế chưa được cấp quyền thực hiện thao tác khác ngoài đổi mật khẩu.",
          });
          return;
        }
      }

      setServerError({
        code: "NETWORK_ERROR",
        message:
          "Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra kết nối mạng và thử lại.",
      });
    }
  };

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // bỏ qua lỗi mạng khi logout
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  // ── Màn hình thành công (Atomic Update Success State) ────────────────
  if (isSuccess) {
    const targetRoute = getDefaultRouteByRole(currentUser?.roles);
    return (
      <section
        aria-labelledby="success-heading"
        className="flex flex-col items-center text-center gap-6 py-2"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-panel bg-success-bg text-success-ink border border-success-border animate-in zoom-in-95 duration-200">
          <ShieldCheck className="h-9 w-9" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <Badge variant="success" className="mx-auto">
            Mở khóa thành công
          </Badge>
          <h1 id="success-heading" className="text-h2 font-bold text-ink">
            Đã cập nhật mật khẩu mới!
          </h1>
          <p className="text-body text-ink-2 max-w-sm mx-auto">
            Mật khẩu mới đã được lưu an toàn. Toàn bộ phiên cũ trên các thiết bị
            khác đã được thu hồi và tài khoản của bạn đã được nâng cấp đầy đủ quyền
            hạn làm việc.
          </p>
        </div>

        <div className="w-full rounded-card bg-subtle p-4 text-left border border-line flex flex-col gap-2 text-xs text-ink-2">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
            <span>Hạ cờ must_change_password thành công</span>
          </div>
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
            <span>Ghi nhận nhật ký kiểm toán hệ thống (AUTH_PASSWORD_CHANGE)</span>
          </div>
        </div>

        <div className="w-full pt-2 flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={() => navigate(targetRoute, { replace: true })}
            className="flex items-center justify-center gap-2"
          >
            <span>Vào không gian làm việc ngay</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-ink-3 hover:text-ink py-1 rounded-xs transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Hoặc đăng xuất để đăng nhập lại với mật khẩu mới</span>
          </button>
        </div>
      </section>
    );
  }

  // ── Biểu mẫu đổi mật khẩu bắt buộc ───────────────────────────────────
  const userRole = currentUser?.roles?.[0] || "EMPLOYER";
  const roleLabel = ROLE_NAME_MAP[userRole] || "Người dùng";
  const userEmail = currentUser?.email || "Tài khoản của bạn";

  return (
    <section
      aria-labelledby="change-password-heading"
      className="flex flex-col gap-6"
    >
      {/* ── 1. Header & Tiêu đề biểu mẫu ─────────────────────────────── */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-brand-50 text-brand-600 border border-brand-200">
          <KeyRound className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1
            id="change-password-heading"
            className="text-2xl md:text-[26px] font-bold text-ink leading-tight tracking-tight"
          >
            Đổi mật khẩu tài khoản
          </h1>
          <p className="text-small text-ink-2 max-w-sm mx-auto">
            Đây là lần đăng nhập đầu tiên với mật khẩu tạm thời. Vui lòng thiết lập
            mật khẩu mới để bảo vệ an toàn và mở khóa không gian làm việc.
          </p>
        </div>
      </div>

      {/* ── 2. Thẻ nhận diện người dùng đang đăng nhập ─────────────────── */}
      <div className="flex items-center justify-between rounded-card border border-line bg-subtle p-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-brand-100 text-brand-700">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-small font-semibold text-ink truncate">
              {userEmail}
            </span>
            <span className="text-caption text-ink-3">
              Vai trò: {roleLabel}
            </span>
          </div>
        </div>
        <Badge variant="warning" className="shrink-0">
          Bắt buộc đổi
        </Badge>
      </div>

      {/* ── 3. Cảnh báo Phiên hạn chế ─────────────────────────────────── */}
      <Alert
        variant="info"
        title="Thông báo phiên làm việc hạn chế"
        className="text-xs"
      >
        Các tính năng nghiệp vụ (tuyển dụng, CRM, hồ sơ) tạm thời bị khóa cho đến
        khi bạn cập nhật mật khẩu mới. Sau khi cập nhật, toàn bộ phiên cũ trên các
        thiết bị khác sẽ tự động được thu hồi.
      </Alert>

      {/* ── 4. Error Summary (Hộp báo lỗi tập trung, focusable) ───────── */}
      {serverError && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="rounded-card border-2 border-danger-border bg-danger-bg p-4 text-small text-danger-ink flex items-start gap-3 outline-none focus:ring-2 focus:ring-danger-border"
        >
          <AlertCircle
            className="h-5 w-5 shrink-0 text-danger-ink mt-0.5"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-danger-ink">
              {serverError.code === "CONFLICT"
                ? "Xung đột cập nhật phiên"
                : "Không thể hoàn tất đổi mật khẩu"}
            </span>
            <span className="text-xs leading-relaxed">{serverError.message}</span>
          </div>
        </div>
      )}

      {/* ── 5. Biểu mẫu đổi mật khẩu ──────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Trường 1: Mật khẩu hiện tại (Mật khẩu tạm) */}
        <Input
          className="text-sm"
          id="current-password"
          type={showCurrentPassword ? "text" : "password"}
          label="Mật khẩu tạm thời hiện tại"
          placeholder="Nhập mật khẩu tạm bạn vừa đăng nhập..."
          autoComplete="current-password"
          disabled={isSubmitting}
          error={
            errors.currentPassword && (isSubmitted || currentPasswordVal.length > 0)
              ? errors.currentPassword.message
              : undefined
          }
          rightElement={
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              aria-label={
                showCurrentPassword
                  ? "Ẩn mật khẩu hiện tại"
                  : "Hiện mật khẩu hiện tại"
              }
              aria-pressed={showCurrentPassword}
              className="inline-flex h-8 w-10 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          }
          {...register("currentPassword")}
        />

        {/* Trường 2: Mật khẩu mới */}
        <div className="flex flex-col gap-2">
          <Input
            className="text-sm"
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            label="Mật khẩu mới"
            placeholder="Tối thiểu 6 ký tự, gồm chữ hoa, thường & số..."
            autoComplete="new-password"
            disabled={isSubmitting}
            error={
              errors.newPassword && (isSubmitted || newPasswordVal.length > 0)
                ? errors.newPassword.message
                : undefined
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"
                }
                aria-pressed={showNewPassword}
                className="inline-flex h-8 w-10 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            }
            {...register("newPassword")}
          />

          {/* Thanh đo độ mạnh mật khẩu (Strength Meter) */}
          {newPasswordVal.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-3">Độ mạnh mật khẩu:</span>
                <span className={`font-semibold ${criteria.strengthColor}`}>
                  {criteria.strengthLabel}
                </span>
              </div>
              <div
                className="grid grid-cols-3 gap-1.5 h-1.5 w-full"
                aria-hidden="true"
              >
                <div
                  className={`rounded-full transition-colors duration-150 ${
                    criteria.score >= 1
                      ? criteria.score === 1
                        ? "bg-danger"
                        : criteria.score === 2
                          ? "bg-warning"
                          : "bg-success"
                      : "bg-line"
                  }`}
                />
                <div
                  className={`rounded-full transition-colors duration-150 ${
                    criteria.score >= 2
                      ? criteria.score === 2
                        ? "bg-warning"
                        : "bg-success"
                      : "bg-line"
                  }`}
                />
                <div
                  className={`rounded-full transition-colors duration-150 ${
                    criteria.score >= 3 ? "bg-success" : "bg-line"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Danh sách tiêu chí kiểm tra trực tiếp (Live Criteria Checklist) */}
          <div className="rounded-input bg-canvas/70 p-3 border border-line">
            <span className="block text-caption font-bold text-ink-2 uppercase tracking-wider mb-2">
              Yêu cầu mật khẩu an toàn:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {criteria.hasMinLength ? (
                  <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4 text-ink-3 shrink-0" aria-hidden="true" />
                )}
                <span
                  className={
                    criteria.hasMinLength ? "text-ink font-medium" : "text-ink-3"
                  }
                >
                  Ít nhất 6 ký tự
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {criteria.hasUpperAndLower ? (
                  <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4 text-ink-3 shrink-0" aria-hidden="true" />
                )}
                <span
                  className={
                    criteria.hasUpperAndLower ? "text-ink font-medium" : "text-ink-3"
                  }
                >
                  Chữ hoa &amp; chữ thường
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {criteria.hasNumber ? (
                  <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4 text-ink-3 shrink-0" aria-hidden="true" />
                )}
                <span
                  className={
                    criteria.hasNumber ? "text-ink font-medium" : "text-ink-3"
                  }
                >
                  Chứa ít nhất 1 số (0-9)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {criteria.isDifferentFromCurrent ? (
                  <Check className="h-4 w-4 text-success-ink shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-4 w-4 text-danger-ink shrink-0" aria-hidden="true" />
                )}
                <span
                  className={
                    criteria.isDifferentFromCurrent
                      ? "text-ink font-medium"
                      : "text-danger-ink font-medium"
                  }
                >
                  Khác mật khẩu tạm thời
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trường 3: Xác nhận mật khẩu mới */}
        <div className="flex flex-col gap-1.5">
          <Input
            className="text-sm"
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            label="Xác nhận lại mật khẩu mới"
            placeholder="Nhập lại chính xác mật khẩu mới..."
            autoComplete="new-password"
            disabled={isSubmitting}
            error={
              errors.confirmPassword && (isSubmitted || confirmPasswordVal.length > 0)
                ? errors.confirmPassword.message
                : undefined
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Ẩn xác nhận mật khẩu"
                    : "Hiện xác nhận mật khẩu"
                }
                aria-pressed={showConfirmPassword}
                className="inline-flex h-8 w-10 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            }
            {...register("confirmPassword")}
          />

          {/* Phản hồi trạng thái trùng khớp realtime */}
          {confirmPasswordVal.length > 0 && (
            <p
              className={`flex items-center gap-1.5 text-xs ${
                criteria.isMatchConfirm ? "text-success-ink" : "text-ink-3"
              }`}
            >
              {criteria.isMatchConfirm ? (
                <>
                  <Check className="h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
                  <span>Mật khẩu xác nhận trùng khớp.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
                  <span>Mật khẩu xác nhận chưa khớp với mật khẩu mới.</span>
                </>
              )}
            </p>
          )}
        </div>

        {/* ── Nút Submit ─────────────────────────────────────────────── */}
        <div className="pt-2 flex flex-col gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="font-semibold shadow-sm"
          >
            <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Cập nhật mật khẩu &amp; Mở khóa</span>
          </Button>

          {/* Nút Đăng xuất an toàn ở chân form */}
          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isSubmitting || isLoggingOut}
              className="inline-flex items-center gap-1.5 text-small text-ink-2 hover:text-danger-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xs px-2 py-1 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Đăng xuất khỏi tài khoản này</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
