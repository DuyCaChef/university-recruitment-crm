import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Header tối giản */}
      <header className="py-4 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold shadow">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">
                AGU RECRUITMENT CRM
              </span>
              <span className="text-xs text-slate-500 block">
                Cổng thông tin Việc làm & Hướng nghiệp AGU
              </span>
            </div>
          </Link>
          <div className="text-xs text-slate-500">
            Hỗ trợ:{" "}
            <span className="text-blue-700 font-medium">career@agu.edu.vn</span>
          </div>
        </div>
      </header>

      {/* Vùng nội dung trung tâm: Outlet nhận Login / Register Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Footer bản quyền */}
      <footer className="py-4 text-center text-xs text-slate-500 bg-white border-t border-slate-200">
        © 2026 Trường Đại học An Giang — ĐHQG-HCM. Phát triển phục vụ Khóa luận
        Tốt nghiệp.
      </footer>
    </div>
  );
};
