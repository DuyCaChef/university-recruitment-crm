/**
 * Định dạng và chuẩn hóa ngày giờ chuẩn theo quy ước DESIGN_SYSTEM.md Mục 12:
 * - Hiển thị ngày: dd/MM/yyyy, giờ: HH:mm, tháng/năm: MM/yyyy
 * - Giá trị ô nhập <input type="date">: YYYY-MM-DD
 */

export function formatDate(date: string | number | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: string | number | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(d)} ${hours}:${minutes}`;
}

export function getTodayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value;
}

export function formatMonthYear(value: string | null): string {
  if (!value) return "Hiện tại";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${year}`;
}
