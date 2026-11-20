/** Ánh xạ mã lỗi API sang thông báo tiếng Việt — DESIGN_SYSTEM.md 8.7 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Lỗi xác thực & phiên làm việc (Module 01)
  INVALID_CREDENTIALS:
    "Thông tin email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  ACCOUNT_LOCKED:
    "Tài khoản đã bị khóa. Vui lòng liên hệ Trung tâm Hướng nghiệp & HTSV để được hỗ trợ.",
  ACCOUNT_INACTIVE:
    "Tài khoản hiện không còn hoạt động. Vui lòng liên hệ bộ phận quản trị để kích hoạt lại.",
  PASSWORD_CHANGE_REQUIRED:
    "Bạn cần đặt mật khẩu mới trước khi sử dụng hệ thống.",
  TOO_MANY_REQUESTS:
    "Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng đợi ít phút rồi thử lại.",

  // Lỗi Google SSO Sinh viên AGU
  SSO_DOMAIN_FORBIDDEN:
    "Chỉ chấp nhận tài khoản email sinh viên Trường Đại học An Giang (@student.agu.edu.vn).",
  STUDENT_MASTER_NOT_FOUND:
    "Email sinh viên hợp lệ nhưng chưa có trong danh sách đào tạo được cấp quyền truy cập hệ thống.",

  // Trạng thái thẩm định Doanh nghiệp
  COMPANY_PENDING:
    "Hồ sơ doanh nghiệp đang chờ thẩm định. Vui lòng đợi Career Center xác nhận.",
  COMPANY_REJECTED:
    "Hồ sơ doanh nghiệp bị từ chối. Vui lòng xem lý do và gửi lại.",

  // Lỗi HTTP & Hệ thống dùng chung
  UNAUTHORIZED: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  NETWORK_ERROR:
    "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
  DEFAULT: "Đã xảy ra lỗi kết nối máy chủ. Vui lòng thử lại sau ít phút.",
  UNKNOWN:
    "Đã xảy ra lỗi không xác định. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
};

export const UI_LABELS = {
  APP_UNIVERSITY_PARENT: "ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH",
  APP_UNIVERSITY_NAME: "TRƯỜNG ĐẠI HỌC AN GIANG",
  APP_PORTAL_SUBTITLE: "Cổng thông tin Việc làm & Kết nối Doanh nghiệp",
  SSO_SECTION_LABEL: "ĐĂNG NHẬP QUA:",
  SSO_BUTTON_TEXT: "Đăng Nhập bằng GMail AGU",
  SSO_HELPER_TEXT: "Dành cho Sinh viên sử dụng tài khoản @student.agu.edu.vn",
  CREDENTIALS_SECTION_LABEL: "ĐĂNG NHẬP BẰNG TÀI KHOẢN:",
  CREDENTIALS_HELPER_TEXT:
    "Dành cho Doanh nghiệp, Cán bộ Career Center & Quản trị viên",
} as const;

export function getErrorMessage(code?: string, fallback?: string): string {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return fallback || ERROR_MESSAGES.UNKNOWN;
}
