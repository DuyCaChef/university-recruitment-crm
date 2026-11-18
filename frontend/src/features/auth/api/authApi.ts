import { axiosClient } from "@/shared/api/axiosClient";
import type { LoginRequest, LoginResponse } from "@/features/auth/types";

/**
 * Các hàm gọi Auth API.
 * Mọi call đi qua axiosClient — interceptor tự gắn Bearer token.
 */
export const authApi = {
  /**
   * Đăng nhập mật khẩu nội bộ (EMPLOYER / CAREER_CENTER / SYSTEM_ADMIN).
   * STUDENT KHÔNG dùng endpoint này — chỉ dùng Google SSO.
   */
  loginWithPassword: (body: LoginRequest): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", body),

  /** Lấy URL Google OAuth để redirect sinh viên */
  getGoogleAuthUrl: (): string =>
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"}/auth/google`,

  /** Đăng xuất — xóa refresh token cookie */
  logout: (): Promise<void> =>
    axiosClient.post("/auth/logout"),
};
