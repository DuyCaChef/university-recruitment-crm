import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900">Đăng nhập</h3>
        <p className="text-xs text-slate-500 mt-1">
          Chọn vai trò để trải nghiệm nhanh các layout mẫu của hệ thống
        </p>
      </div>

      <div className="space-y-2 pt-2">
        <Link
          to="/student"
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold shadow-sm transition"
        >
          Vào Cổng Sinh Viên (Student Layout)
        </Link>
        <Link
          to="/employer/dashboard"
          className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          Vào Cổng Doanh Nghiệp (Employer Layout)
        </Link>
        <Link
          to="/career-center/dashboard"
          className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          Vào Cổng Cán Bộ Trường (Career Center Layout)
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
