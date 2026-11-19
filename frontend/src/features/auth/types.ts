// src/features/auth/types.ts
export type UserRole =
  | "STUDENT"
  | "EMPLOYER"
  | "CAREER_CENTER"
  | "SYSTEM_ADMIN";

export type AccountStatus = "ACTIVE" | "LOCKED" | "INACTIVE";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  roles: UserRole[];
  permissions: string[];
  status?: AccountStatus;
  mustChangePassword?: boolean;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
  mustChangePassword?: boolean;
}

export interface ApiErrorPayload {
  statusCode: number;
  errorCode?: string;
  message: string;
}
