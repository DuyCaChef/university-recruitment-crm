import { axiosClient } from "@/shared/api/axiosClient";

// Định nghĩa kiểu dữ liệu phản hồi từ Backend NestJS
export interface HealthCheckResponse {
  status: string;
  database: string;
  timestamp: string;
}

export const healthService = {
  // Gọi API kiểm tra sức khỏe hệ thống
  checkHealth: async (): Promise<HealthCheckResponse> => {
    const response =
      await axiosClient.get<HealthCheckResponse>("/health");
    return response.data;
  },

  // Gọi endpoint bảo vệ để kích hoạt lỗi 401 Unauthorized
  triggerUnauthorizedTest: async (): Promise<void> => {
    await axiosClient.get("/users/me");
  },
};
