// src/features/auth/api/authApi.ts
import { axiosClient } from "@/shared/api/axiosClient";
import type { ApiResponse, CurrentUser } from "@/shared/types/common.types";
import type {
  LoginRequestPayload,
  LoginResponseData,
  CompanyRegisterRequestPayload,
  CompanyRegisterResponseData,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
  companyRegistration: () => [...authKeys.all, "company-registration"] as const,
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

/**
 * Đăng ký tài khoản Doanh nghiệp ban đầu (Atomic Transaction - FR-AUTH-04 / FR-CVR-01)
 * Endpoint: POST /api/v1/auth/company/register
 * Tạo đồng thời: User (EMPLOYER) + Company (verification_status = PENDING) + Company Contact (is_primary = true)
 */
export const registerCompany = async (
  payload: CompanyRegisterRequestPayload,
): Promise<CompanyRegisterResponseData> => {
  const normalizedWebsite = payload.website?.trim()
    ? /^https?:\/\//i.test(payload.website.trim())
      ? payload.website.trim()
      : `https://${payload.website.trim()}`
    : undefined;

  const cleanPayload: CompanyRegisterRequestPayload = {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    name: payload.name.trim(),
    companyEmail: payload.companyEmail.trim().toLowerCase(),
    taxCode: payload.taxCode?.replace(/\s+/g, "") || undefined,
    companyPhone: payload.companyPhone?.replace(/[\s.-]/g, "") || undefined,
    website: normalizedWebsite,
    address: payload.address?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    fullName: payload.fullName.trim(),
    representativePhone:
      payload.representativePhone?.replace(/[\s.-]/g, "") || undefined,
    position: payload.position?.trim() || undefined,
  };

  // Interceptor trong axiosClient đã trả về response.data tại runtime
  const rawResponse: unknown = await axiosClient.post(
    "/auth/company/register",
    cleanPayload,
  );

  // Trường hợp Backend bọc dữ liệu trong envelope { statusCode, message, data: { user, company, contact } }
  if (
    rawResponse !== null &&
    typeof rawResponse === "object" &&
    "data" in rawResponse &&
    rawResponse.data !== null &&
    typeof rawResponse.data === "object" &&
    "company" in rawResponse.data
  ) {
    return rawResponse.data as CompanyRegisterResponseData;
  }

  // Trường hợp Backend trả trực tiếp { user, company, contact }
  return rawResponse as CompanyRegisterResponseData;
};