import { useState, type ChangeEvent, type ReactElement } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { FormDialog } from "@/components/ui/FormDialog";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import {
  formatMonthYear,
  getTodayInputValue,
  toDateInputValue,
} from "@/shared/lib/formatDate";
import {
  experienceFormSchema,
  type ExperienceFormValues,
} from "../schemas/studentProfile.schema";
import type {
  ConfirmDeleteTarget,
  ExperiencePayload,
  StudentExperience,
} from "../types";

export interface ExperiencesSectionProps {
  experiences: StudentExperience[];
  defaultCompanyPlaceholder: string;
  defaultPositionPlaceholder: string;
  isSuspended: boolean;
  isSaving: boolean;
  onSaveExperience: (
    params: { id?: string; payload: ExperiencePayload },
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRequestDelete: (target: ConfirmDeleteTarget) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function ExperiencesSection({
  experiences,
  defaultCompanyPlaceholder,
  defaultPositionPlaceholder,
  isSuspended,
  isSaving,
  onSaveExperience,
  onRequestDelete,
  onNotice,
  onError,
}: ExperiencesSectionProps): ReactElement {
  const todayStr = getTodayInputValue();

  const [modalState, setModalState] = useState<{
    open: boolean;
    editing: StudentExperience | null;
  }>({ open: false, editing: null });

  const experienceForm = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      position: "",
      startDate: "",
      isCurrent: false,
      endDate: "",
      description: "",
    },
  });

  const isCurrentExp =
    useWatch({ control: experienceForm.control, name: "isCurrent" }) ?? false;

  const openCreateModal = (): void => {
    experienceForm.reset({
      companyName: "",
      position: "",
      startDate: "",
      isCurrent: false,
      endDate: "",
      description: "",
    });
    setModalState({ open: true, editing: null });
  };

  const openEditModal = (exp: StudentExperience): void => {
    experienceForm.reset({
      companyName: exp.companyName,
      position: exp.position,
      startDate: toDateInputValue(exp.startDate),
      isCurrent: exp.endDate === null,
      endDate: toDateInputValue(exp.endDate),
      description: exp.description ?? "",
    });
    setModalState({ open: true, editing: exp });
  };

  const handleSubmit = (values: ExperienceFormValues): void => {
    if (isSuspended) return;
    const editingId = modalState.editing?.id;
    onSaveExperience(
      {
        id: editingId,
        payload: {
          companyName: values.companyName.trim(),
          position: values.position.trim(),
          startDate: values.startDate,
          endDate: values.isCurrent || !values.endDate ? null : values.endDate,
          description: values.description.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setModalState({ open: false, editing: null });
          experienceForm.reset();
          onNotice(
            editingId
              ? "Đã cập nhật kinh nghiệm làm việc."
              : "Đã thêm kinh nghiệm làm việc mới.",
          );
        },
        onError: (err) => {
          onError(
            extractApiErrorMessage(err, "Không thể lưu kinh nghiệm làm việc."),
          );
        },
      },
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">
            Kinh nghiệm làm việc &amp; Thực tập
          </h2>
          <p className="mt-1 text-small text-ink-2">
            Quá trình thực tập, kiến tập, làm việc bán thời gian hoặc toàn thời
            gian.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={openCreateModal}
          disabled={isSuspended}
        >
          <Plus className="h-4 w-4" />
          Thêm kinh nghiệm
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
          Chưa có kinh nghiệm làm việc nào.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-card border border-line p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-brand-50">
                <BriefcaseBusiness className="h-5 w-5 text-brand-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-small font-bold text-ink">
                  {item.position}
                </h3>
                <p className="mt-0.5 text-small text-ink-2">
                  {item.companyName}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-caption text-ink-3">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatMonthYear(item.startDate)} —{" "}
                  {formatMonthYear(item.endDate)}
                </p>
                {item.description && (
                  <p className="mt-2 whitespace-pre-line text-xs leading-5 text-ink-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={isSuspended}
                  aria-label={`Sửa kinh nghiệm ${item.position}`}
                  onClick={() => openEditModal(item)}
                  className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isSuspended}
                  aria-label={`Xóa kinh nghiệm ${item.position}`}
                  onClick={() =>
                    onRequestDelete({
                      type: "experience",
                      id: item.id,
                      label: `${item.position} tại ${item.companyName}`,
                    })
                  }
                  className="rounded-button p-2 text-ink-3 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm / Sửa Kinh nghiệm */}
      <FormDialog
        open={modalState.open}
        size="lg"
        title={
          modalState.editing
            ? "Cập nhật kinh nghiệm làm việc"
            : "Thêm kinh nghiệm làm việc"
        }
        description="Ghi nhận quá trình thực tập, kiến tập hoặc làm việc thực tế tại cơ quan, doanh nghiệp."
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
                form="experience-modal-form"
                size="sm"
                isLoading={isSaving}
                disabled={isSuspended || isSaving}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {modalState.editing ? "Cập nhật" : "Lưu kinh nghiệm"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="experience-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={experienceForm.handleSubmit(handleSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="exp-company"
              label="Công ty / Tổ chức *"
              placeholder={defaultCompanyPlaceholder}
              maxLength={150}
              disabled={isSuspended || isSaving}
              error={experienceForm.formState.errors.companyName?.message}
              {...experienceForm.register("companyName")}
            />

            <Input
              id="exp-position"
              label="Vị trí đảm nhiệm *"
              placeholder={defaultPositionPlaceholder}
              maxLength={150}
              disabled={isSuspended || isSaving}
              error={experienceForm.formState.errors.position?.message}
              {...experienceForm.register("position")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="exp-start-date"
              type="date"
              label="Ngày bắt đầu *"
              max={todayStr}
              disabled={isSuspended || isSaving}
              error={experienceForm.formState.errors.startDate?.message}
              {...experienceForm.register("startDate")}
            />

            <Input
              id="exp-end-date"
              type="date"
              label="Ngày kết thúc"
              max={todayStr}
              disabled={isSuspended || isSaving || isCurrentExp}
              error={experienceForm.formState.errors.endDate?.message}
              {...experienceForm.register("endDate")}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={isSuspended || isSaving}
              className="h-4 w-4 accent-brand-600"
              {...experienceForm.register("isCurrent", {
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    experienceForm.setValue("endDate", "", {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
            Hiện tại tôi đang làm việc tại đây
          </label>

          <Textarea
            id="exp-description"
            label="Mô tả công việc & Thành tích"
            placeholder="Nhiệm vụ chính, kỹ năng/công cụ áp dụng và kết quả đạt được..."
            rows={3}
            maxLength={2000}
            disabled={isSuspended || isSaving}
            error={experienceForm.formState.errors.description?.message}
            {...experienceForm.register("description")}
          />
        </form>
      </FormDialog>
    </>
  );
}
