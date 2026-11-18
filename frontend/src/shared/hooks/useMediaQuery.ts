import { useSyncExternalStore } from "react";

/**
 * Hook lắng nghe media query theo các breakpoint của hệ thống:
 * mobile: < 768px
 * tablet: 768px - 1024px (md:)
 * desktop: >= 1025px (desktop:)
 *
 * Dùng useSyncExternalStore (React 18+/19) để đồng bộ trạng thái từ window.matchMedia
 * mà không gây cascading render.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(query).matches;
    },
    () => false,
  );
}

/** Shorthand hooks */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
