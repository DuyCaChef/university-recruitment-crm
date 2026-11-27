import { type ReactElement } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FolderKanban,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import { parseCommaTokens } from "@/shared/lib/format";
import { formatMonthYear } from "@/shared/lib/formatDate";
import type {
  PublicExperience,
  PublicProject,
  PublicSkill,
} from "../types";
import { getSafeHttpUrl } from "../utils/profileUtils";

const SKILL_TONES = [
  "border-brand-200 bg-brand-50 text-brand-text",
  "border-sage-100 bg-sage-100 text-sage-ink",
  "border-mist-100 bg-mist-100 text-mist-ink",
  "border-clay-100 bg-clay-100 text-clay-ink",
  "border-mauve-100 bg-mauve-100 text-mauve-ink",
] as const;

const PROJECT_TECH_TONES = [
  "border-brand-200 bg-brand-50 text-brand-text",
  "border-sand-100 bg-sand-100 text-sand-ink",
  "border-sage-100 bg-sage-100 text-sage-ink",
  "border-mist-100 bg-mist-100 text-mist-ink",
  "border-mauve-100 bg-mauve-100 text-mauve-ink",
] as const;

/* ── 1. Giới thiệu & Mục tiêu nghề nghiệp ────────────────────────────── */
export function CareerProfileBioSection({
  bio,
}: {
  bio: string | null;
}): ReactElement {
  const trimmedBio = bio?.trim() ?? "";

  return (
    <section
      aria-labelledby="detail-bio-heading"
      className="rounded-card border border-line bg-surface p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-clay-100 text-clay-ink">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="detail-bio-heading" className="text-h3 text-ink">
          Giới thiệu &amp; Mục tiêu nghề nghiệp
        </h2>
      </div>

      {trimmedBio ? (
        <p className="whitespace-pre-line text-body leading-relaxed text-ink-2">
          {trimmedBio}
        </p>
      ) : (
        <p className="text-small italic text-ink-3">
          Ứng viên chưa cập nhật giới thiệu mục tiêu nghề nghiệp.
        </p>
      )}
    </section>
  );
}

/* ── 2. Kỹ năng chuyên môn ───────────────────────────────────────────── */
export function CareerProfileSkillsSection({
  skills,
}: {
  skills: PublicSkill[];
}): ReactElement {
  return (
    <section
      aria-labelledby="detail-skills-heading"
      className="rounded-card border border-line bg-surface p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-sage-100 text-sage-ink">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="detail-skills-heading" className="text-h3 text-ink">
            Kỹ năng chuyên môn
          </h2>
        </div>
        <span className="rounded-pill border border-sage-100 bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-ink tabular-nums">
          {skills.length} kỹ năng
        </span>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-6 text-center text-small text-ink-3">
          Ứng viên chưa cập nhật kỹ năng chuyên môn nào.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={`${skill.skillName}-${skill.proficiency ?? ""}-${index}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 text-small",
                SKILL_TONES[index % SKILL_TONES.length],
              )}
            >
              <span className="font-semibold">{skill.skillName}</span>
              {skill.proficiency && (
                <Badge
                  variant="neutral"
                  className="border-transparent bg-surface/75 px-2 py-0 text-[11px] normal-case tracking-normal text-ink-2"
                >
                  {skill.proficiency}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── 3. Kinh nghiệm làm việc & Thực tập ──────────────────────────────── */
export function CareerProfileExperiencesSection({
  experiences,
}: {
  experiences: PublicExperience[];
}): ReactElement {
  return (
    <section
      aria-labelledby="detail-experiences-heading"
      className="rounded-card border border-line bg-surface p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-mist-100 text-mist-ink">
            <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="detail-experiences-heading" className="text-h3 text-ink">
            Kinh nghiệm làm việc &amp; Thực tập
          </h2>
        </div>
        <span className="rounded-pill border border-mist-100 bg-mist-100 px-2.5 py-1 text-xs font-semibold text-mist-ink tabular-nums">
          {experiences.length} mục
        </span>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-6 text-center text-small text-ink-3">
          Ứng viên chưa cập nhật kinh nghiệm làm việc hoặc thực tập.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp, index) => (
            <article
              key={`${exp.companyName}-${exp.position}-${exp.startDate}-${index}`}
              className="flex items-start gap-3.5 rounded-card border border-line bg-canvas/40 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input bg-mist-100 text-mist-ink">
                <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-base font-bold text-ink">
                    {exp.position}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-sand-100 px-2.5 py-1 text-xs font-semibold text-sand-ink tabular-nums">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatMonthYear(exp.startDate)} —{" "}
                    {formatMonthYear(exp.endDate)}
                  </span>
                </div>

                <p className="text-small font-semibold text-brand-text">
                  {exp.companyName}
                </p>

                {exp.description?.trim() && (
                  <p className="whitespace-pre-line pt-1 text-small leading-relaxed text-ink-2">
                    {exp.description.trim()}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── 4. Dự án, Đề tài & Nghiên cứu ───────────────────────────────────── */
export function CareerProfileProjectsSection({
  projects,
}: {
  projects: PublicProject[];
}): ReactElement {
  return (
    <section
      aria-labelledby="detail-projects-heading"
      className="rounded-card border border-line bg-surface p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-mauve-100 text-mauve-ink">
            <FolderKanban className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="detail-projects-heading" className="text-h3 text-ink">
            Dự án, Đề tài &amp; Nghiên cứu
          </h2>
        </div>
        <span className="rounded-pill border border-mauve-100 bg-mauve-100 px-2.5 py-1 text-xs font-semibold text-mauve-ink tabular-nums">
          {projects.length} dự án
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-6 text-center text-small text-ink-3">
          Ứng viên chưa cập nhật dự án hoặc đề tài nghiên cứu nào.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((project, index) => {
            const techTokens = parseCommaTokens(project.technologies);
            const safeProjectUrl = getSafeHttpUrl(project.projectUrl);
            const hasTimeline = Boolean(project.startDate || project.endDate);

            return (
              <article
                key={`${project.name}-${project.startDate ?? ""}-${index}`}
                className="flex flex-col justify-between gap-3 rounded-card border border-line bg-canvas/40 p-4"
              >
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-ink">
                      {project.name}
                    </h3>

                    {project.role && (
                      <p className="text-small font-medium text-clay-ink">
                        Vai trò: {project.role}
                      </p>
                    )}

                    {hasTimeline && (
                      <p className="flex w-fit items-center gap-1.5 rounded-pill bg-sand-100 px-2.5 py-1 text-xs font-semibold text-sand-ink tabular-nums">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {project.startDate
                          ? `${formatMonthYear(project.startDate)} — ${formatMonthYear(project.endDate)}`
                          : `Hoàn thành ${formatMonthYear(project.endDate)}`}
                      </p>
                    )}
                  </div>

                  {project.description?.trim() && (
                    <p className="whitespace-pre-line text-small leading-relaxed text-ink-2">
                      {project.description.trim()}
                    </p>
                  )}

                  {techTokens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techTokens.map((token, tokenIdx) => (
                        <Badge
                          key={`${token}-${tokenIdx}`}
                          variant="neutral"
                          className={cn(
                            "normal-case tracking-normal",
                            PROJECT_TECH_TONES[
                              tokenIdx % PROJECT_TECH_TONES.length
                            ],
                          )}
                        >
                          {token}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {safeProjectUrl && (
                  <div className="border-t border-line/80 pt-2.5">
                    <a
                      href={safeProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Xem liên kết dự án / minh chứng</span>
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
