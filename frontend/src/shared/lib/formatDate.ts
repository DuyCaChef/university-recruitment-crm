/**
 * Định dạng ngày giờ chuẩn theo quy ước DESIGN_SYSTEM.md Mục 12:
 * Ngày theo định dạng dd/MM/yyyy, giờ HH:mm
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
