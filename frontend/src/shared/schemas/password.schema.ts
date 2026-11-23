// src/shared/schemas/password.schema.ts
import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;

export const PASSWORD_RULES = {
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[^A-Za-z0-9\s]/,
} as const;

export const strongPasswordSchema = z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .min(
        PASSWORD_MIN_LENGTH,
        `Mật khẩu phải có tối thiểu ${PASSWORD_MIN_LENGTH} ký tự.`,
    )
    .max(
        PASSWORD_MAX_LENGTH,
        `Mật khẩu không được vượt quá ${PASSWORD_MAX_LENGTH} ký tự.`,
    )
    .regex(
        PASSWORD_RULES.hasLowercase,
        "Mật khẩu phải chứa ít nhất 1 chữ cái in thường (a-z).",
    )
    .regex(
        PASSWORD_RULES.hasUppercase,
        "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa (A-Z).",
    )
    .regex(
        PASSWORD_RULES.hasNumber,
        "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).",
    )
    .regex(
        PASSWORD_RULES.hasSpecialChar,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (VD: !@#$%^&*).",
    );

export interface PasswordEvaluationResult {
    hasMinLength: boolean;
    hasUpperAndLower: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    isMatch: boolean;
    score: number;
    strengthLabel: string;
    strengthColor: string;
}

export const evaluatePasswordStrength = (
    password: string,
    confirmPassword = "",
): PasswordEvaluationResult => {
    const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
    const hasUpperAndLower =
        PASSWORD_RULES.hasLowercase.test(password) &&
        PASSWORD_RULES.hasUppercase.test(password);
    const hasNumber = PASSWORD_RULES.hasNumber.test(password);
    const hasSpecialChar = PASSWORD_RULES.hasSpecialChar.test(password);
    const isMatch = confirmPassword.length > 0 && password === confirmPassword;

    const score = [
        hasMinLength,
        hasUpperAndLower,
        hasNumber,
        hasSpecialChar,
    ].filter(Boolean).length;

    if (score <= 1) {
        return {
            hasMinLength,
            hasUpperAndLower,
            hasNumber,
            hasSpecialChar,
            isMatch,
            score,
            strengthLabel: "Yếu",
            strengthColor: "text-danger-ink",
        };
    }

    if (score <= 3) {
        return {
            hasMinLength,
            hasUpperAndLower,
            hasNumber,
            hasSpecialChar,
            isMatch,
            score,
            strengthLabel: "Trung bình",
            strengthColor: "text-warning-ink",
        };
    }

    return {
        hasMinLength,
        hasUpperAndLower,
        hasNumber,
        hasSpecialChar,
        isMatch,
        score,
        strengthLabel: "Mạnh & Đạt chuẩn",
        strengthColor: "text-success-ink",
    };
};