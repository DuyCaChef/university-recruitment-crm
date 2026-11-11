import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Lưu Access Token vào localStorage
      localStorage.setItem("access_token", token);

      // 2. Chuyển tiếp vào Cổng thông tin sinh viên AGU
      navigate("/student/jobs", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
        <p className="text-sm font-semibold text-slate-700">
          Đang hoàn tất phiên đăng nhập tài khoản sinh viên AGU...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
