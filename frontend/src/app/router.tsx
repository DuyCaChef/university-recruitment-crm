// src/app/router.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FocusLayout } from "@/layouts/FocusLayout";
import {
  ProtectedWorkspaceGuard,
  FocusLayoutGuard,
} from "@/features/auth/components/AuthGuards";

/* ── Lazy-loaded pages ──────────────────────────── */
const LoginPage              = lazy(() => import("@/features/auth/pages/LoginPage"));
const CompanyRegisterPage    = lazy(() => import("@/features/auth/pages/CompanyRegisterPage"));
const AuthCallbackPage       = lazy(() => import("@/features/auth/pages/AuthCallbackPage"));
const UnauthorizedPage       = lazy(() => import("@/features/auth/pages/UnauthorizedPage"));
const ForbiddenPage          = lazy(() => import("@/features/auth/pages/ForbiddenPage"));
const ChangePasswordPage     = lazy(() => import("@/features/auth/pages/ChangePasswordPage"));
const StudentJobsPage        = lazy(() => import("@/features/students/pages/StudentJobsPage"));
const StudentProfilePage     = lazy(() => import("@/features/students/pages/StudentProfilePage"));
const EmployerPipelinePage   = lazy(() => import("@/features/pipeline/pages/EmployerPipelinePage"));
const CareerCenterCrmPage    = lazy(() => import("@/features/crm/pages/CareerCenterCrmPage"));
const CareerProfilesPage     = lazy(() => import("@/features/career-profiles/pages/CareerProfilesPage"));
const NotFoundPage           = lazy(() => import("@/pages/NotFoundPage"));

/* ── Page loading fallback ──────────────────────── */
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-pill border-4 border-line border-t-brand-600"
        aria-label="Đang tải..."
      />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Điều hướng mặc định về /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes — AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<CompanyRegisterPage />} />
          </Route>

          {/* Google SSO callback & Error pages */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/unauthorized"  element={<UnauthorizedPage />} />
          <Route path="/forbidden"     element={<ForbiddenPage />} />

          {/* FocusLayout: Đổi mật khẩu bắt buộc & phiên bảo mật hạn chế (Restricted Session) */}
          <Route element={<FocusLayoutGuard />}>
            <Route element={<FocusLayout />}>
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route
                path="/pending-approval"
                element={
                  <div className="flex flex-col items-center gap-3 text-center py-4">
                    <span className="text-h3 font-bold text-ink">
                      Tài khoản đang chờ duyệt
                    </span>
                    <p className="text-small text-ink-2">
                      Hồ sơ của bạn đang được cán bộ Career Center thẩm định.
                    </p>
                  </div>
                }
              />
            </Route>
          </Route>

          {/* Không gian làm việc được bảo vệ (Router Guard đẩy ngược về /change-password nếu mustChangePassword == true) */}
          <Route element={<ProtectedWorkspaceGuard />}>
            {/* Student — AppLayout role=STUDENT */}
            <Route element={<AppLayout role="STUDENT" userName="Sinh viên AGU" />}>
              <Route path="/student" element={<Navigate to="/student/jobs" replace />} />
              <Route path="/student/jobs"          element={<StudentJobsPage />} />
              <Route path="/student/saved-jobs"    element={<StudentJobsPage />} />
              <Route path="/student/profile"       element={<StudentProfilePage />} />
              <Route path="/student/applications"  element={<StudentJobsPage />} />
              <Route path="/student/interviews"    element={<StudentJobsPage />} />
              <Route path="/student/notifications" element={<StudentJobsPage />} />
            </Route>

            {/* Employer — AppLayout role=EMPLOYER */}
            <Route element={<AppLayout role="EMPLOYER" userName="Nhà Tuyển Dụng" />}>
              <Route path="/employer" element={<Navigate to="/employer/jobs" replace />} />
              <Route path="/employer/dashboard"     element={<EmployerPipelinePage />} />
              <Route path="/employer/jobs"          element={<EmployerPipelinePage />} />
              <Route path="/employer/pipeline"      element={<EmployerPipelinePage />} />
              <Route path="/employer/candidates"    element={<CareerProfilesPage />} />
              <Route path="/employer/interviews"    element={<EmployerPipelinePage />} />
              <Route path="/employer/profile"       element={<EmployerPipelinePage />} />
              <Route path="/employer/notifications" element={<EmployerPipelinePage />} />
            </Route>

            {/* Career Center — AppLayout role=CAREER_CENTER */}
            <Route element={<AppLayout role="CAREER_CENTER" userName="Cán bộ Hướng nghiệp" />}>
              <Route path="/career-center" element={<Navigate to="/career-center/approvals/companies" replace />} />
              <Route path="/career-center/dashboard"           element={<CareerCenterCrmPage />} />
              <Route path="/career-center/approvals/companies" element={<CareerCenterCrmPage />} />
              <Route path="/career-center/approvals/jobs"      element={<CareerCenterCrmPage />} />
              <Route path="/career-center/crm/*"               element={<CareerCenterCrmPage />} />
              <Route path="/career-center/students"            element={<CareerProfilesPage />} />
              <Route path="/career-center/events"              element={<CareerCenterCrmPage />} />
              <Route path="/career-center/reports"             element={<CareerCenterCrmPage />} />
            </Route>

            {/* System Admin — AppLayout role=SYSTEM_ADMIN */}
            <Route element={<AppLayout role="SYSTEM_ADMIN" userName="Quản trị viên" />}>
              <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
              <Route
                path="/admin/users"
                element={
                  <div className="rounded-card bg-surface p-6 text-ink shadow-sm border border-line">
                    Quản lý người dùng
                  </div>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <div className="rounded-card bg-surface p-6 text-ink shadow-sm border border-line">
                    Phân quyền
                  </div>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <div className="rounded-card bg-surface p-6 text-ink shadow-sm border border-line">
                    Nhật ký kiểm toán
                  </div>
                }
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
