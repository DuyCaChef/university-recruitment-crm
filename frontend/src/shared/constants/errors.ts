/** Ánh xạ mã lỗi API sang thông báo tiếng Việt — DESIGN_SYSTEM.md 8.7 */
export const ERROR_MESSAGES: Record<string, string> = {
  ACCOUNT_LOCKED:
    "Tài khoản đã bị khóa. Vui lòng liên hệ Trung tâm Hướng nghiệp & HTSV để được hỗ trợ.",
  PASSWORD_CHANGE_REQUIRED:
    "Bạn cần đặt mật khẩu mới trước khi sử dụng hệ thống.",
  INVALID_CREDENTIALS:
    "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
  COMPANY_PENDING:
    "Hồ sơ doanh nghiệp đang chờ thẩm định. Vui lòng đợi Career Center xác nhận.",
  COMPANY_REJECTED:
    "Hồ sơ doanh nghiệp bị từ chối. Vui lòng xem lý do và gửi lại.",
  UNAUTHORIZED:
    "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN:
    "Bạn không có quyền thực hiện thao tác này.",
  NETWORK_ERROR:
    "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
  UNKNOWN:
    "Đã xảy ra lỗi không xác định. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN;
}
