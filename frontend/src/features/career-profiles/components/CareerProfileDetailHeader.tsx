import { useState, type ReactElement } from "react";
import {
  Building2,
  Eye,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui";
import type { PublicCareerProfile } from "../types";
import { getNameInitials } from "../utils/profileUtils";

export interface CareerProfileDetailHeaderProps {
  profile: PublicCareerProfile;
}

export function CareerProfileDetailHeader({
  profile,
}: CareerProfileDetailHeaderProps): ReactElement {
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <section
      aria-label="Thông tin định danh ứng viên"
      className="agu-signature-hero relative isolate overflow-hidden rounded-panel border border-brand-700/20 p-5 shadow-lg md:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[42px] border-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-48 h-56 w-56 rounded-full bg-sand/15 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-6 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-3 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            AGU CAREER <span aria-hidden="true">/</span> HỒ SƠ SINH VIÊN
          </p>

          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-pill border-[3px] border-sand bg-sand-100 text-h2 font-bold text-sand-ink shadow-lg ring-4 ring-white/10 md:h-24 md:w-24">
              {profile.avatarUrl && !avatarFailed ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  onError={() => setAvatarFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span aria-hidden="true">
                  {getNameInitials(profile.fullName)}
                </span>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-h2 font-bold text-white md:text-h1">
                  {profile.fullName}
                </h1>
                {profile.academicYear !== null && (
                  <Badge
                    variant="brand"
                    className="border-white/20 bg-white/10 text-white normal-case tracking-normal"
                  >
                    Khóa {profile.academicYear}
                  </Badge>
                )}
                <Badge
                  variant="success"
                  icon={<Eye className="h-3 w-3" aria-hidden="true" />}
                  className="normal-case tracking-normal"
                >
                  Hồ sơ công khai
                </Badge>
                <Badge
                  variant="neutral"
                  icon={<LockKeyhole className="h-3 w-3" aria-hidden="true" />}
                  className="normal-case tracking-normal"
                >
                  Chỉ đọc
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small">
                <p className="flex items-center gap-1.5 font-semibold text-white">
                  <GraduationCap
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{profile.major}</span>
                </p>

                {profile.faculty && (
                  <p className="flex items-center gap-1.5 text-white">
                    <Building2
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{profile.faculty}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Counters */}
        <div className="grid grid-cols-3 gap-2.5 desktop:w-[300px] desktop:shrink-0">
          <div className="rounded-input border border-white/20 bg-white/10 px-2.5 py-3 text-center backdrop-blur-sm">
            <p className="text-h3 font-bold text-white tabular-nums">
              {profile.skills.length}
            </p>
            <p className="text-caption text-white">Kỹ năng</p>
          </div>
          <div className="rounded-input border border-white/20 bg-white/10 px-2.5 py-3 text-center backdrop-blur-sm">
            <p className="text-h3 font-bold text-white tabular-nums">
              {profile.experiences.length}
            </p>
            <p className="text-caption text-white">Kinh nghiệm</p>
          </div>
          <div className="rounded-input border border-white/20 bg-white/10 px-2.5 py-3 text-center backdrop-blur-sm">
            <p className="text-h3 font-bold text-white tabular-nums">
              {profile.projects.length}
            </p>
            <p className="text-caption text-white">Dự án</p>
          </div>
        </div>
      </div>

      {/* Privacy Notice (BR-STU-13 / FR-SCD-02) */}
      <div className="relative z-10 mt-6 flex items-start gap-3 rounded-input border border-white/20 bg-white/[0.08] px-3.5 py-3 text-xs leading-relaxed text-white">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-ink">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <p>
          Thông tin liên hệ cá nhân (email, số điện thoại, địa chỉ, MSSV, GPA) và
          CV đính kèm được ẩn theo chính sách quyền riêng tư, và chỉ được mở khóa
          khi sinh viên chủ động ứng tuyển vào tin tuyển dụng.
        </p>
      </div>
    </section>
  );
}
