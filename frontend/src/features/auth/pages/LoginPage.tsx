// src/features/auth/pages/LoginPage.tsx
import { useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { AguSsoButton } from '../components/AguSsoButton';
import { CredentialsLoginForm } from '../components/CredentialsLoginForm';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

export const LoginPage = (): ReactElement => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  // Bắt mã lỗi trả về trên URL nếu Google SSO bị từ chối (ví dụ: dùng @gmail.com cá nhân)
  const ssoErrorCode = searchParams.get('error');
  const ssoErrorMessage = ssoErrorCode
    ? (ERROR_MESSAGES[ssoErrorCode] ?? ERROR_MESSAGES.SSO_DOMAIN_FORBIDDEN)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Đăng nhập Cổng Việc làm Trường Đại học An Giang</h1>

      {/* Thông báo lỗi nếu luồng Google SSO redirect về kèm mã lỗi */}
      {ssoErrorMessage && (
        <div
          role="alert"
          className="rounded-input border border-danger bg-clay-100 p-3.5 text-small text-clay-ink flex items-start gap-2.5"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-danger mt-0.5" aria-hidden="true" />
          <span>{ssoErrorMessage}</span>
        </div>
      )}

      {/* Khối 1: Đăng nhập Google SSO dành cho Sinh viên AGU */}
      <AguSsoButton />

      {/* Đường phân cách nhẹ giữa 2 luồng xác thực */}
      <div className="relative flex items-center" role="separator" aria-label="Hoặc">
        <div className="h-px flex-1 bg-line" />
        <span className="mx-3 rounded-pill bg-mauve-100 px-3 py-1 text-caption font-semibold text-mauve-ink">
          HOẶC
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      {/* Khối 2: Form Email & Mật khẩu dành cho Career Center và Employer */}
      <CredentialsLoginForm onOpenForgotPassword={() => setIsForgotModalOpen(true)} />

      {/* Hộp thoại hướng dẫn khi bấm Quên mật khẩu */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;