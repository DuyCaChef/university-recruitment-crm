import { z } from "zod";
import { getTodayInputValue } from "@/shared/lib/formatDate";

const VN_PHONE_REGEX = /^(?:(?:03|05|07|08|09)\d{8}|02\d{9})$/;

export const personalProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(150, "Tên hiển thị không được vượt quá 150 ký tự.")
    .refine(
      (val) => val === "" || val.length >= 2,
      "Tên hiển thị phải có ít nhất 2 ký tự (hoặc để trống để dùng tên gốc AGU).",
    ),
  phone: z
    .string()
    .trim()
    .max(30, "Số điện thoại không được vượt quá 30 ký tự.")
    .refine(
      (val) => val === "" || VN_PHONE_REGEX.test(val.replace(/[\s.-]/g, "")),
      "Số điện thoại không hợp lệ (di động 10 số đầu 03/05/07/08/09 hoặc cố định 11 số đầu 02).",
    ),
  dateOfBirth: z.string().refine((val) => {
    if (val === "") return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;

    const year = Number(val.slice(0, 4));
    const month = Number(val.slice(5, 7));
    const day = Number(val.slice(8, 10));
    const parsed = new Date(year, month - 1, day);

    return (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day &&
      val < getTodayInputValue()
    );
  }, "Ngày sinh không hợp lệ hoặc phải nhỏ hơn ngày hiện tại."),
  gender: z.enum(["", "Nam", "Nữ", "Khác"]),
  gpa: z
    .string()
    .trim()
    .refine((val) => {
      if (val === "") return true;
      if (!/^\d+(?:\.\d{1,2})?$/.test(val)) return false;
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0 && num <= 4;
    }, "GPA phải từ 0.00 đến 4.00 (tối đa 2 chữ số thập phân)."),
  address: z
    .string()
    .trim()
    .max(255, "Địa chỉ hiện tại không được vượt quá 255 ký tự."),
  bio: z
    .string()
    .trim()
    .max(2000, "Giới thiệu bản thân không được vượt quá 2000 ký tự."),
});

export type PersonalProfileFormValues = z.infer<typeof personalProfileSchema>;

export const skillFormSchema = z.object({
  skillName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên kỹ năng chuyên môn.")
    .max(100, "Tên kỹ năng không được vượt quá 100 ký tự."),
  proficiency: z
    .string()
    .trim()
    .max(30, "Mức độ thành thạo không được vượt quá 30 ký tự."),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;

export const experienceFormSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên công ty hoặc tổ chức.")
      .max(150, "Tên công ty không được vượt quá 150 ký tự."),
    position: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập vị trí đảm nhiệm.")
      .max(150, "Vị trí đảm nhiệm không được vượt quá 150 ký tự."),
    startDate: z
      .string()
      .min(1, "Vui lòng chọn ngày bắt đầu.")
      .refine(
        (val) => val <= getTodayInputValue(),
        "Ngày bắt đầu không được ở trong tương lai.",
      ),
    isCurrent: z.boolean(),
    endDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày kết thúc không được ở trong tương lai.",
      ),
    description: z
      .string()
      .trim()
      .max(2000, "Mô tả công việc không được vượt quá 2000 ký tự."),
  })
  .refine(
    (data) => data.isCurrent || !data.endDate || data.endDate >= data.startDate,
    {
      message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
      path: ["endDate"],
    },
  );

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên dự án hoặc đề tài.")
      .max(200, "Tên dự án không được vượt quá 200 ký tự."),
    role: z.string().trim().max(100, "Vai trò không được vượt quá 100 ký tự."),
    technologies: z
      .string()
      .trim()
      .max(
        500,
        "Nội dung công cụ & phương pháp không được vượt quá 500 ký tự.",
      ),
    projectUrl: z
      .string()
      .trim()
      .max(500, "Đường dẫn minh chứng không được vượt quá 500 ký tự.")
      .refine((val) => {
        if (val === "") return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }, "Đường dẫn phải là URL hợp lệ bắt đầu bằng http:// hoặc https://"),
    startDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày bắt đầu không được ở trong tương lai.",
      ),
    endDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày hoàn thành không được ở trong tương lai.",
      ),
    description: z
      .string()
      .trim()
      .max(2000, "Mô tả dự án không được vượt quá 2000 ký tự."),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: "Ngày hoàn thành không được nhỏ hơn ngày bắt đầu.",
      path: ["endDate"],
    },
  );

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
