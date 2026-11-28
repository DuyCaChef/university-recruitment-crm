import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/layouts/app-navigation/AppSidebar";
import { MobileNavigation } from "@/layouts/app-navigation/MobileNavigation";
import { logout } from "@/features/auth/api/authApi";
import { studentProfileApi } from "@/features/students/api/studentProfileApi";
import { NAV_ITEMS, ROLE_LABEL } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/cn";
import type { UserRole } from "@/shared/types/common.types";

interface AppLayoutProps {
  role?: UserRole;
  userName?: string;
  userAvatar?: string;
}

export function AppLayout({
  role = "STUDENT",
  userName = "Người dùng",
  userAvatar,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS[role];
  const primaryItems = navItems.filter((item) => item.primary);
  const secondaryItems = navItems.filter((item) => !item.primary);
  const brandTitle = role === "EMPLOYER" ? "AGU PARTNER" : "AGU CAREER";
  const brandSubtitle =
    role === "EMPLOYER" ? "Cổng Doanh nghiệp" : ROLE_LABEL[role];

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

  const matchedNavItem = navItems.find((item) => location.pathname.startsWith(item.to));
  const pageTitle = matchedNavItem?.label ?? "Trang chủ";

  return (
    <div className="flex min-h-dvh bg-canvas font-sans">
      <AppSidebar
        navItems={navItems}
        roleLabel={ROLE_LABEL[role]}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
        userName={effectiveUserName}
        userAvatar={effectiveUserAvatar}
        userInitial={userInitial}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        onLogout={handleLogout}
      />

      <MobileNavigation
        navItems={navItems}
        primaryItems={primaryItems}
        secondaryItems={secondaryItems}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
        drawerOpen={drawerOpen}
        onDrawerOpenChange={setDrawerOpen}
        onLogout={handleLogout}
      />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          "md:pl-[72px] desktop:transition-all desktop:duration-300",
          sidebarCollapsed ? "desktop:pl-[72px]" : "desktop:pl-64",
        )}
      >
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở menu"
            className="rounded-button p-2 text-ink-2 transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1 className="text-sm font-bold text-ink">{pageTitle}</h1>
          <button
            type="button"
            aria-label="Thông báo"
            className="relative rounded-button p-2 text-ink-2 transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-danger-ink ring-2 ring-surface" />
          </button>
        </header>

        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-line bg-surface px-6 md:flex">
          <h1 className="text-base font-bold text-ink">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Thông báo"
              className="relative rounded-button p-2 text-ink-2 transition-colors hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-danger-ink ring-2 ring-surface" />
            </button>
            <div className="h-6 w-px bg-line" aria-hidden="true" />
            {effectiveUserAvatar ? (
              <img
                src={effectiveUserAvatar}
                alt={effectiveUserName}
                className="h-8 w-8 shrink-0 rounded-pill object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-brand-100 text-sm font-bold text-brand-700">
                {userInitial}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6 desktop:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
