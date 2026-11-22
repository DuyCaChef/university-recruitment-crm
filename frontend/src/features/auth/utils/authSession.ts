// src/features/auth/utils/authSession.ts
// Xử lý thông tin người dùng được lưu trữ trong phiên làm việc
import type { AuthUser, UserRole } from "../types";

/**
 * Trích xuất an toàn thông tin người dùng được lưu trữ trong phiên làm việc
 */
export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user_info");
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Xác định route mặc định của từng Role theo DESIGN_SYSTEM.md 10.1
 */
export const getDefaultRouteByRole = (roles?: UserRole[]): string => {
  if (!roles || roles.length === 0) return "/student/jobs";
  if (roles.includes("CAREER_CENTER")) return "/career-center/dashboard";
  if (roles.includes("EMPLOYER")) return "/employer/jobs";
  if (roles.includes("SYSTEM_ADMIN")) return "/admin/users";
  return "/student/jobs";
};
