/**
 * Định nghĩa cấu trúc dữ liệu lưu trong payload của Access Token
 * Payload này được mã hóa Base64URL trong chuỗi JWT và có thể giải mã ở Client/Guards
 */
export interface JwtPayload {
  sub: string; // Subject: Mã định danh User ID (UUID)
  email: string; // Địa chỉ email đăng nhập
  roles: string[]; // Danh sách mã vai trò: ['STUDENT'], ['EMPLOYER'],...
  permissions: string[]; // Danh mục quyền hạn: ['JOB_CREATE', 'COMPANY_APPROVE']
  mustChangePassword?: boolean; // Cờ ép buộc đổi mật khẩu ở lần đăng nhập đầu (BR-AUTH-15)
}

/**
 * Payload tối giản cho Refresh Token (chỉ cần định danh người dùng)
 */
export interface JwtRefreshPayload {
  sub: string;
}
