import { CheckCircle2, Layers, ShieldCheck, Sparkles } from "lucide-react";

export default function App() {
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
                Hệ thống Kết nối Sinh viên & Doanh nghiệp
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Frontend Dev Server Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-10 text-white shadow-lg mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>TASK-S1-09: Khởi tạo Khung React Vite Tailwind</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Frontend Architecture Scaffolding
          </h2>
          <p className="text-blue-100 max-w-2xl text-sm sm:text-base leading-relaxed">
            Khung giao diện React 19, TypeScript, Tailwind CSS và Lucide Icons
            đã được thiết lập thành công trên cổng 5173.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Path Alias (@/)
            </h4>
            <p className="text-xs text-slate-600">
              Đã cấu hình đường dẫn tắt trỏ về thư mục src/.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Tailwind Responsive
            </h4>
            <p className="text-xs text-slate-600">
              Lưới Grid co giãn mượt mà từ 1 cột (Mobile) sang 3 cột (Desktop).
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Lucide Icons
            </h4>
            <p className="text-xs text-slate-600">
              Thư viện vector icon tích hợp trơn tru, hiển thị sắc nét.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        Khóa luận tốt nghiệp: Hệ thống Web CRM Tuyển dụng — Trường Đại học An
        Giang
      </footer>
    </div>
  );
}
