import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/shared/types/common.types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Nếu true, hiển thị trong bottom-nav mobile (tối đa 4 mục) */
  primary?: boolean;
}

/** Danh mục menu theo vai trò — DESIGN_SYSTEM.md Mục 10.1 */
export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { label: "Việc làm", to: "/student/jobs", icon: null as unknown as LucideIcon, primary: true },
    { label: "Hồ sơ", to: "/student/profile", icon: null as unknown as LucideIcon, primary: true },
    { label: "Đơn của tôi", to: "/student/applications", icon: null as unknown as LucideIcon, primary: true },
    { label: "Lịch phỏng vấn", to: "/student/interviews", icon: null as unknown as LucideIcon, primary: true },
    { label: "Việc làm đã lưu", to: "/student/saved-jobs", icon: null as unknown as LucideIcon },
    { label: "Thông báo", to: "/student/notifications", icon: null as unknown as LucideIcon },
  ],
  EMPLOYER: [
    { label: "Tin tuyển dụng", to: "/employer/jobs", icon: null as unknown as LucideIcon, primary: true },
    { label: "Phễu ứng viên", to: "/employer/pipeline", icon: null as unknown as LucideIcon, primary: true },
    { label: "Lịch phỏng vấn", to: "/employer/interviews", icon: null as unknown as LucideIcon, primary: true },
    { label: "Hồ sơ công ty", to: "/employer/profile", icon: null as unknown as LucideIcon, primary: true },
    { label: "Bảng điều khiển", to: "/employer/dashboard", icon: null as unknown as LucideIcon },
    { label: "Thông báo", to: "/employer/notifications", icon: null as unknown as LucideIcon },
  ],
  CAREER_CENTER: [
    { label: "Thẩm định", to: "/career-center/approvals/companies", icon: null as unknown as LucideIcon, primary: true },
    { label: "Duyệt tin", to: "/career-center/approvals/jobs", icon: null as unknown as LucideIcon, primary: true },
    { label: "Quan hệ đối tác (CRM)", to: "/career-center/crm", icon: null as unknown as LucideIcon, primary: true },
    { label: "Sự kiện", to: "/career-center/events", icon: null as unknown as LucideIcon, primary: true },
    { label: "Báo cáo", to: "/career-center/reports", icon: null as unknown as LucideIcon },
    { label: "Bảng điều khiển", to: "/career-center/dashboard", icon: null as unknown as LucideIcon },
  ],
  /** SYSTEM_ADMIN không có menu CRM — FR-CRM-05 */
  SYSTEM_ADMIN: [
    { label: "Người dùng", to: "/admin/users", icon: null as unknown as LucideIcon, primary: true },
    { label: "Phân quyền", to: "/admin/roles", icon: null as unknown as LucideIcon, primary: true },
    { label: "Nhật ký kiểm toán", to: "/admin/audit", icon: null as unknown as LucideIcon, primary: true },
  ],
};
