import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      <h1 className="text-6xl font-black text-slate-300">404</h1>
      <p className="text-base font-semibold text-slate-800 mt-2">
        Trang không tồn tại
      </p>
      <Link
        to="/login"
        className="mt-4 text-xs font-semibold text-blue-700 underline"
      >
        Quay về trang đăng nhập
      </Link>
    </div>
  );
};

export default NotFoundPage;
