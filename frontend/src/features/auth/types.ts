// src/features/auth/types.ts

// ============================================================================
// 1. ENUMS & HẰNG SỐ ĐỊNH DANH (KHỚP PRISMA SCHEMA & SEED RBAC)
// ============================================================================

/** Trạng thái tài khoản hệ thống (users.status) */
export type UserStatus = "ACTIVE" | "LOCKED" | "INACTIVE";

/** Alias tương thích cho các module mở rộng */
export type UserAccountStatus = UserStatus;

/** Mã 4 vai trò chuẩn theo ma trận RBAC (roles.code) */
export type RoleCode = "STUDENT" | "EMPLOYER" | "CAREER_CENTER" | "ADMIN";

/** Alias tương thích cho các hook và helper đang dùng UserRole */
export type UserRole = RoleCode | "SYSTEM_ADMIN";

/** Alias tương thích cho AccountStatus */
export type AccountStatus = UserStatus;

/** Trạng thái thẩm định pháp nhân doanh nghiệp (companies.verification_status - Module 04) */
export type CompanyVerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

/** Trạng thái quan hệ đối tác CRM (companies.relationship_status - Database Spec 3.13) */
export type CompanyRelationshipStatus =
  | "NEW"
  | "POTENTIAL"
  | "ACTIVE_PARTNER"
  | "STRATEGIC"
  | "INACTIVE";

// ============================================================================
// 2. CHUẨN ĐỊNH DẠNG REQUEST / RESPONSE CHUNG TỪ NESTJS BACKEND
// ============================================================================

/** Khung phản hồi thành công chuẩn từ Backend */
export interface ApiSuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/** Khung phản hồi lỗi chuẩn từ Global HttpExceptionFilter */
export interface ApiErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  errorCode?: string;
  timestamp?: string;
  path?: string;
}

// ============================================================================
// 3. KIỂU DỮ LIỆU XÁC THỰC & PHIÊN LÀM VIỆC (MODULE 01)
// ============================================================================

/** Thông tin người dùng hiện tại gắn trong phiên đăng nhập */
export interface AuthUser {
  id: string;
  email: string;
  roles: RoleCode[];
  permissions: string[];
  status?: UserStatus;
  mustChangePassword?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

/** Dữ liệu hồ sơ tài khoản trả về từ GET /auth/me */
export interface CurrentUserProfile {
  id: string;
  email: string;
  status: UserStatus;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

/** Payload gửi lên POST /auth/login */
export interface LoginRequestPayload {
  email: string;
  password: string;
}

/** Alias giữ tương thích nếu authApi.ts hoặc CredentialsLoginForm.tsx đang import tên cũ */
export type LoginPayload = LoginRequestPayload;
export type LoginRequest = LoginRequestPayload;

/** Dữ liệu trả về trong field `data` của POST /auth/login */
export interface LoginResponseData {
  accessToken: string;
  mustChangePassword: boolean;
  user: AuthUser;
}

/** Payload gửi lên PATCH /auth/password (Đổi mật khẩu) */
export interface ChangePasswordRequestPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Alias giữ tương thích cho form đổi mật khẩu */
export type ChangePasswordPayload = ChangePasswordRequestPayload;

// ============================================================================
// 4. KIỂU DỮ LIỆU ĐĂNG KÝ DOANH NGHIỆP BAN ĐẦU (MODULE 01 & MODULE 04)
// ============================================================================

/** Payload 13 trường phẳng gửi lên POST /auth/company/register */
export interface CompanyRegisterRequestPayload {
  // Nhóm 1: Thông tin tài khoản đăng nhập (Module 01)
  email: string;
  password: string;
  confirmPassword: string;

  // Nhóm 2: Thông tin pháp nhân doanh nghiệp (Module 04)
  name: string;
  companyEmail: string;
  taxCode?: string;
  companyPhone?: string;
  website?: string;
  address?: string;
  description?: string;

  // Nhóm 3: Thông tin người đại diện chính - Primary Contact (Module 04 & 05)
  fullName: string;
  representativePhone?: string;
  position?: string;
}

/** Dữ liệu trả về sau khi khởi tạo nguyên tử User + Company + Primary Contact */
export interface CompanyRegisterResponseData {
  user: {
    id: string;
    email: string;
    status: UserStatus;
  };
  company: {
    id: string;
    name: string;
    email: string;
    taxCode?: string | null;
    verificationStatus: CompanyVerificationStatus;
    relationshipStatus: CompanyRelationshipStatus;
  };
  contact: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    position?: string | null;
    isPrimary: boolean;
  };
}