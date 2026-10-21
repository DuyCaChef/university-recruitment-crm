import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CareerCenterLayout } from "@/components/layout/CareerCenterLayout";

import { LoginPage } from "@/pages/auth/LoginPage";
import { StudentJobsPage } from "@/pages/student/StudentJobsPage";
import { EmployerPipelinePage } from "@/pages/employer/EmployerPipelinePage";
import { CareerCenterCrmPage } from "@/pages/career-center/CareerCenterCrmPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định về /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 1. Nhánh Auth: Đăng nhập & Đăng ký */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
        </Route>

        {/* 2. Nhánh Sinh viên: Top Navbar */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/jobs" replace />} />
          <Route path="jobs" element={<StudentJobsPage />} />
          <Route path="saved-jobs" element={<StudentJobsPage />} />
          <Route path="profile" element={<StudentJobsPage />} />
          <Route path="applications" element={<StudentJobsPage />} />
        </Route>

        {/* 3. Nhánh Nhà tuyển dụng: Fixed Dark Sidebar */}
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

        {/* 4. Nhánh Cán bộ Hướng nghiệp: Fixed AGU Blue Sidebar */}
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

        {/* Xử lý 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
