import { useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FolderKanban,
  GraduationCap,
} from "lucide-react";
import { Badge, buttonVariants } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import { formatMonthYear } from "@/shared/lib/formatDate";
import type { PublicCareerProfile } from "../types";

const MAX_VISIBLE_SKILLS = 4;

export interface CareerProfileCardProps {
  profile: PublicCareerProfile;
}

function getNameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SV";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function CareerProfileCard({
  profile,
}: CareerProfileCardProps): ReactElement {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const visibleSkills = profile.skills.slice(0, MAX_VISIBLE_SKILLS);
  const extraSkillsCount = Math.max(
    0,
    profile.skills.length - MAX_VISIBLE_SKILLS,
  );
  const latestExperience = profile.experiences[0] ?? null;
  const extraExperiencesCount = Math.max(0, profile.experiences.length - 1);
  const projectsCount = profile.projects.length;
  const latestProject = profile.projects[0] ?? null;

  return (
    <article className="group flex flex-col justify-between gap-4 rounded-card border border-line bg-surface p-5 shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md">
      <div className="space-y-4">
        {/* Header: Avatar + Identity */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-pill border border-brand-200 bg-brand-100 text-base font-bold text-brand-700">
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

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="min-w-0 truncate text-base font-bold text-ink">
                {profile.fullName}
              </h2>
              {profile.academicYear != null && (
                <Badge
                  variant="brand"
                  className="shrink-0 normal-case tracking-normal"
                >
                  Khóa {profile.academicYear}
                </Badge>
              )}
            </div>

            <p className="flex items-center gap-1.5 text-small font-semibold text-brand-text">
              <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{profile.major}</span>
            </p>

            {profile.faculty && (
              <p className="flex items-center gap-1.5 text-xs text-ink-2">
                <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{profile.faculty}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bio summary */}
        {profile.bio?.trim() ? (
          <p className="line-clamp-2 min-h-[2.5rem] text-small leading-relaxed text-ink-2">
            {profile.bio.trim()}
          </p>
        ) : (
          <p className="line-clamp-2 min-h-[2.5rem] text-xs italic leading-relaxed text-ink-3">
            Ứng viên chưa cập nhật giới thiệu mục tiêu nghề nghiệp.
          </p>
        )}

        {/* Skills */}
        <div className="space-y-1.5">
          <p className="text-caption uppercase tracking-wide text-ink-3">
            Kỹ năng nổi bật
          </p>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleSkills.map((skill) => (
                <span
                  key={`${skill.skillName}-${skill.proficiency ?? ""}`}
                  className="inline-flex items-center gap-1 rounded-pill border border-line bg-subtle px-2.5 py-0.5 text-xs font-medium text-ink"
                >
                  <span>{skill.skillName}</span>
                  {skill.proficiency && (
                    <span className="text-ink-3">· {skill.proficiency}</span>
                  )}
                </span>
              ))}
              {extraSkillsCount > 0 && (
                <Badge
                  variant="info"
                  className="normal-case tracking-normal"
                >
                  +{extraSkillsCount} kỹ năng khác
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-xs text-ink-3">Chưa cập nhật kỹ năng</p>
          )}
        </div>

        {/* Experience & Projects summary */}
        <div className="space-y-2 rounded-input border border-line/80 bg-subtle/60 p-3 text-xs">
          <div className="flex items-start gap-2">
            <Briefcase
              className={cn(
                "mt-0.5 h-3.5 w-3.5 shrink-0",
                latestExperience ? "text-brand-600" : "text-ink-3",
              )}
              aria-hidden="true"
            />
            {latestExperience ? (
              <div className="min-w-0 flex-1 text-ink-2">
                <p className="truncate font-semibold text-ink">
                  {latestExperience.position} · {latestExperience.companyName}
                </p>
                <p className="mt-0.5 text-ink-3">
                  {formatMonthYear(latestExperience.startDate)} –{" "}
                  {formatMonthYear(latestExperience.endDate)}
                  {extraExperiencesCount > 0 &&
                    ` (+${extraExperiencesCount} kinh nghiệm khác)`}
                </p>
              </div>
            ) : (
              <span className="text-ink-3">Chưa có kinh nghiệm thực tập / làm việc</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FolderKanban
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                projectsCount > 0 ? "text-brand-600" : "text-ink-3",
              )}
              aria-hidden="true"
            />
            {projectsCount > 0 ? (
              <p className="min-w-0 flex-1 truncate text-ink-2">
                <span className="font-semibold text-ink tabular-nums">
                  {projectsCount} dự án / đề tài
                </span>
                {latestProject ? ` · ${latestProject.name}` : ""}
              </p>
            ) : (
              <span className="text-ink-3">Chưa có dự án / đề tài</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-line pt-3">
        <Link
          to={profile.studentId}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full justify-between group-hover:border-brand-400 group-hover:bg-brand-50 group-hover:text-brand-700",
          )}
        >
          <span>Xem hồ sơ chi tiết</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export function CareerProfileCardSkeleton(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col justify-between gap-4 rounded-card border border-line bg-surface p-5 shadow-sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="h-14 w-14 shrink-0 rounded-pill bg-subtle" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-2/3 rounded-xs bg-subtle" />
            <div className="h-3.5 w-1/2 rounded-xs bg-subtle" />
            <div className="h-3 w-1/3 rounded-xs bg-subtle" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded-xs bg-subtle" />
          <div className="h-3.5 w-4/5 rounded-xs bg-subtle" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-6 w-20 rounded-pill bg-subtle" />
          <div className="h-6 w-24 rounded-pill bg-subtle" />
          <div className="h-6 w-16 rounded-pill bg-subtle" />
        </div>
        <div className="h-16 w-full rounded-input bg-subtle" />
      </div>
      <div className="border-t border-line pt-3">
        <div className="h-9 w-full rounded-button bg-subtle" />
      </div>
    </div>
  );
}
