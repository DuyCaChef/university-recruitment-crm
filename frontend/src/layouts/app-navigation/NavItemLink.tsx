import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import type { NavItem } from "@/shared/constants/navigation";

interface NavItemLinkProps {
  item: NavItem;
  showLabel: boolean;
  onClick?: () => void;
}

export function NavItemLink({ item, showLabel, onClick }: NavItemLinkProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      title={!showLabel ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none",
          showLabel ? "w-full" : "w-full justify-center",
          isActive
            ? "bg-gradient-to-r from-brand-100 to-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200/80"
            : "text-ink-2 hover:translate-x-0.5 hover:bg-brand-50/80 hover:text-brand-700 hover:shadow-sm",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-pill bg-brand-600 transition-opacity duration-200",
              isActive ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          />
          <Icon
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
          {showLabel && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}
