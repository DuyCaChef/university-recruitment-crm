import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Mở rộng kiểu config của Axios để gắn cờ chống lặp vô hạn trên từng request
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// 1. Khởi tạo Axios Instance cấu hình sẵn
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Cho phép gửi và nhận Cookie bảo mật (HttpOnly Cookie cho Refresh Token)
  withCredentials: true,
  timeout: 15000, // Timeout 15 giây
});

// Biến điều phối trạng thái Silent Refresh và hàng đợi các request đến đồng thời
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

/**
 * Giải phóng toàn bộ hàng đợi request đang chờ token mới
 */
const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Dọn sạch phiên lưu trữ tại Client và điều hướng về trang đăng nhập
 */
const clearSessionAndRedirect = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");

  const currentPath = window.location.pathname;
  if (currentPath !== "/login") {
    console.warn(
      "Phiên làm việc đã hết hạn hoàn toàn. Đang chuyển hướng về /login...",
    );
    window.location.href = "/login";
  }
};

// 2. Request Interceptor: Tự động gắn Access Token vào Header
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

// 3. Response Interceptor: Tự động Silent Refresh khi gặp 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp dữ liệu body từ server
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response ? error.response.status : null;

    // Bỏ qua nếu không phải lỗi 401 hoặc không có cấu hình request gốc
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // 1. Tránh vòng lặp vô hạn: Không kích hoạt refresh nếu chính API login hoặc refresh bị 401
    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh")
    ) {
      if (requestUrl.includes("/auth/refresh")) {
        clearSessionAndRedirect();
      }
      return Promise.reject(error);
    }

    // Nếu request này đã từng được retry 1 lần mà vẫn 401 -> Thu hồi phiên & chuyển về /login
    if (originalRequest._retry) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    // 2. Xử lý đồng thời (Concurrent Request Queue):
    // Nếu đang có 1 tiến trình gọi /auth/refresh chạy rồi -> Đưa request này vào hàng đợi
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosClient(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    // Đánh dấu request đầu tiên gặp 401 sẽ chịu trách nhiệm gọi /auth/refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Dùng axios gốc (không qua axiosClient) để gọi /auth/refresh kèm HttpOnly Cookie
      const refreshResponse = await axios.post<{
        statusCode: number;
        message: string;
        data: { accessToken: string };
      }>(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

      const newAccessToken = refreshResponse.data.data.accessToken;

      // Lưu Access Token mới vào localStorage
      localStorage.setItem("access_token", newAccessToken);

      // Giải phóng toàn bộ các request đang xếp hàng với token mới
      processQueue(null, newAccessToken);

      // Cập nhật header và thực thi lại request gốc đầu tiên
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return axiosClient(originalRequest);
    } catch (refreshError) {
      // 3. Fallback: Refresh Token cũng đã hết hạn (7 ngày) hoặc tài khoản bị khóa
      processQueue(refreshError, null);
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
