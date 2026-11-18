import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// 1. Khởi tạo Axios Instance cấu hình sẵn
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // Cho phép gửi và nhận Cookie bảo mật (HttpOnly Cookie cho Refresh Token)
  withCredentials: true,
  timeout: 15000, // Timeout 15 giây
});

// 2. Request Interceptor: Tự động gắn token (nếu có lưu trong bộ nhớ client)
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor: Xử lý dữ liệu trả về và bắt mã lỗi 401 toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp dữ liệu body từ server
    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response ? error.response.status : null;

    // Tiêu chí nghiệm thu TASK-S1-10: Bắt mã 401 Unauthorized xóa phiên và redirect
    if (status === 401) {
      // 1. Dọn sạch thông tin phiên lưu trữ tại Client
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");

      // 2. Kiểm tra nếu không phải đang ở trang login thì mới chuyển hướng
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        console.warn(
          "Phiên làm việc đã hết hạn hoặc không hợp lệ. Đang chuyển hướng về /login...",
        );
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
