/** Wrapper chuẩn cho mọi response từ API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

/** Wrapper cho response có phân trang */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Vai trò người dùng trong hệ thống */
export type UserRole =
  | "STUDENT"
  | "EMPLOYER"
  | "CAREER_CENTER"
  | "SYSTEM_ADMIN";

/** Thông tin người dùng cơ bản sau đăng nhập */
export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  mustChangePassword: boolean;
}
