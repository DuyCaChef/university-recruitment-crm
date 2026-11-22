// src/features/auth/schemas/changePassword.schema.ts
import { z } from "zod";

/**
 * Zod Schema cho biểu mẫu Đổi mật khẩu bắt buộc lần đầu (FocusLayout)
 * Tuân thủ quy tắc DESIGN_SYSTEM.md 1.1, 8.5 & 8.6
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu tạm thời hiện tại."),
    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới.")
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa (A-Z).")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số (0-9)."),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận lại mật khẩu mới."),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Mật khẩu mới phải khác với mật khẩu tạm thời hiện tại.",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Tiện ích kiểm tra độ mạnh mật khẩu và từng tiêu chí phục vụ Live Checklist UI
 */
export interface PasswordCriteriaStatus {
  hasMinLength: boolean;
  hasUpperAndLower: boolean;
  hasNumber: boolean;
  isDifferentFromCurrent: boolean;
  isMatchConfirm: boolean;
  score: 0 | 1 | 2 | 3;
  strengthLabel: "Chưa nhập" | "Yếu" | "Trung bình" | "Mạnh & An toàn";
  strengthColor: string;
}

export function evaluatePasswordCriteria(
  newPassword: string,
  currentPassword: string,
  confirmPassword?: string,
): PasswordCriteriaStatus {
  const pwd = newPassword || "";
  const current = currentPassword || "";
  const confirm = confirmPassword || "";

  const hasMinLength = pwd.length >= 6;
  const hasUpperAndLower = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const isDifferentFromCurrent = current.length > 0 ? pwd !== current : true;
  const isMatchConfirm = confirm.length > 0 && pwd === confirm;

  if (pwd.length === 0) {
    return {
      hasMinLength: false,
      hasUpperAndLower: false,
      hasNumber: false,
      isDifferentFromCurrent: false,
      isMatchConfirm: false,
      score: 0,
      strengthLabel: "Chưa nhập",
      strengthColor: "text-ink-3",
    };
  }

  let passedCount = 0;
  if (hasMinLength) passedCount++;
  if (hasUpperAndLower) passedCount++;
  if (hasNumber) passedCount++;
  if (isDifferentFromCurrent && pwd.length >= 6) passedCount++;

  let score: 0 | 1 | 2 | 3;
  if (passedCount <= 2) {
    score = 1;
  } else if (passedCount === 3 || pwd.length < 8) {
    score = 2;
  } else {
    score = 3;
  }

  const strengthLabel =
    score === 3
      ? "Mạnh & An toàn"
      : score === 2
        ? "Trung bình"
        : "Yếu";

  const strengthColor =
    score === 3
      ? "text-success-ink"
      : score === 2
        ? "text-warning-ink"
        : "text-danger-ink";

  return {
    hasMinLength,
    hasUpperAndLower,
    hasNumber,
    isDifferentFromCurrent,
    isMatchConfirm,
    score,
    strengthLabel,
    strengthColor,
  };
}
