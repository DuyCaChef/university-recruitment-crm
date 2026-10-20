import { useQuery } from '@tanstack/react-query';
import { healthService, type HealthCheckResponse } from '@/services/api/healthService';
import { 
  CheckCircle2, 
  Database, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // Định nghĩa kiểu rõ ràng cho useQuery để tránh lỗi unknown / {}
  const { 
    data: healthData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useQuery<HealthCheckResponse, Error>({
    queryKey: ['system-health'],
    queryFn: healthService.checkHealth,
  });

  // Kích hoạt thử nghiệm mã lỗi 401 Unauthorized
  const handleTestUnauthorized = async () => {
    try {
      await healthService.triggerUnauthorizedTest();
    } catch (err: unknown) {
      console.log('Đã bắt được phản hồi từ chối quyền:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-xl shadow">
              AGU
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                AGU Recruitment CRM
              </h1>
              <p className="text-xs text-slate-500">
                Hệ sinh thái Tuyển dụng & Quản trị Quan hệ Doanh nghiệp
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sprint 1: Foundation Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <span className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-3">
            TASK-S1-10: Axios Client & TanStack React Query
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Network Layer & Server-State Verification
          </h2>
          <p className="text-blue-100 max-w-2xl text-sm leading-relaxed">
            Kiểm thử giao tiếp thời gian thực giữa máy chủ phát triển Frontend (React 19) và Backend NestJS thông qua Axios Client và React Query.
          </p>
        </div>

        {/* Real-time Health Check Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Kiểm tra Kết nối Máy chủ Backend (GET /api/v1/health)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Được thực thi tự động qua hook useQuery của @tanstack/react-query
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>{isFetching ? 'Đang gọi lại...' : 'Tải lại kết nối'}</span>
            </button>
          </div>

          <div className="mt-6">
            {isLoading && (
              <div className="p-6 text-center text-slate-500 text-sm">
                Đang gửi request kết nối tới Backend...
              </div>
            )}

            {isError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">Lỗi kết nối tới Backend NestJS API!</p>
                  <p className="mt-1">
                    {error instanceof Error ? error.message : 'Vui lòng kiểm tra xem Backend cổng 3000 đã bật chưa.'}
                  </p>
                </div>
              </div>
            )}

            {healthData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-medium block">Trạng thái API Server</span>
                  <span className="text-lg font-bold text-emerald-800 uppercase mt-1 block">
                    {healthData.status}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-xs text-blue-600 font-medium block">Cơ sở dữ liệu PostgreSQL</span>
                  <span className="text-lg font-bold text-blue-800 uppercase mt-1 block flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-600" />
                    {healthData.database}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Thời gian phản hồi máy chủ</span>
                  <span className="text-xs font-mono text-slate-700 mt-2 block truncate">
                    {healthData.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 401 Interceptor Verification Box */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-base font-bold text-amber-900">
                Kiểm thử Interceptor bắt lỗi 401 Unauthorized
              </h4>
              <p className="text-xs text-amber-700 mt-1 max-w-3xl leading-relaxed">
                Nút bên dưới sẽ gọi thử một endpoint yêu cầu xác thực (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">/users/me</code>) khi chưa đăng nhập. 
                Axios Interceptor sẽ bắt mã lỗi 401 từ server, tiến hành dọn sạch localStorage và tự động điều hướng người dùng về trang <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">/login</code> theo đúng tiêu chí nghiệm thu.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleTestUnauthorized}
                  className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Kích hoạt lỗi 401 để kiểm tra tự động Redirect
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        Khóa luận tốt nghiệp: Hệ thống Web CRM Tuyển dụng — Trường Đại học An Giang
      </footer>
    </div>
  );
}