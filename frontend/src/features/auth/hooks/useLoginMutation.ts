// src/features/auth/hooks/useLoginMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginWithCredentials, authKeys } from "../api/authApi";
import type {
  LoginRequestPayload,
  LoginResponseData,
  UserRole,
} from "../types";

const getDefaultRouteByRole = (roles: UserRole[]): string => {
  if (roles.includes("CAREER_CENTER")) return "/career-center/dashboard";
  if (roles.includes("EMPLOYER")) return "/employer/jobs";
  if (roles.includes("SYSTEM_ADMIN")) return "/admin/users";
  return "/student/jobs";
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponseData, Error, LoginRequestPayload>({
    mutationFn: loginWithCredentials,
    onSuccess: (data) => {
      // 1. Lưu Access Token phục vụ Request Interceptor
      localStorage.setItem("access_token", data.accessToken);

      // 2. Cập nhật cache thông tin người dùng hiện tại
      queryClient.setQueryData(authKeys.currentUser(), data.user);

      // 3. Kiểm tra cờ bắt buộc đổi mật khẩu lần đầu (chỉ áp dụng cho non-STUDENT)
      const mustChange = Boolean(
        data.mustChangePassword || data.user.mustChangePassword,
      );
      if (mustChange && !data.user.roles.includes("STUDENT")) {
        navigate("/change-password", { replace: true });
        return;
      }

      // 4. Điều hướng vào không gian làm việc tương ứng với Role
      const targetRoute = getDefaultRouteByRole(data.user.roles);
      navigate(targetRoute, { replace: true });
    },
  });
};
