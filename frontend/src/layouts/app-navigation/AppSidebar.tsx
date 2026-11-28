import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { NavItem } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/cn";
import { NavItemList } from "./NavItemList";

interface AppSidebarProps {
  navItems: NavItem[];
  roleLabel: string;
  brandTitle: string;
  brandSubtitle: string;
  userName: string;
  userAvatar?: string;
  userInitial: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onLogout: () => void;
}

export function AppSidebar({
  navItems,
  roleLabel,
  brandTitle,
  brandSubtitle,
  userName,
  userAvatar,
  userInitial,
  collapsed,
  onToggleCollapsed,
  onLogout,
}: AppSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-gradient-to-b from-surface via-surface to-brand-50/40 shadow-md transition-[width] duration-300 ease-out motion-reduce:transition-none desktop:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-line",
            collapsed ? "justify-center px-3" : "px-5",
          )}
        >
          {collapsed ? (
            <BrandLogo
              size="md"
              subtitle={brandSubtitle}
              title={brandTitle}
              variant="mark"
            />
          ) : (
            <BrandLogo
              size="md"
              subtitle={brandSubtitle}
              title={brandTitle}
              variant="horizontal"
            />
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Điều hướng chính">
          {!collapsed && !navItems.some((item) => item.section) && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">
              Không gian làm việc
            </p>
          )}
          <NavItemList navItems={navItems} showLabel={!collapsed} />
        </nav>

        <div className={cn("border-t border-line/80 p-3", collapsed ? "flex justify-center" : "space-y-3")}>
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-card border border-line/70 bg-canvas/70 p-2.5">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-10 w-10 shrink-0 rounded-pill object-cover ring-2 ring-surface"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-gradient-to-br from-brand-100 to-mist-100 text-sm font-bold text-brand-700 ring-2 ring-surface">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">{userName}</p>
                <p className="mt-0.5 truncate text-[11px] text-ink-3">{roleLabel}</p>
              </div>
            </div>
          )}
          <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "justify-between px-1")}>
            <ThemeToggle
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2"
            />
            <button
              type="button"
              onClick={() => void onLogout()}
              title="Đăng xuất"
              aria-label="Đăng xuất"
              className="rounded-button p-2 text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-danger-bg hover:text-danger-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          className="absolute -right-3 top-12 flex h-7 w-7 items-center justify-center rounded-pill border border-line bg-surface text-ink-2 shadow-md transition-all duration-200 hover:scale-110 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col border-r border-line bg-gradient-to-b from-surface to-brand-50/40 shadow-sm md:flex desktop:hidden">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-line">
          <BrandLogo
            size="md"
            subtitle={brandSubtitle}
            title={brandTitle}
            variant="mark"
          />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 py-5" aria-label="Điều hướng chính">
          <NavItemList navItems={navItems} showLabel={false} />
        </nav>
        <div className="flex flex-col items-center gap-2 border-t border-line/80 p-2">
          <ThemeToggle variant="ghost" size="sm" className="transition-colors hover:bg-brand-50 hover:text-brand-700" />
          <button
            type="button"
            onClick={() => void onLogout()}
            title="Đăng xuất"
            aria-label="Đăng xuất"
            className="rounded-button p-2 text-ink-2 transition-colors hover:bg-danger-bg hover:text-danger-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}
