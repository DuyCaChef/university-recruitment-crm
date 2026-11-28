import { Fragment, type ReactElement } from "react";
import type { NavItem } from "@/shared/constants/navigation";
import { NavItemLink } from "./NavItemLink";

interface NavItemListProps {
  navItems: NavItem[];
  showLabel: boolean;
  onItemClick?: () => void;
}

export const NavItemList = ({
  navItems,
  showLabel,
  onItemClick,
}: NavItemListProps): ReactElement => (
  <>
    {navItems.map((item, index) => {
      const startsSection =
        item.section !== undefined &&
        item.section !== navItems[index - 1]?.section;

      return (
        <Fragment key={item.to}>
          {startsSection &&
            (showLabel ? (
              <p
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-3 ${
                  index === 0 ? "mt-0" : "mt-4"
                }`}
              >
                {item.section}
              </p>
            ) : (
              index > 0 && (
                <div
                  className="my-3 mx-2 h-px bg-line"
                  aria-hidden="true"
                />
              )
            ))}
          <NavItemLink
            item={item}
            showLabel={showLabel}
            onClick={onItemClick}
          />
        </Fragment>
      );
    })}
  </>
);
