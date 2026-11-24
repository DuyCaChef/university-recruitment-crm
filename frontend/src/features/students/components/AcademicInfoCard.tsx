import { useRef, type ChangeEvent, type ReactElement } from "react";
import { Camera, LockKeyhole, Mail } from "lucide-react";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import {
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
} from "../constants/projectDomains";
import type { StudentProfile, UploadAvatarResponse } from "../types";

export interface AcademicInfoCardProps {
  profile: StudentProfile;
  isSuspended: boolean;
  isUploadingAvatar: boolean;
  isDeletingAvatar: boolean;
  onUploadAvatar: (
    file: File,
    callbacks: {
      onSuccess: (res: UploadAvatarResponse) => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRequestDeleteAvatar: () => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function AcademicInfoCard({
  profile,
  isSuspended,
  isUploadingAvatar,
  isDeletingAvatar,
  onUploadAvatar,
  onRequestDeleteAvatar,
  onNotice,
  onError,
}: AcademicInfoCardProps): ReactElement {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      onError("Chỉ chấp nhận ảnh đại diện định dạng JPG, PNG hoặc WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      onError("Dung lượng ảnh đại diện không được vượt quá 2 MB.");
      event.target.value = "";
      return;
    }

    onUploadAvatar(file, {
      onSuccess: () => {
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        onNotice("Đã cập nhật ảnh đại diện mới.");
      },
      onError: (err) => {
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        onError(extractApiErrorMessage(err, "Không thể tải lên ảnh đại diện."));
      },
    });
  };

  return (
    <div className="rounded-panel border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Khối Ảnh đại diện có thể thay đổi */}
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-center">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isSuspended || isUploadingAvatar}
            onChange={handleAvatarFileChange}
            className="sr-only"
          />
          <button
            type="button"
            disabled={isSuspended || isUploadingAvatar}
            onClick={() => avatarInputRef.current?.click()}
            title="Nhấn để thay đổi ảnh đại diện (JPG, PNG, WebP tối đa 2MB)"
            aria-label="Thay đổi ảnh đại diện"
            className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-pill border-2 border-brand-200 bg-brand-100 text-h3 font-bold text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-60"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || "Ảnh đại diện sinh viên"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {(profile.fullName || "SV").trim().charAt(0).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-ink/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              disabled={isSuspended || isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="font-semibold text-brand-600 hover:underline disabled:opacity-50"
            >
              {isUploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
            </button>
            {profile.avatarUrl && (
              <>
                <span className="text-line-strong">·</span>
                <button
                  type="button"
                  disabled={isSuspended || isDeletingAvatar}
                  onClick={onRequestDeleteAvatar}
                  className="font-semibold text-danger-ink hover:underline disabled:opacity-50"
                >
                  Gỡ ảnh
                </button>
              </>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h3 text-ink">
              {profile.fullName || "Sinh viên AGU"}
            </h2>
            <span
              title="Thông tin Khoa, Ngành, Khóa và MSSV do Nhà trường quản lý"
              className="inline-flex items-center gap-1 rounded-pill bg-subtle px-2 py-0.5 text-[11px] font-medium text-ink-3"
            >
              <LockKeyhole className="h-3 w-3" aria-hidden="true" />
              Dữ liệu gốc AGU
            </span>
          </div>

          {profile.originalFullName &&
            profile.displayName &&
            profile.displayName !== profile.originalFullName && (
              <p className="mt-0.5 text-xs text-ink-3">
                Tên theo hồ sơ gốc AGU: {profile.originalFullName}
              </p>
            )}

          <p className="mt-1 font-mono text-small font-semibold text-brand-600">
            {profile.studentCode}
          </p>
          <p className="mt-1 flex items-center gap-2 truncate text-small text-ink-2">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{profile.institutionalEmail}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-3">
        <div>
          <p className="text-caption text-ink-3">Khoa</p>
          <p className="mt-1 text-small font-semibold text-ink">
            {profile.faculty || "Chưa cập nhật"}
          </p>
        </div>
        <div>
          <p className="text-caption text-ink-3">Ngành đào tạo</p>
          <p className="mt-1 text-small font-semibold text-ink">
            {profile.major || "Chưa cập nhật"}
          </p>
        </div>
        <div>
          <p className="text-caption text-ink-3">Khóa tuyển sinh</p>
          <p className="mt-1 text-small font-semibold text-ink">
            {profile.academicYear
              ? `Khóa ${profile.academicYear}`
              : "Chưa cập nhật"}
          </p>
        </div>
      </div>
    </div>
  );
}
