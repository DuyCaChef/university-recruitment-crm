import type { UserRole } from "@/shared/types/common.types";

/**
 * Danh sách mã quyền hành động trong hệ thống AGU Recruitment CRM
 */
export type PermissionCode =
  | "JOB_VIEW"
  | "JOB_CREATE"
  | "JOB_APPROVE"
  | "COMPANY_APPROVE"
  | "CRM_ACCESS"
  | "STUDENT_APPLY"
  | "PIPELINE_MANAGE"
  | "USER_MANAGE"
  | "AUDIT_VIEW";

/**
 * Ma trận phân quyền mặc định theo vai trò:
 * Lưu ý: SYSTEM_ADMIN KHÔNG có quyền CRM_ACCESS (FR-CRM-05, DESIGN_SYSTEM.md 10.1)
 */
const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  STUDENT: ["JOB_VIEW", "STUDENT_APPLY"],
  EMPLOYER: ["JOB_VIEW", "JOB_CREATE", "PIPELINE_MANAGE"],
  CAREER_CENTER: [
    "JOB_VIEW",
    "JOB_CREATE",
    "JOB_APPROVE",
    "COMPANY_APPROVE",
    "CRM_ACCESS",
    "AUDIT_VIEW",
  ],
  SYSTEM_ADMIN: ["USER_MANAGE", "AUDIT_VIEW"],
};

/**
 * Hook kiểm tra quyền của người dùng hiện tại (DESIGN_SYSTEM.md Mục 10.2).
 * Frontend chỉ ẩn/hiện giao diện; backend chịu trách nhiệm kiểm tra thực tế.
 */
export function usePermission(permission: PermissionCode, currentRole?: UserRole): boolean {
  // Lấy role từ tham số hoặc từ localStorage phiên đăng nhập
  const role: UserRole =
    currentRole ||
    (localStorage.getItem("user_role") as UserRole) ||
    "STUDENT";

  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
