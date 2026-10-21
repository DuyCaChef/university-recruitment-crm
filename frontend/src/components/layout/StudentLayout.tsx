import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  FileText,
  UserCheck,
  Bell,
  LogOut,
  GraduationCap,
} from "lucide-react";

export const StudentLayout = () => {
  const navItems = [
    { label: "Việc làm tuyển dụng", to: "/student/jobs", icon: Briefcase },
    { label: "Việc làm đã lưu", to: "/student/saved-jobs", icon: Bookmark },
    { label: "Hồ sơ nghề nghiệp", to: "/student/profile", icon: UserCheck },
    { label: "Đơn đã nộp", to: "/student/applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar cố định */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Nhãn phân hệ */}
          <div className="flex items-center space-x-8">
            <Link to="/student" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  AGU CAREER
                </span>
                <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">
                  Cổng Sinh Viên
                </span>
              </div>
            </Link>

            {/* Menu điều hướng */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Action góc phải: Notification & User Badge */}
          <div className="flex items-center space-x-3">
            <button
              title="Thông báo"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-700 hidden sm:inline">
                Sinh viên AGU
              </span>
              <Link
                to="/login"
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        Hệ thống hỗ trợ Hướng nghiệp & Tuyển dụng sinh viên AGU
      </footer>
    </div>
  );
};
