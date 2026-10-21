import { Outlet, NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  CheckCircle,
  FileCheck2,
  MessageSquareCheck,
  BarChart3,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export const CareerCenterLayout = () => {
  const menuItems = [
    {
      label: "Bảng điều khiển",
      to: "/career-center/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Doanh nghiệp & CRM",
      to: "/career-center/companies",
      icon: Building,
    },
    {
      label: "Xét duyệt doanh nghiệp",
      to: "/career-center/approvals/companies",
      icon: CheckCircle,
    },
    {
      label: "Kiểm duyệt tin tuyển dụng",
      to: "/career-center/approvals/jobs",
      icon: FileCheck2,
    },
    {
      label: "Tương tác & Follow-up",
      to: "/career-center/crm/interactions",
      icon: MessageSquareCheck,
    },
    {
      label: "Báo cáo & Thống kê",
      to: "/career-center/reports",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar Cố định bên trái */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between fixed inset-y-0 left-0 z-20">
        <div>
          {/* Header Sidebar AGU Blue */}
          <div className="h-16 px-6 flex items-center space-x-3 bg-blue-800 text-white">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-sm shadow">
              AGU
            </div>
            <div>
              <span className="font-bold text-white text-sm block leading-tight">
                CAREER CENTER
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">
                Quản Trị Nhà Trường
              </span>
            </div>
          </div>

          {/* Menu chức năng */}
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
                        ? "bg-blue-700 text-white shadow-sm"
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

        {/* Thông tin Cán bộ */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-white">Cán bộ Hướng nghiệp</p>
            <p className="text-[10px] text-slate-500">
              Trung tâm Hướng nghiệp & HTSV
            </p>
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

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col pl-64">
        {/* Top bar trên cùng */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              CAREER CENTER
            </span>
            <span className="text-sm font-semibold text-slate-700">
              Hệ thống Quản trị Quan hệ Doanh nghiệp
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Quyền Quản Trị Cấp Trường</span>
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
