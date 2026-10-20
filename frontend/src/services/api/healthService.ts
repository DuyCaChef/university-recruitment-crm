import { axiosClient } from "./axiosClient";

// Định nghĩa kiểu dữ liệu phản hồi từ Backend NestJS
export interface HealthCheckResponse {
  status: string;
  database: string;
  timestamp: string;
}

export const healthService = {
  // Gọi API kiểm tra sức khỏe hệ thống
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return await axiosClient.get("/health");
  },

  // Gọi endpoint bảo vệ để kích hoạt lỗi 401 Unauthorized
  triggerUnauthorizedTest: async (): Promise<void> => {
    await axiosClient.get("/users/me");
  },
};
