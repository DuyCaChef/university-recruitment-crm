// src/features/auth/schemas/companyRegister.schema.ts
import { z } from "zod";
import {
  evaluatePasswordStrength,
  strongPasswordSchema,
} from "@/shared/schemas/password.schema";

/**
 * Khớp VN_PHONE_REGEX ở Backend (backend/src/common/constants/validation.constant.ts):
 * - Di động 10 số: 03, 05, 07, 08, 09 + 8 chữ số
 * - Cố định 11 số: 02 + 9 chữ số (VD: 0296 3841 123)
 */
const VN_PHONE_REGEX = /^(?:(?:03|05|07|08|09)\d{8}|02\d{9})$/;

/** Mã số thuế doanh nghiệp Việt Nam: 10 số hoặc 10 số + "-xxx" hoặc 13 số */
const VN_TAX_CODE_REGEX = /^(?:\d{10}(?:-\d{3})?|\d{13})$/;

const optionalPhoneField = z
  .string()
  .trim()
  .max(30, "Số điện thoại không được vượt quá 30 ký tự.")
  .refine(
    (val) => val === "" || VN_PHONE_REGEX.test(val.replace(/[\s.-]/g, "")),
    "Số điện thoại không hợp lệ (di động 10 số đầu 03/05/07/08/09 hoặc cố định 11 số đầu 02).",
  );

const optionalWebsiteField = z
  .string()
  .trim()
  .max(500, "Đường dẫn website không được vượt quá 500 ký tự.")
  .refine((val) => {
    if (val === "") return true;
    try {
      const normalized = /^https?:\/\//i.test(val) ? val : `https://${val}`;
      const url = new URL(normalized);
      return url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Đường dẫn website không hợp lệ (VD: https://congty.com).");

export const companyRegisterSchema = z
  .object({
    // Bước 1: Tài khoản đăng nhập (Module 01)
    accountEmail: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email đăng nhập.")
      .max(255, "Email đăng nhập không được vượt quá 255 ký tự.")
      .email("Địa chỉ email đăng nhập không đúng định dạng.")
      .refine(
        (email) => !email.toLowerCase().endsWith("@student.agu.edu.vn"),
        "Tài khoản sinh viên (@student.agu.edu.vn) không đăng ký tại đây. Vui lòng đăng nhập qua Google SSO.",
      ),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu xác nhận."),

    // Bước 2: Thông tin pháp nhân doanh nghiệp (Module 04)
    companyName: z
      .string()
      .trim()
      .min(2, "Tên doanh nghiệp phải có ít nhất 2 ký tự.")
      .max(200, "Tên doanh nghiệp không được vượt quá 200 ký tự."),
    companyEmail: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email liên hệ chính thức của doanh nghiệp.")
      .max(255, "Email doanh nghiệp không được vượt quá 255 ký tự.")
      .email("Email liên hệ doanh nghiệp không đúng định dạng."),
    taxCode: z
      .string()
      .trim()
      .max(50, "Mã số thuế không được vượt quá 50 ký tự.")
      .refine(
        (val) => val === "" || VN_TAX_CODE_REGEX.test(val.replace(/\s+/g, "")),
        "Mã số thuế không hợp lệ (gồm 10 hoặc 13 chữ số, VD: 1600123456).",
      ),
    companyPhone: optionalPhoneField,
    website: optionalWebsiteField,
    address: z
      .string()
      .trim()
      .max(500, "Địa chỉ không được vượt quá 500 ký tự."),
    description: z
      .string()
      .trim()
      .max(1000, "Giới thiệu doanh nghiệp không được vượt quá 1000 ký tự."),

    // Bước 3: Người đại diện chính (Primary Contact)
    representativeName: z
      .string()
      .trim()
      .min(2, "Họ và tên người đại diện phải có ít nhất 2 ký tự.")
      .max(150, "Họ và tên không được vượt quá 150 ký tự."),
    representativePhone: optionalPhoneField,
    representativePosition: z
      .string()
      .trim()
      .max(100, "Chức vụ không được vượt quá 100 ký tự."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp với mật khẩu đã nhập.",
    path: ["confirmPassword"],
  });

export type CompanyRegisterFormValues = z.infer<typeof companyRegisterSchema>;

export const evaluateRegistrationPassword = evaluatePasswordStrength;