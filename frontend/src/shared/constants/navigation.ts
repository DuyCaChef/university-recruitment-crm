import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  FileCheck2,
  FileText,
  Kanban,
  LayoutDashboard,
  MessageSquareCheck,
  Shield,
  User,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/shared/types/common.types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  section?: string;
  /** Nếu true, hiển thị trong bottom-nav mobile (tối đa 4 mục) */
  primary?: boolean;
}

/** Danh mục menu theo vai trò — DESIGN_SYSTEM.md Mục 10.1 */
export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { label: "Việc làm", to: "/student/jobs", icon: Briefcase, primary: true },
    { label: "Hồ sơ", to: "/student/profile", icon: User, primary: true },
    { label: "Đơn của tôi", to: "/student/applications", icon: FileText, primary: true },
    { label: "Lịch phỏng vấn", to: "/student/interviews", icon: Calendar, primary: true },
    { label: "Việc làm đã lưu", to: "/student/saved-jobs", icon: Bookmark },
    { label: "Thông báo", to: "/student/notifications", icon: Bell },
  ],
  EMPLOYER: [
    {
      label: "Bảng điều khiển",
      to: "/employer/dashboard",
      icon: LayoutDashboard,
      section: "Tổng quan",
      primary: true,
    },
    {
      label: "Tin tuyển dụng",
      to: "/employer/jobs",
      icon: Briefcase,
      section: "Tuyển dụng",
      primary: true,
    },
    {
      label: "Phễu ứng viên",
      to: "/employer/pipeline",
      icon: Kanban,
      section: "Tuyển dụng",
      primary: true,
    },
    {
      label: "Lịch phỏng vấn",
      to: "/employer/interviews",
      icon: Calendar,
      section: "Tuyển dụng",
      primary: true,
    },
    {
      label: "Tìm kiếm ứng viên",
      to: "/employer/candidates",
      icon: UserSearch,
      section: "Tuyển dụng",
    },
    {
      label: "Hồ sơ công ty",
      to: "/employer/profile",
      icon: Building2,
      section: "Tổ chức",
    },
  ],
  CAREER_CENTER: [
    { label: "Thẩm định", to: "/career-center/approvals/companies", icon: CheckCircle, primary: true },
    { label: "Duyệt tin", to: "/career-center/approvals/jobs", icon: FileCheck2, primary: true },
    { label: "Quan hệ đối tác (CRM)", to: "/career-center/crm", icon: MessageSquareCheck, primary: true },
    { label: "Hồ sơ sinh viên", to: "/career-center/students", icon: Users },
    { label: "Sự kiện", to: "/career-center/events", icon: CalendarDays, primary: true },
    { label: "Báo cáo", to: "/career-center/reports", icon: BarChart3 },
    { label: "Bảng điều khiển", to: "/career-center/dashboard", icon: LayoutDashboard },
  ],
  /** SYSTEM_ADMIN không có menu CRM — FR-CRM-05 */
  SYSTEM_ADMIN: [
    { label: "Người dùng", to: "/admin/users", icon: Users, primary: true },
    { label: "Phân quyền", to: "/admin/roles", icon: Shield, primary: true },
    { label: "Nhật ký kiểm toán", to: "/admin/audit", icon: ClipboardList, primary: true },
  ],
};

export const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: "Sinh viên",
  EMPLOYER: "Doanh nghiệp",
  CAREER_CENTER: "Cán bộ",
  SYSTEM_ADMIN: "Quản trị viên",
};
