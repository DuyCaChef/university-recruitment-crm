/**
 * Định dạng tiền tệ chuẩn theo quy ước DESIGN_SYSTEM.md Mục 12:
 * Ví dụ: 1.000.000 ₫
 */

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "0 ₫";
  return `${amount.toLocaleString("vi-VN")} ₫`;
}
