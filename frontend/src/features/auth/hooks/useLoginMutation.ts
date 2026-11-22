// src/features/auth/hooks/useLoginMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginWithCredentials, authKeys } from "../api/authApi";
import { getDefaultRouteByRole } from "../utils/authSession";
import type {
  LoginRequestPayload,
  LoginResponseData,
} from "../types";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponseData, Error, LoginRequestPayload>({
    mutationFn: loginWithCredentials,
    onSuccess: (data) => {
      // 1. Lưu Access Token phục vụ Request Interceptor
      localStorage.setItem("access_token", data.accessToken);

      // 2. Xác định cờ bắt buộc đổi mật khẩu lần đầu
      const mustChange = Boolean(
        data.mustChangePassword || data.user.mustChangePassword,
      );

      const userWithState = {
        ...data.user,
        mustChangePassword: mustChange,
      };

      // Lưu thông tin người dùng vào localStorage để duy trì trạng thái phiên và Router Guard
      localStorage.setItem("user_info", JSON.stringify(userWithState));

      // 3. Cập nhật cache thông tin người dùng hiện tại
      queryClient.setQueryData(authKeys.currentUser(), userWithState);

      // 4. Khóa điều hướng: Đẩy sang /change-password bên trong FocusLayout nếu mustChangePassword == true
      if (mustChange && !data.user.roles.includes("STUDENT")) {
        navigate("/change-password", { replace: true });
        return;
      }

      // 5. Điều hướng vào không gian làm việc tương ứng với Role (AppLayout)
      const targetRoute = getDefaultRouteByRole(data.user.roles);
      navigate(targetRoute, { replace: true });
    },
  });
};
