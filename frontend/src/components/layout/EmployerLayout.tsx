import { Outlet, NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  Calendar,
  Building2,
  Bell,
  LogOut,
} from "lucide-react";

export const EmployerLayout = () => {
  const menuItems = [
    {
      label: "Bảng điều khiển",
      to: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    { label: "Tin tuyển dụng", to: "/employer/jobs", icon: Briefcase },
    { label: "Phễu ứng viên (Kanban)", to: "/employer/pipeline", icon: Kanban },
    { label: "Lịch phỏng vấn", to: "/employer/interviews", icon: Calendar },
    { label: "Hồ sơ doanh nghiệp", to: "/employer/profile", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar Cố định bên trái */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between fixed inset-y-0 left-0 z-20">
        <div>
          {/* Header Sidebar */}
          <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block leading-tight">
                AGU PARTNER
              </span>
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                Cổng Doanh Nghiệp
              </span>
            </div>
          </div>

          {/* Danh mục menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
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

        {/* Thông tin nhà tuyển dụng & Thoát */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-white">Nhà Tuyển Dụng</p>
            <p className="text-[10px] text-slate-500">Đối tác AGU</p>
          </div>
          <Link
            to="/login"
            title="Đăng xuất"
            className="text-slate-400 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Vùng nội dung chính bên phải */}
      <div className="flex-1 flex flex-col pl-64">
        {/* Top bar trên cùng */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Không Gian Làm Việc Doanh Nghiệp
          </h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>
            <div className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-semibold border border-emerald-200">
              Company Verified
            </div>
          </div>
        </header>

        {/* Nội dung trang con */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
