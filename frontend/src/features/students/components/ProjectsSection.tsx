import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { FormDialog } from "@/components/ui/FormDialog";
import { TagInput } from "@/components/ui/TagInput";
import { cn } from "@/shared/lib/cn";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import {
  formatMonthYear,
  getTodayInputValue,
  toDateInputValue,
} from "@/shared/lib/formatDate";
import { parseCommaTokens } from "@/shared/lib/format";
import {
  PROJECT_DOMAIN_LIST,
  PROJECT_DOMAIN_PRESETS,
} from "../constants/projectDomains";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "../schemas/studentProfile.schema";
import type {
  ConfirmDeleteTarget,
  ProjectDomainKey,
  ProjectPayload,
  StudentProject,
} from "../types";

export interface ProjectsSectionProps {
  projects: StudentProject[];
  defaultDomainKey: ProjectDomainKey;
  isSuspended: boolean;
  isSaving: boolean;
  onSaveProject: (
    params: { id?: string; payload: ProjectPayload },
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRequestDelete: (target: ConfirmDeleteTarget) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function ProjectsSection({
  projects,
  defaultDomainKey,
  isSuspended,
  isSaving,
  onSaveProject,
  onRequestDelete,
  onNotice,
  onError,
}: ProjectsSectionProps): ReactElement {
  const todayStr = getTodayInputValue();

  const [modalState, setModalState] = useState<{
    open: boolean;
    editing: StudentProject | null;
  }>({ open: false, editing: null });

  const [projectDomain, setProjectDomain] =
    useState<ProjectDomainKey>(defaultDomainKey);

  const activePreset = PROJECT_DOMAIN_PRESETS[projectDomain];

  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      role: "",
      technologies: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const openCreateModal = (): void => {
    setProjectDomain(defaultDomainKey);
    projectForm.reset({
      name: "",
      role: "",
      technologies: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setModalState({ open: true, editing: null });
  };

  const openEditModal = (project: StudentProject): void => {
    setProjectDomain(defaultDomainKey);
    projectForm.reset({
      name: project.name,
      role: project.role ?? "",
      technologies: project.technologies ?? "",
      projectUrl: project.projectUrl ?? "",
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      description: project.description ?? "",
    });
    setModalState({ open: true, editing: project });
  };

  const handleSubmit = (values: ProjectFormValues): void => {
    if (isSuspended) return;
    const editingId = modalState.editing?.id;
    const normalizedTech = parseCommaTokens(values.technologies).join(", ");

    onSaveProject(
      {
        id: editingId,
        payload: {
          name: values.name.trim(),
          role: values.role.trim() || null,
          technologies: normalizedTech || null,
          projectUrl: values.projectUrl.trim() || null,
          startDate: values.startDate || null,
          endDate: values.endDate || null,
          description: values.description.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setModalState({ open: false, editing: null });
          projectForm.reset();
          onNotice(
            editingId
              ? "Đã cập nhật dự án / đề tài."
              : "Đã thêm dự án / đề tài mới vào hồ sơ.",
          );
        },
        onError: (err) => {
          onError(
            extractApiErrorMessage(
              err,
              "Không thể lưu thông tin dự án / đề tài.",
            ),
          );
        },
      },
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">Dự án, Đề tài &amp; Nghiên cứu</h2>
          <p className="mt-1 text-small text-ink-2">
            Đồ án môn học, khóa luận, đề tài nghiên cứu khoa học hoặc sản phẩm
            thực tế.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={openCreateModal}
          disabled={isSuspended}
        >
          <Plus className="h-4 w-4" />
          Thêm dự án / đề tài
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
          Chưa có dự án hoặc đề tài nào trong hồ sơ.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((item) => {
            const methodTokens = parseCommaTokens(item.technologies);
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-card border border-line p-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-small font-bold text-ink">
                        {item.name}
                      </h3>
                      {item.role && (
                        <p className="mt-1 text-xs font-medium text-ink-2">
                          Vai trò: {item.role}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isSuspended}
                        aria-label={`Sửa dự án ${item.name}`}
                        onClick={() => openEditModal(item)}
                        className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isSuspended}
                        aria-label={`Xóa dự án ${item.name}`}
                        onClick={() =>
                          onRequestDelete({
                            type: "project",
                            id: item.id,
                            label: item.name,
                          })
                        }
                        className="rounded-button p-2 text-ink-3 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {(item.startDate || item.endDate) && (
                    <p className="mt-2 flex items-center gap-1.5 text-caption text-ink-3">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.startDate
                        ? formatMonthYear(item.startDate)
                        : "..."}{" "}
                      —{" "}
                      {item.endDate
                        ? formatMonthYear(item.endDate)
                        : "Hiện tại"}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-2 whitespace-pre-line text-xs leading-5 text-ink-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 space-y-2.5">
                  {methodTokens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {methodTokens.map((token) => (
                        <span
                          key={token}
                          className="rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Xem minh chứng / sản phẩm
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm / Sửa Dự án & Đề tài */}
      <FormDialog
        open={modalState.open}
        size="lg"
        title={
          modalState.editing ? "Cập nhật dự án / đề tài" : "Thêm dự án / đề tài"
        }
        description="Đề tài nghiên cứu, đồ án môn học hoặc sản phẩm thực tế của bạn."
        onClose={() => setModalState({ open: false, editing: null })}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-ink-3">* Trường bắt buộc</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => setModalState({ open: false, editing: null })}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="project-modal-form"
                size="sm"
                isLoading={isSaving}
                disabled={isSuspended || isSaving}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {modalState.editing ? "Cập nhật" : "Lưu dự án"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="project-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={projectForm.handleSubmit(handleSubmit)}
        >
          {/* Thanh chuyển ngữ cảnh gợi ý 1 chạm */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-card border border-line bg-canvas px-3 py-2">
            <span className="mr-1 text-[11px] font-medium text-ink-3">
              Gợi ý theo lĩnh vực:
            </span>
            {PROJECT_DOMAIN_LIST.map((preset) => {
              const isSelected = projectDomain === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  disabled={isSuspended || isSaving}
                  onClick={() => setProjectDomain(preset.key)}
                  className={cn(
                    "rounded-pill px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
                    isSelected
                      ? "bg-brand-600 text-white"
                      : "bg-surface text-ink-2 hover:bg-brand-50 hover:text-brand-700 border border-line",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <Input
            id="proj-name"
            label="Tên dự án / Đề tài *"
            placeholder={activePreset.projectNamePlaceholder}
            maxLength={200}
            disabled={isSuspended || isSaving}
            error={projectForm.formState.errors.name?.message}
            {...projectForm.register("name")}
          />

          {/* Vai trò */}
          <div>
            <Input
              id="proj-role"
              label="Vai trò"
              placeholder={activePreset.rolePlaceholder}
              maxLength={100}
              disabled={isSuspended || isSaving}
              error={projectForm.formState.errors.role?.message}
              {...projectForm.register("role")}
            />
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-ink-3">Gợi ý nhanh:</span>
              {activePreset.roleChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={isSuspended || isSaving}
                  onClick={() =>
                    projectForm.setValue("role", chip, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="rounded-pill border border-line bg-subtle px-2.5 py-0.5 text-[11px] text-ink-2 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Công cụ & Phương pháp (TagInput đa dòng) */}
          <Controller
            name="technologies"
            control={projectForm.control}
            render={({ field, fieldState }) => (
              <TagInput
                id="proj-technologies"
                label="Công cụ & Phương pháp (Có thể thêm nhiều)"
                value={field.value}
                onChange={field.onChange}
                placeholder={activePreset.methodPlaceholder}
                disabled={isSuspended || isSaving}
                error={fieldState.error?.message}
                suggestions={activePreset.methodChips}
              />
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="proj-start-date"
              type="date"
              label="Ngày bắt đầu"
              max={todayStr}
              disabled={isSuspended || isSaving}
              error={projectForm.formState.errors.startDate?.message}
              {...projectForm.register("startDate")}
            />

            <Input
              id="proj-end-date"
              type="date"
              label="Ngày hoàn thành"
              max={todayStr}
              disabled={isSuspended || isSaving}
              error={projectForm.formState.errors.endDate?.message}
              {...projectForm.register("endDate")}
            />
          </div>

          <Input
            id="proj-url"
            type="url"
            label="Liên kết minh chứng"
            placeholder={activePreset.urlPlaceholder}
            helperText="Link Google Drive báo cáo, Slide, bài báo khoa học, video hoặc mã nguồn."
            maxLength={500}
            disabled={isSuspended || isSaving}
            error={projectForm.formState.errors.projectUrl?.message}
            {...projectForm.register("projectUrl")}
          />

          <Textarea
            id="proj-description"
            label="Mô tả & Kết quả đạt được"
            placeholder="Tóm tắt mục tiêu, phương pháp thực hiện, đóng góp cá nhân và kết quả chính..."
            rows={3}
            maxLength={2000}
            disabled={isSuspended || isSaving}
            error={projectForm.formState.errors.description?.message}
            {...projectForm.register("description")}
          />
        </form>
      </FormDialog>
    </>
  );
}
