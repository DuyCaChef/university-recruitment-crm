import { useState, useEffect } from "react";

/**
 * Hook làm trễ giá trị cập nhật — dùng cho ô tìm kiếm và bộ lọc (DESIGN_SYSTEM.md 9.1)
 * Mặc định delay 300ms.
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
