/**
 * Định nghĩa màu sắc, nhãn tiếng Việt cho các trạng thái nghiệp vụ.
 * Tuân thủ chuẩn DESIGN_SYSTEM.md Mục 3.7:
 * Luôn kèm chữ hoặc icon, không chỉ dựa vào màu sắc.
 */

export interface StatusConfig {
  label: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "clay";
}

/** Trạng thái đơn ứng tuyển (applications.current_status) */
export const APPLICATION_STATUS: Record<string, StatusConfig> = {
  APPLIED: { label: "Đã nộp", variant: "info" },
  REVIEWING: { label: "Đang xem xét", variant: "warning" },
  SHORTLISTED: { label: "Vào vòng sàng lọc", variant: "brand" },
  INTERVIEW: { label: "Phỏng vấn", variant: "brand" },
  OFFER: { label: "Nhận đề nghị", variant: "clay" },
  HIRED: { label: "Trúng tuyển", variant: "success" },
  REJECTED: { label: "Không đạt", variant: "danger" },
  WITHDRAWN: { label: "Đã rút", variant: "neutral" },
};

/** Trạng thái xác thực doanh nghiệp (companies.verification_status) */
export const COMPANY_STATUS: Record<string, StatusConfig> = {
  PENDING: { label: "Chờ thẩm định", variant: "warning" },
  APPROVED: { label: "Đã xác thực", variant: "success" },
  REJECTED: { label: "Bị từ chối", variant: "danger" },
  SUSPENDED: { label: "Tạm ngừng", variant: "neutral" },
};

/** Trạng thái tin tuyển dụng (jobs.status) */
export const JOB_STATUS: Record<string, StatusConfig> = {
  DRAFT: { label: "Bản nháp", variant: "neutral" },
  PENDING_APPROVAL: { label: "Chờ duyệt", variant: "warning" },
  PUBLISHED: { label: "Đang tuyển", variant: "success" },
  REJECTED: { label: "Bị từ chối", variant: "danger" },
  CLOSED: { label: "Đã đóng", variant: "neutral" },
};

/** Trạng thái nhiệm vụ CRM (crm_follow_ups.status) */
export const CRM_STATUS: Record<string, StatusConfig> = {
  TODO: { label: "Cần làm", variant: "info" },
  IN_PROGRESS: { label: "Đang thực hiện", variant: "brand" },
  DONE: { label: "Hoàn thành", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "neutral" },
  OVERDUE: { label: "Quá hạn", variant: "danger" },
};

/** Trạng thái tài khoản người dùng (users.status) */
export const USER_STATUS: Record<string, StatusConfig> = {
  ACTIVE: { label: "Hoạt động", variant: "success" },
  LOCKED: { label: "Đã khóa", variant: "danger" },
  INACTIVE: { label: "Ngừng hoạt động", variant: "neutral" },
};
