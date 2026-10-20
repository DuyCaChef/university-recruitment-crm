import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Khởi tạo QueryClient với các cấu hình tối ưu cho hệ thống CRM
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dữ liệu được coi là tươi mới trong 1 phút (không fetch lại liên tục khi render)
      staleTime: 60 * 1000,
      // Thời gian lưu cache trong bộ nhớ khi không có component nào dùng: 5 phút
      gcTime: 5 * 60 * 1000,
      // Số lần thử lại tối đa khi API gặp lỗi mạng
      retry: 1,
      // Không tự động fetch lại khi người dùng chuyển tab (tránh quá tải server CRM)
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
