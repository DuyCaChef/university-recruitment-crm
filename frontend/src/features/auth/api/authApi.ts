// src/features/auth/api/authApi.ts
import { axiosClient } from "@/shared/api/axiosClient";
import type { ApiResponse, CurrentUser } from "@/shared/types/common.types";
import type { LoginRequestPayload, LoginResponseData } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
};

/**
 * Đăng nhập bằng Email & Mật khẩu nội bộ
 * Áp dụng cho: EMPLOYER, CAREER_CENTER, SYSTEM_ADMIN
 */
export const loginWithCredentials = async (
  payload: LoginRequestPayload,
): Promise<LoginResponseData> => {
  const response = await axiosClient.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  );
  return response.data.data;
};

/**
 * Lấy đường dẫn kích hoạt luồng Google SSO (OIDC + JIT Provisioning)
 * Áp dụng riêng cho: STUDENT (@student.agu.edu.vn)
 */
export const getAguGoogleSsoUrl = (): string => {
  return `${API_BASE_URL}/auth/google`;
};

/**
 * Nạp ngữ cảnh người dùng sau khi hoàn tất Google SSO.
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await axiosClient.get<ApiResponse<CurrentUser>>(
    "/auth/current-user",
  );
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await axiosClient.post<ApiResponse<null>>("/auth/logout");
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  await axiosClient.post<ApiResponse<null>>(
    "/auth/change-password",
    payload,
  );
};
