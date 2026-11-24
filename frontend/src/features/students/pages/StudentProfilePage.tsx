import { useState, type ReactElement } from "react";
import { BadgeCheck } from "lucide-react";
import { Alert, Badge } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { AcademicInfoCard } from "../components/AcademicInfoCard";
import { CvsSection } from "../components/CvsSection";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { ExperiencesSection } from "../components/ExperiencesSection";
import { PersonalInfoForm } from "../components/PersonalInfoForm";
import { ProjectsSection } from "../components/ProjectsSection";
import { SkillsSection } from "../components/SkillsSection";
import { VisibilityToggleCard } from "../components/VisibilityToggleCard";
import {
  inferProjectDomain,
  PROJECT_DOMAIN_PRESETS,
} from "../constants/projectDomains";
import { useStudentProfileQueries } from "../hooks/useStudentProfileQueries";
import type {
  CapabilityTab,
  ConfirmDeleteTarget,
  StudentProfile,
} from "../types";

const STATUS_META: Record<
  StudentProfile["status"],
  { label: string; variant: "success" | "neutral" | "danger" }
> = {
  ACTIVE: { label: "Đang học", variant: "success" },
  GRADUATED: { label: "Đã tốt nghiệp", variant: "neutral" },
  SUSPENDED: { label: "Bị đình chỉ", variant: "danger" },
};

export function StudentProfilePage(): ReactElement {
  const [activeTab, setActiveTab] = useState<CapabilityTab>("skills");
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] =
    useState<ConfirmDeleteTarget | null>(null);

  const {
    profileQuery,
    skillsQuery,
    experiencesQuery,
    projectsQuery,
    cvsQuery,
    uploadAvatarMutation,
    deleteAvatarMutation,
    profileMutation,
    visibilityMutation,
    saveSkillMutation,
    deleteSkillMutation,
    saveExperienceMutation,
    deleteExperienceMutation,
    saveProjectMutation,
    deleteProjectMutation,
    cvUploadMutation,
    cvDefaultMutation,
    cvRenameMutation,
    cvDeleteMutation,
  } = useStudentProfileQueries();

  const showSuccess = (message: string): void => {
    setErrorNotice(null);
    setNotice(message);
  };

  const showError = (message: string): void => {
    setNotice(null);
    setErrorNotice(message);
  };

  // ── Loading & Fatal Error States ───────────────────────────────────────────
  if (profileQuery.isPending) {
    return (
      <div className="rounded-card border border-line bg-surface p-8 text-center text-small text-ink-2">
        Đang tải hồ sơ sinh viên...
      </div>
    );
  }

  const profile = profileQuery.data;

  if (profileQuery.isError || !profile?.id) {
    return (
      <Alert variant="danger">
        Không thể tải hồ sơ sinh viên. Vui lòng thử lại hoặc kiểm tra quyền truy
        cập.
      </Alert>
    );
  }

  const skills = Array.isArray(skillsQuery.data) ? skillsQuery.data : [];
  const experiences = Array.isArray(experiencesQuery.data)
    ? experiencesQuery.data
    : [];
  const projects = Array.isArray(projectsQuery.data) ? projectsQuery.data : [];
  const cvs = Array.isArray(cvsQuery.data) ? cvsQuery.data : [];

  const isSuspended = profile.status === "SUSPENDED";
  const defaultDomainKey = inferProjectDomain(profile.major, profile.faculty);
  const defaultDomainPreset = PROJECT_DOMAIN_PRESETS[defaultDomainKey];

  const currentStatusMeta = STATUS_META[profile.status] ?? {
    label: "Đang hoạt động",
    variant: "neutral" as const,
  };

  const isDeletePending =
    deleteSkillMutation.isPending ||
    deleteExperienceMutation.isPending ||
    deleteProjectMutation.isPending ||
    cvDeleteMutation.isPending ||
    deleteAvatarMutation.isPending;

  const handleExecuteDelete = (): void => {
    if (!confirmDelete || isSuspended) return;

    if (confirmDelete.type === "skill") {
      deleteSkillMutation.mutate(confirmDelete.id, {
        onSuccess: () => {
          setConfirmDelete(null);
          showSuccess("Đã xóa kỹ năng khỏi hồ sơ.");
        },
        onError: (err) => {
          setConfirmDelete(null);
          showError(extractApiErrorMessage(err, "Không thể xóa kỹ năng."));
        },
      });
    } else if (confirmDelete.type === "experience") {
      deleteExperienceMutation.mutate(confirmDelete.id, {
        onSuccess: () => {
          setConfirmDelete(null);
          showSuccess("Đã xóa kinh nghiệm làm việc.");
        },
        onError: (err) => {
          setConfirmDelete(null);
          showError(
            extractApiErrorMessage(err, "Không thể xóa kinh nghiệm làm việc."),
          );
        },
      });
    } else if (confirmDelete.type === "project") {
      deleteProjectMutation.mutate(confirmDelete.id, {
        onSuccess: () => {
          setConfirmDelete(null);
          showSuccess("Đã xóa dự án / đề tài khỏi hồ sơ.");
        },
        onError: (err) => {
          setConfirmDelete(null);
          showError(
            extractApiErrorMessage(err, "Không thể xóa dự án / đề tài."),
          );
        },
      });
    } else if (confirmDelete.type === "cv") {
      cvDeleteMutation.mutate(confirmDelete.id, {
        onSuccess: () => {
          setConfirmDelete(null);
          showSuccess("Đã xóa bản CV khỏi kho cá nhân.");
        },
        onError: (err) => {
          setConfirmDelete(null);
          showError(extractApiErrorMessage(err, "Không thể xóa bản CV."));
        },
      });
    } else if (confirmDelete.type === "avatar") {
      deleteAvatarMutation.mutate(undefined, {
        onSuccess: () => {
          setConfirmDelete(null);
          showSuccess("Đã gỡ ảnh đại diện.");
        },
        onError: (err) => {
          setConfirmDelete(null);
          showError(extractApiErrorMessage(err, "Không thể gỡ ảnh đại diện."));
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header trang ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-caption uppercase tracking-[0.08em] text-brand-600">
            Hồ sơ năng lực
          </p>
          <h1 className="mt-1 text-h2 text-ink">Hồ sơ sinh viên</h1>
          <p className="mt-1 text-small text-ink-2">
            Quản lý thông tin cá nhân, năng lực chuyên môn và các bản CV ứng
            tuyển.
          </p>
        </div>
        <Badge
          variant={currentStatusMeta.variant}
          icon={<BadgeCheck className="h-3.5 w-3.5" />}
        >
          {currentStatusMeta.label}
        </Badge>
      </div>

      {/* ── Thông báo phản hồi thao tác ──────────────────────────────────── */}
      {notice && (
        <Alert
          variant="success"
          className="cursor-pointer"
          onClick={() => setNotice(null)}
        >
          {notice}
        </Alert>
      )}

      {errorNotice && (
        <Alert
          variant="danger"
          className="cursor-pointer"
          onClick={() => setErrorNotice(null)}
        >
          {errorNotice}
        </Alert>
      )}

      {isSuspended && (
        <Alert variant="danger">
          Tài khoản đang ở trạng thái đình chỉ học tập. Các chức năng cập nhật
          hồ sơ, quản lý CV và ứng tuyển đã bị khóa.
        </Alert>
      )}

      {/* ── Khối 1: Thông tin học thuật gốc (Read-only) & Visibility ─────── */}
      <section className="grid gap-4 desktop:grid-cols-[minmax(0,1.55fr)_minmax(280px,.45fr)]">
        <AcademicInfoCard
          profile={profile}
          isSuspended={isSuspended}
          isUploadingAvatar={uploadAvatarMutation.isPending}
          isDeletingAvatar={deleteAvatarMutation.isPending}
          onUploadAvatar={(file, callbacks) =>
            uploadAvatarMutation.mutate(file, callbacks)
          }
          onRequestDeleteAvatar={() =>
            setConfirmDelete({
              type: "avatar",
              id: "avatar",
              label: "ảnh đại diện hiện tại",
            })
          }
          onNotice={showSuccess}
          onError={showError}
        />

        <VisibilityToggleCard
          visibility={profile.careerProfileVisibility}
          isSuspended={isSuspended}
          isPending={visibilityMutation.isPending}
          onToggle={(nextVisibility, callbacks) =>
            visibilityMutation.mutate(nextVisibility, callbacks)
          }
          onNotice={showSuccess}
          onError={showError}
        />
      </section>

      {/* ── Khối 2: Thông tin cá nhân (Editable) ─────────────────────────── */}
      <PersonalInfoForm
        profile={profile}
        isSuspended={isSuspended}
        isPending={profileMutation.isPending}
        onSubmitProfile={(payload, callbacks) =>
          profileMutation.mutate(payload, callbacks)
        }
        onNotice={showSuccess}
        onError={showError}
      />

      {/* ── Khối 3: Kỹ năng, Kinh nghiệm làm việc & Dự án / Đề tài ───────── */}
      <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-sm">
        <div
          className="flex flex-wrap gap-1 border-b border-line px-4 pt-3"
          role="tablist"
          aria-label="Hồ sơ năng lực"
        >
          {(
            [
              ["skills", "Kỹ năng", skills.length],
              ["experiences", "Kinh nghiệm", experiences.length],
              ["projects", "Dự án / Đề tài", projects.length],
            ] as const
          ).map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex min-h-11 items-center gap-2 border-b-2 px-3 text-small font-semibold transition-colors",
                activeTab === id
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-2 hover:text-brand-600",
              )}
            >
              {label}
              <span className="rounded-pill bg-subtle px-2 py-0.5 text-caption text-ink-2">
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "skills" && (
            <SkillsSection
              skills={skills}
              defaultSkillPlaceholder={defaultDomainPreset.skillPlaceholder}
              isSuspended={isSuspended}
              isSaving={saveSkillMutation.isPending}
              onSaveSkill={(params, callbacks) =>
                saveSkillMutation.mutate(params, callbacks)
              }
              onRequestDelete={setConfirmDelete}
              onNotice={showSuccess}
              onError={showError}
            />
          )}

          {activeTab === "experiences" && (
            <ExperiencesSection
              experiences={experiences}
              defaultCompanyPlaceholder={defaultDomainPreset.companyPlaceholder}
              defaultPositionPlaceholder={
                defaultDomainPreset.positionPlaceholder
              }
              isSuspended={isSuspended}
              isSaving={saveExperienceMutation.isPending}
              onSaveExperience={(params, callbacks) =>
                saveExperienceMutation.mutate(params, callbacks)
              }
              onRequestDelete={setConfirmDelete}
              onNotice={showSuccess}
              onError={showError}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsSection
              projects={projects}
              defaultDomainKey={defaultDomainKey}
              isSuspended={isSuspended}
              isSaving={saveProjectMutation.isPending}
              onSaveProject={(params, callbacks) =>
                saveProjectMutation.mutate(params, callbacks)
              }
              onRequestDelete={setConfirmDelete}
              onNotice={showSuccess}
              onError={showError}
            />
          )}
        </div>
      </section>

      {/* ── Khối 4: Quản lý đa bản CV ─────────────────────────────────────── */}
      <CvsSection
        cvs={cvs}
        isSuspended={isSuspended}
        isUploading={cvUploadMutation.isPending}
        isSettingDefault={cvDefaultMutation.isPending}
        isRenaming={cvRenameMutation.isPending}
        onUploadCv={(params, callbacks) =>
          cvUploadMutation.mutate(params, callbacks)
        }
        onSetDefaultCv={(cvId, callbacks) =>
          cvDefaultMutation.mutate(cvId, callbacks)
        }
        onRenameCv={(params, callbacks) =>
          cvRenameMutation.mutate(params, callbacks)
        }
        onRequestDelete={setConfirmDelete}
        onNotice={showSuccess}
        onError={showError}
      />

      {/* ── Hộp thoại xác nhận xóa dữ liệu ───────────────────────────────── */}
      <DeleteConfirmDialog
        target={confirmDelete}
        isPending={isDeletePending}
        isSuspended={isSuspended}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
}

export default StudentProfilePage;
