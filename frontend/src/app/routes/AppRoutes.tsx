import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CareerCenterLayout } from "@/components/layout/CareerCenterLayout";

// Pages
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import LoginPage from "@/pages/auth/LoginPage";
import StudentJobsPage from "@/pages/student/StudentJobsPage";
import EmployerPipelinePage from "@/pages/employer/EmployerPipelinePage";
import CareerCenterCrmPage from "@/pages/career-center/CareerCenterCrmPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định về /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 1. Nhánh Xác thực */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
        </Route>

        {/* Tiếp nhận chuyển hướng Google SSO */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* 2. Nhánh Sinh viên: Top Navbar */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/jobs" replace />} />
          <Route path="jobs" element={<StudentJobsPage />} />
          <Route path="saved-jobs" element={<StudentJobsPage />} />
          <Route path="profile" element={<StudentJobsPage />} />
          <Route path="applications" element={<StudentJobsPage />} />
        </Route>

        {/* 3. Nhánh Nhà tuyển dụng: Sidebar tối */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route
            index
            element={<Navigate to="/employer/dashboard" replace />}
          />
          <Route path="dashboard" element={<EmployerPipelinePage />} />
          <Route path="jobs" element={<EmployerPipelinePage />} />
          <Route path="pipeline" element={<EmployerPipelinePage />} />
          <Route path="interviews" element={<EmployerPipelinePage />} />
          <Route path="profile" element={<EmployerPipelinePage />} />
        </Route>

        {/* 4. Nhánh Cán bộ Hướng nghiệp: Sidebar AGU Blue */}
        <Route path="/career-center" element={<CareerCenterLayout />}>
          <Route
            index
            element={<Navigate to="/career-center/dashboard" replace />}
          />
          <Route path="dashboard" element={<CareerCenterCrmPage />} />
          <Route path="companies" element={<CareerCenterCrmPage />} />
          <Route path="approvals/*" element={<CareerCenterCrmPage />} />
          <Route path="crm/*" element={<CareerCenterCrmPage />} />
          <Route path="reports" element={<CareerCenterCrmPage />} />
        </Route>

        {/* Trang 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
