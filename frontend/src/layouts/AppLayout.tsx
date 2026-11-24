import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase, User, FileText, Calendar, Bookmark,
  Building2, Kanban, LayoutDashboard,
  CheckCircle, FileCheck2, MessageSquareCheck, BarChart3,
  Users, Shield, ClipboardList, CalendarDays,
  Bell, LogOut, Menu, X, ChevronLeft, ChevronRight, MoreHorizontal,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { UserRole } from "@/shared/types/common.types";
import { logout } from "@/features/auth/api/authApi";
import { studentProfileApi } from "@/features/students/api/studentProfileApi";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ── Icon map — gắn icon thực cho từng route ─────── */
const ICON_MAP: Record<string, typeof Briefcase> = {
  "/student/jobs": Briefcase,
  "/student/profile": User,
  "/student/applications": FileText,
  "/student/interviews": Calendar,
  "/student/saved-jobs": Bookmark,
  "/student/notifications": Bell,
  "/employer/jobs": Briefcase,
  "/employer/pipeline": Kanban,
  "/employer/interviews": Calendar,
  "/employer/profile": Building2,
  "/employer/dashboard": LayoutDashboard,
  "/employer/notifications": Bell,
  "/career-center/approvals/companies": CheckCircle,
  "/career-center/approvals/jobs": FileCheck2,
  "/career-center/crm": MessageSquareCheck,
  "/career-center/events": CalendarDays,
  "/career-center/reports": BarChart3,
  "/career-center/dashboard": LayoutDashboard,
  "/admin/users": Users,
  "/admin/roles": Shield,
  "/admin/audit": ClipboardList,
};

interface NavItem {
  label: string;
  to: string;
  primary?: boolean;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { label: "Việc làm", to: "/student/jobs", primary: true },
    { label: "Hồ sơ", to: "/student/profile", primary: true },
    { label: "Đơn của tôi", to: "/student/applications", primary: true },
    { label: "Lịch phỏng vấn", to: "/student/interviews", primary: true },
    { label: "Việc làm đã lưu", to: "/student/saved-jobs" },
    { label: "Thông báo", to: "/student/notifications" },
  ],
  EMPLOYER: [
    { label: "Tin tuyển dụng", to: "/employer/jobs", primary: true },
    { label: "Phễu ứng viên", to: "/employer/pipeline", primary: true },
    { label: "Lịch phỏng vấn", to: "/employer/interviews", primary: true },
    { label: "Hồ sơ công ty", to: "/employer/profile", primary: true },
    { label: "Bảng điều khiển", to: "/employer/dashboard" },
    { label: "Thông báo", to: "/employer/notifications" },
  ],
  CAREER_CENTER: [
    { label: "Thẩm định", to: "/career-center/approvals/companies", primary: true },
    { label: "Duyệt tin", to: "/career-center/approvals/jobs", primary: true },
    { label: "Quan hệ đối tác (CRM)", to: "/career-center/crm", primary: true },
    { label: "Sự kiện", to: "/career-center/events", primary: true },
    { label: "Báo cáo", to: "/career-center/reports" },
    { label: "Bảng điều khiển", to: "/career-center/dashboard" },
  ],
  SYSTEM_ADMIN: [
    { label: "Người dùng", to: "/admin/users", primary: true },
    { label: "Phân quyền", to: "/admin/roles", primary: true },
    { label: "Nhật ký kiểm toán", to: "/admin/audit", primary: true },
  ],
};

interface AppLayoutProps {
  role?: UserRole;
  userName?: string;
  userAvatar?: string;
}

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: "Sinh viên",
  EMPLOYER: "Doanh nghiệp",
  CAREER_CENTER: "Cán bộ",
  SYSTEM_ADMIN: "Quản trị viên",
};

export function AppLayout({ role = "STUDENT", userName = "Người dùng", userAvatar }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS[role];
  const primaryItems = navItems.filter((item) => item.primary);
  const secondaryItems = navItems.filter((item) => !item.primary);

  const studentProfileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentProfileApi.getProfile,
    enabled: role === "STUDENT",
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const studentProfile = studentProfileQuery.data;
  const effectiveUserName =
    role === "STUDENT"
      ? studentProfile?.displayName?.trim() ||
        studentProfile?.fullName ||
        userName
      : userName;

  const effectiveUserAvatar =
    role === "STUDENT"
      ? (studentProfile?.avatarUrl ?? userAvatar)
      : userAvatar;

  const userInitial = (effectiveUserName.trim() || "U").charAt(0).toUpperCase();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      navigate("/login", { replace: true });
    }
  };

  const getPageTitle = () => {
    const matched = navItems.find((item) => location.pathname.startsWith(item.to));
    return matched?.label ?? "Trang chủ";
  };

  const NavItemLink = ({
    item,
    showLabel,
    onClick,
  }: {
    item: NavItem;
    showLabel: boolean;
    onClick?: () => void;
  }) => {
    const Icon = ICON_MAP[item.to] ?? Briefcase;
    return (
      <NavLink
        to={item.to}
        onClick={onClick}
        title={!showLabel ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
            showLabel ? "w-full" : "justify-center",
            isActive
              ? "bg-brand-100 text-brand-700"
              : "text-ink-2 hover:bg-brand-50 hover:text-brand-600",
          )
        }
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {showLabel && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-dvh bg-canvas font-sans">
      {/* ── Desktop Sidebar ──────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden desktop:flex flex-col border-r border-line bg-surface transition-all duration-300",
          sidebarCollapsed ? "w-[72px]" : "w-64",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-line",
            sidebarCollapsed ? "justify-center px-3" : "gap-3 px-5",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <span className="block text-sm font-bold leading-tight text-ink">
                AGU CAREER
              </span>
              <span className="block text-xs font-semibold text-brand-600">
                {ROLE_LABEL[role]}
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavItemLink key={item.to} item={item} showLabel={!sidebarCollapsed} />
          ))}
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-line p-3", sidebarCollapsed ? "flex justify-center" : "space-y-2")}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-2 py-1">
              {effectiveUserAvatar ? (
                <img
                  src={effectiveUserAvatar}
                  alt={effectiveUserName}
                  className="h-8 w-8 rounded-pill object-cover shrink-0"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-brand-100 text-sm font-bold text-brand-700 shrink-0">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink">{effectiveUserName}</p>
                <p className="text-xs text-ink-3">{ROLE_LABEL[role]}</p>
              </div>
            </div>
          )}
          <div className={cn("flex items-center", sidebarCollapsed ? "flex-col gap-2" : "justify-between px-1")}>
            <ThemeToggle variant="ghost" size="sm" />
            <button
              type="button"
              onClick={() => void handleLogout()}
              title="Đăng xuất"
              className="rounded-button p-2 text-ink-2 hover:bg-danger-bg hover:text-danger-ink transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          aria-label={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-pill border border-line bg-surface text-ink-2 shadow-sm hover:bg-subtle transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* ── Tablet Rail (72px) ───────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden md:flex desktop:hidden w-[72px] flex-col border-r border-line bg-surface",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-line">
          <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavItemLink key={item.to} item={item} showLabel={false} />
          ))}
        </nav>
        <div className="border-t border-line p-2 flex flex-col items-center gap-2">
          <ThemeToggle variant="ghost" size="sm" />
          <button
            type="button"
            onClick={() => void handleLogout()}
            title="Đăng xuất"
            className="rounded-button p-2 text-ink-2 hover:bg-danger-bg hover:text-danger-ink transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer overlay ─────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(12,22,25,0.5)] md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex-col bg-surface shadow-lg transition-transform duration-300 md:hidden",
          drawerOpen ? "flex translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-ink">AGU CAREER</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Đóng menu"
            className="rounded-button p-2 text-ink-2 hover:bg-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavItemLink
              key={item.to}
              item={item}
              showLabel
              onClick={() => setDrawerOpen(false)}
            />
          ))}
        </nav>
        <div className="border-t border-line p-4 flex items-center justify-between">
          <ThemeToggle variant="ghost" size="sm" />
          <button
            type="button"
            onClick={() => void handleLogout()}
            title="Đăng xuất"
            className="rounded-button p-2 text-ink-2 hover:bg-danger-bg hover:text-danger-ink"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Main area ────────────────────────── */}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0",
          "md:pl-[72px] desktop:transition-all desktop:duration-300",
          sidebarCollapsed ? "desktop:pl-[72px]" : "desktop:pl-64",
        )}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở menu"
            className="rounded-button p-2 text-ink-2 hover:bg-subtle"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold text-ink">{getPageTitle()}</h1>
          <button className="rounded-button p-2 text-ink-2 hover:bg-subtle relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-danger-ink ring-2 ring-surface" />
          </button>
        </header>

        {/* Tablet/Desktop Header */}
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-line bg-surface px-6 md:flex">
          <h1 className="text-base font-bold text-ink">{getPageTitle()}</h1>
          <div className="flex items-center gap-3">
            <button className="relative rounded-button p-2 text-ink-2 hover:bg-subtle transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-danger-ink ring-2 ring-surface" />
            </button>
            <div className="h-6 w-px bg-line" aria-hidden="true" />
            {effectiveUserAvatar ? (
              <img
                src={effectiveUserAvatar}
                alt={effectiveUserName}
                className="h-8 w-8 rounded-pill object-cover shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-brand-100 text-sm font-bold text-brand-700">
                {userInitial}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 desktop:p-8 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Nav ────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface md:hidden"
        aria-label="Điều hướng dưới"
      >
        <div className="flex h-16 items-center">
          {primaryItems.map((item) => {
            const Icon = ICON_MAP[item.to] ?? Briefcase;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors",
                    isActive ? "text-brand-600" : "text-ink-3",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn("h-5 w-5", isActive && "text-brand-600")}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          {secondaryItems.length > 0 && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold text-ink-3"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
              <span>Thêm</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}