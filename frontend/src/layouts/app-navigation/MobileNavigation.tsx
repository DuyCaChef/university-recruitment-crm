import { LogOut, MoreHorizontal, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { NavItem } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/cn";
import { NavItemList } from "./NavItemList";

interface MobileNavigationProps {
  navItems: NavItem[];
  primaryItems: NavItem[];
  secondaryItems: NavItem[];
  brandTitle: string;
  brandSubtitle: string;
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  onLogout: () => void;
}

export function MobileNavigation({
  navItems,
  primaryItems,
  secondaryItems,
  brandTitle,
  brandSubtitle,
  drawerOpen,
  onDrawerOpenChange,
  onLogout,
}: MobileNavigationProps) {
  return (
    <>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(12,22,25,0.5)] md:hidden"
          onClick={() => onDrawerOpenChange(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-line/80 bg-gradient-to-b from-surface via-surface to-brand-50/50 shadow-lg transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
          drawerOpen ? "flex translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <BrandLogo
            size="md"
            subtitle={brandSubtitle}
            title={brandTitle}
            variant="horizontal"
          />
          <button
            type="button"
            onClick={() => onDrawerOpenChange(false)}
            aria-label="Đóng menu"
            className="rounded-button p-2 text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 py-5" aria-label="Điều hướng chính">
          {!navItems.some((item) => item.section) && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">
              Không gian làm việc
            </p>
          )}
          <NavItemList
            navItems={navItems}
            showLabel
            onItemClick={() => onDrawerOpenChange(false)}
          />
        </nav>
        <div className="flex items-center justify-between border-t border-line/80 p-4">
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
      </div>

      <nav
        className="fixed bottom-3 left-3 right-3 z-30 overflow-hidden rounded-card border border-line/80 bg-surface/95 shadow-lg backdrop-blur-md md:hidden"
        aria-label="Điều hướng dưới"
      >
        <div className="flex h-16 items-center gap-1 px-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    "group flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-button py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none",
                    isActive ? "text-brand-600" : "text-ink-3",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-pill transition-all duration-200",
                        isActive
                          ? "bg-brand-100 text-brand-700 shadow-sm"
                          : "text-ink-3 group-hover:bg-brand-50 group-hover:text-brand-600",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="max-w-full truncate whitespace-nowrap">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          {secondaryItems.length > 0 && (
            <button
              type="button"
              onClick={() => onDrawerOpenChange(true)}
              aria-label="Mở thêm mục điều hướng"
              className="group flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-button py-1 text-[10px] font-semibold text-ink-3 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-pill transition-colors group-hover:bg-brand-50">
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="max-w-full truncate whitespace-nowrap">Thêm</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
