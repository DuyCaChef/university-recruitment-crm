// src/shared/hooks/useTheme.ts
import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

/**
 * Đọc trạng thái theme hiện tại từ DOM attribute [data-theme]
 */
function getThemeSnapshot(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/**
 * Đăng ký lắng nghe sự kiện thay đổi [data-theme] thông qua MutationObserver
 * và storage event (đồng bộ giữa các tab)
 */
function subscribeToTheme(callback: () => void): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  // 1. MutationObserver theo dõi sự thay đổi thuộc tính data-theme trên <html>
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        callback();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // 2. Đồng bộ trạng thái khi mở nhiều tab trình duyệt
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === "theme") {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Hook dùng chung quản lý và lắng nghe theme (Sáng / Tối)
 * Tuân thủ React 19 useSyncExternalStore, chống render xếp tầng (cascading renders)
 */
export function useTheme(): {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
} {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light",
  );

  const setTheme = (nextTheme: ThemeMode): void => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // bỏ qua lỗi nếu localStorage bị chặn
    }
  };

  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggleTheme,
  };
}
