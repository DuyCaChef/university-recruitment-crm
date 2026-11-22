import { useState, type FormEvent, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { changePassword, logout } from "../api/authApi";

export default function ChangePasswordPage(): ReactElement {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      try {
        await logout();
      } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        navigate("/login", { replace: true });
      }
    } catch {
      setError("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-5" aria-labelledby="change-password-title">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 id="change-password-title" className="text-h3 font-bold text-ink">
            Đổi mật khẩu bắt buộc
          </h1>
          <p className="mt-1 text-sm text-ink-2">
            Đây là lần đăng nhập đầu tiên. Vui lòng cập nhật mật khẩu mới.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div role="alert" className="rounded-input border border-danger bg-clay-100 p-3 text-small text-danger">
            {error}
          </div>
        )}
        <Input
          id="current-password"
          type="password"
          label="Mật khẩu hiện tại"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          id="new-password"
          type="password"
          label="Mật khẩu mới"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          id="confirm-password"
          type="password"
          label="Xác nhận mật khẩu mới"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={isSubmitting}
        />
        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          Cập nhật mật khẩu
        </Button>
      </form>
    </section>
  );
}
