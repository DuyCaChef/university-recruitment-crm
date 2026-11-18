import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm gộp Tailwind class — dùng clsx để xử lý điều kiện,
 * twMerge để loại bỏ class xung đột.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
