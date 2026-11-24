// Chức năng của file này là định dạng dữ liệu, ví dụ như định dạng kích thước tệp và phân tích các chuỗi được phân tách bằng dấu phẩy.
export function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function parseCommaTokens(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
