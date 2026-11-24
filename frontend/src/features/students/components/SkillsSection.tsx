import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { FormDialog } from "@/components/ui/FormDialog";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { PROFICIENCY_OPTIONS } from "../constants/projectDomains";
import {
  skillFormSchema,
  type SkillFormValues,
} from "../schemas/studentProfile.schema";
import type { ConfirmDeleteTarget, SkillPayload, StudentSkill } from "../types";

export interface SkillsSectionProps {
  skills: StudentSkill[];
  defaultSkillPlaceholder: string;
  isSuspended: boolean;
  isSaving: boolean;
  onSaveSkill: (
    params: { id?: string; payload: SkillPayload },
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRequestDelete: (target: ConfirmDeleteTarget) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function SkillsSection({
  skills,
  defaultSkillPlaceholder,
  isSuspended,
  isSaving,
  onSaveSkill,
  onRequestDelete,
  onNotice,
  onError,
}: SkillsSectionProps): ReactElement {
  const [modalState, setModalState] = useState<{
    open: boolean;
    editing: StudentSkill | null;
  }>({ open: false, editing: null });

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    mode: "onBlur",
    defaultValues: { skillName: "", proficiency: "" },
  });

  const openCreateModal = (): void => {
    skillForm.reset({ skillName: "", proficiency: "" });
    setModalState({ open: true, editing: null });
  };

  const openEditModal = (skill: StudentSkill): void => {
    skillForm.reset({
      skillName: skill.skillName,
      proficiency: skill.proficiency ?? "",
    });
    setModalState({ open: true, editing: skill });
  };

  const handleSubmit = (values: SkillFormValues): void => {
    if (isSuspended) return;
    const editingId = modalState.editing?.id;
    onSaveSkill(
      {
        id: editingId,
        payload: {
          skillName: values.skillName.trim(),
          proficiency: values.proficiency.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setModalState({ open: false, editing: null });
          skillForm.reset();
          onNotice(
            editingId
              ? "Đã cập nhật kỹ năng."
              : "Đã thêm kỹ năng chuyên môn mới.",
          );
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 409) {
            skillForm.setError("skillName", {
              type: "server",
              message: "Kỹ năng này đã tồn tại trong hồ sơ của bạn.",
            });
            return;
          }
          onError(
            extractApiErrorMessage(err, "Không thể lưu thông tin kỹ năng."),
          );
        },
      },
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">Kỹ năng chuyên môn</h2>
          <p className="mt-1 text-small text-ink-2">
            Các kỹ năng chuyên môn, công cụ làm việc hoặc kỹ năng mềm của bạn.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={openCreateModal}
          disabled={isSuspended}
        >
          <Plus className="h-4 w-4" />
          Thêm kỹ năng
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
          Chưa có kỹ năng nào trong hồ sơ.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 desktop:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between gap-3 rounded-card border border-line bg-canvas p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-small font-bold text-ink">
                  {skill.skillName}
                </p>
                <p className="mt-1 text-caption text-ink-3">
                  {skill.proficiency || "Chưa chọn mức độ"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={isSuspended}
                  aria-label={`Sửa kỹ năng ${skill.skillName}`}
                  onClick={() => openEditModal(skill)}
                  className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isSuspended}
                  aria-label={`Xóa kỹ năng ${skill.skillName}`}
                  onClick={() =>
                    onRequestDelete({
                      type: "skill",
                      id: skill.id,
                      label: skill.skillName,
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

      {/* Modal Thêm / Sửa Kỹ năng */}
      <FormDialog
        open={modalState.open}
        title={
          modalState.editing ? "Cập nhật kỹ năng" : "Thêm kỹ năng chuyên môn"
        }
        description="Mỗi kỹ năng chỉ xuất hiện một lần trong hồ sơ của bạn."
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
                form="skill-modal-form"
                size="sm"
                isLoading={isSaving}
                disabled={isSuspended || isSaving}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {modalState.editing ? "Cập nhật" : "Thêm kỹ năng"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="skill-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={skillForm.handleSubmit(handleSubmit)}
        >
          <Input
            id="skill-name"
            label="Tên kỹ năng *"
            placeholder={defaultSkillPlaceholder}
            maxLength={100}
            disabled={isSuspended || isSaving}
            error={skillForm.formState.errors.skillName?.message}
            {...skillForm.register("skillName")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="skill-proficiency"
              className="text-small font-medium text-ink"
            >
              Mức độ thành thạo
            </label>
            <select
              id="skill-proficiency"
              disabled={isSuspended || isSaving}
              className="h-11 w-full rounded-input border-2 border-line-strong bg-surface px-3.5 text-body text-ink transition-all duration-150 hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
              {...skillForm.register("proficiency")}
            >
              <option value="">Không chỉ định</option>
              {PROFICIENCY_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </form>
      </FormDialog>
    </>
  );
}
