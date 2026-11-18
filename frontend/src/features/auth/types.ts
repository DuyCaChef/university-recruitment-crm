/** Payload JWT giải mã cơ bản */
export interface JwtPayload {
  sub: string;
  email: string;
  role: "STUDENT" | "EMPLOYER" | "CAREER_CENTER" | "SYSTEM_ADMIN";
  iat: number;
  exp: number;
}

/** Request đăng nhập mật khẩu nội bộ */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response đăng nhập thành công */
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "STUDENT" | "EMPLOYER" | "CAREER_CENTER" | "SYSTEM_ADMIN";
    mustChangePassword: boolean;
  };
}
