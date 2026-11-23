// src/components/ui/fieldStyles.ts
/**
 * Shared Style Tokens & Classes for Form Fields (Input & Textarea)
 * Hệ thống Web CRM Tuyển dụng AGU — 100% tuân thủ DESIGN_SYSTEM.md 6.2
 */

/**
 * Lớp CSS nền tảng dùng chung cho cả Input và Textarea:
 * - Bo góc: rounded-input (12px)
 * - Nền: bg-surface (#FFFFFF hoặc #14222A)
 * - Padding ngang & Font: px-3.5 text-body text-ink placeholder:text-ink-3
 * - Viền cơ sở: border-2
 * - Tương tác hover/focus/disabled
 */
export const FIELD_BASE_CLASS =
  "w-full rounded-input border-2 bg-surface px-3.5 text-body text-ink placeholder:text-ink-3 transition-all duration-150 hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-3";

/** Viền trạng thái mặc định */
export const FIELD_BORDER_DEFAULT = "border-line-strong";

/** Viền trạng thái có lỗi và có dữ liệu nhập */
export const FIELD_BORDER_ERROR =
  "border-danger-border focus:border-danger-border focus:ring-4 focus:ring-danger-bg";

/** Nhãn form tiêu chuẩn */
export const FIELD_LABEL_CLASS = "text-small font-medium text-ink select-none";

/** Container bao bọc form control */
export const FIELD_CONTAINER_CLASS = "flex flex-col gap-1.5";

/** Thông báo lỗi bên dưới ô nhập */
export const FIELD_ERROR_MESSAGE_CLASS =
  "flex items-start gap-1.5 text-xs text-danger-ink";

/** Văn bản gợi ý / hướng dẫn bên dưới ô nhập */
export const FIELD_HELPER_TEXT_CLASS = "text-xs text-ink-3";
