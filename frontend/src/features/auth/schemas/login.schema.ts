// src/features/auth/schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email tài khoản của bạn.")
    .email("Địa chỉ email không đúng định dạng."),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .min(6, "Mật khẩu phải có tối thiểu 6 ký tự."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
