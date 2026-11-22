// src/features/auth/components/AuthGuards.tsx
import { type ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredUser, getDefaultRouteByRole } from "../utils/authSession";

/**
 * Router Guard bảo vệ không gian làm việc chính (AppLayout)
 * 1. Chặn người dùng chưa đăng nhập -> Đẩy về /login.
 * 2. Khóa điều hướng người dùng có phiên hạn chế (must_change_password == true)
 *    -> Nếu cố tình sửa URL trên thanh địa chỉ sang trang khác, lập tức đẩy ngược về /change-password.
 */
export const ProtectedWorkspaceGuard = (): ReactElement => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const user = getStoredUser();

  // 1. Chưa đăng nhập -> về trang Login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra cờ bắt buộc đổi mật khẩu (chỉ áp dụng cho non-STUDENT)
  const isStudent = user?.roles?.includes("STUDENT");
  const mustChangePassword = Boolean(user?.mustChangePassword);

  if (mustChangePassword && !isStudent) {
    // Đẩy ngược về /change-password nếu người dùng cố truy cập các trang nghiệp vụ
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
};

/**
 * Router Guard bảo vệ trang Đổi mật khẩu bắt buộc (FocusLayout)
 * 1. Chưa đăng nhập -> Đẩy về /login.
 * 2. Sinh viên (STUDENT) không bao giờ hiển thị FocusLayout -> Đẩy về /student/jobs.
 * 3. Nếu tài khoản đã hoàn tất đổi mật khẩu (must_change_password == false)
 *    -> Đẩy vào không gian làm việc chính theo vai trò.
 */
export const FocusLayoutGuard = (): ReactElement => {
  const token = localStorage.getItem("access_token");
  const user = getStoredUser();

  // 1. Chưa đăng nhập -> về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Sinh viên không áp dụng FocusLayout (DESIGN_SYSTEM.md 7.1 & 10.3)
  if (user?.roles?.includes("STUDENT")) {
    return <Navigate to="/student/jobs" replace />;
  }

  // 3. Nếu không bị cờ mustChangePassword -> về không gian làm việc chính
  if (user && user.mustChangePassword === false) {
    const targetRoute = getDefaultRouteByRole(user.roles);
    return <Navigate to={targetRoute} replace />;
  }

  return <Outlet />;
};
