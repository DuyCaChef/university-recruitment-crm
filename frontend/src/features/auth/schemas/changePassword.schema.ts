// src/features/auth/schemas/changePassword.schema.ts
import { z } from "zod";
import {
  evaluatePasswordStrength,
  strongPasswordSchema,
  type PasswordEvaluationResult,
} from "@/shared/schemas/password.schema";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu hiện tại."),
    newPassword: strongPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, "Vui lòng nhập lại mật khẩu mới để xác nhận."),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp với mật khẩu mới.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ChangePasswordInput = ChangePasswordFormValues;

export interface ChangePasswordCriteriaResult extends PasswordEvaluationResult {
  isDifferentFromCurrent: boolean;
  isMatchConfirm: boolean;
}

export const evaluatePasswordCriteria = (
  newPassword: string,
  currentPassword = "",
  confirmPassword = "",
): ChangePasswordCriteriaResult => {
  const base = evaluatePasswordStrength(newPassword, confirmPassword);
  const isDifferentFromCurrent =
    newPassword.length > 0 && newPassword !== currentPassword;

  return {
    ...base,
    isDifferentFromCurrent,
    isMatchConfirm: base.isMatch,
  };
};