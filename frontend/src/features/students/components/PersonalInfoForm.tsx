import type { ReactElement } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserRound } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { toDateInputValue } from "@/shared/lib/formatDate";
import {
  personalProfileSchema,
  type PersonalProfileFormValues,
} from "../schemas/studentProfile.schema";
import type { StudentProfile, UpdateProfilePayload } from "../types";

export interface PersonalInfoFormProps {
  profile: StudentProfile;
  isSuspended: boolean;
  isPending: boolean;
  onSubmitProfile: (
    payload: UpdateProfilePayload,
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function PersonalInfoForm({
  profile,
  isSuspended,
  isPending,
  onSubmitProfile,
  onNotice,
  onError,
}: PersonalInfoFormProps): ReactElement {
  const personalForm = useForm<PersonalProfileFormValues>({
    resolver: zodResolver(personalProfileSchema),
    mode: "onBlur",
    values: {
      displayName: profile.displayName ?? "",
      phone: profile.phone ?? "",
      dateOfBirth: toDateInputValue(profile.dateOfBirth),
      gender: profile.gender ?? "",
      gpa:
        profile.gpa !== null && profile.gpa !== undefined
          ? String(profile.gpa)
          : "",
      address: profile.address ?? "",
      bio: profile.bio ?? "",
    },
  });

  const watchedBio =
    useWatch({ control: personalForm.control, name: "bio" }) ?? "";

  const handleSubmit = (values: PersonalProfileFormValues): void => {
    if (isSuspended === true) return;

    const cleanDisplayName = values.displayName.trim();
    const cleanPhone = values.phone.replace(/[\s.-]/g, "");
    const cleanAddress = values.address.trim();
    const cleanBio = values.bio.trim();

    onSubmitProfile(
      {
        displayName: cleanDisplayName
          ? cleanDisplayName
          : profile.displayName !== null
            ? null
            : undefined,
        phone: cleanPhone
          ? cleanPhone
          : profile.phone !== null
            ? null
            : undefined,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth
          : profile.dateOfBirth !== null
            ? null
            : undefined,
        gender: values.gender
          ? values.gender
          : profile.gender !== null
            ? null
            : undefined,
        gpa: values.gpa
          ? Number(values.gpa)
          : profile.gpa !== null
            ? null
            : undefined,
        address: cleanAddress
          ? cleanAddress
          : profile.address !== null
            ? null
            : undefined,
        bio: cleanBio ? cleanBio : profile.bio !== null ? null : undefined,
      },
      {
        onSuccess: () => {
          onNotice("Đã lưu thay đổi thông tin cá nhân.");
        },
        onError: (err) => {
          onError(
            extractApiErrorMessage(
              err,
              "Không thể cập nhật thông tin cá nhân.",
            ),
          );
        },
      },
    );
  };

  return (
    <section className="rounded-panel border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h3 text-ink">Thông tin cá nhân</h2>
          <p className="mt-1 text-small text-ink-2">
            Cập nhật thông tin liên hệ và các nội dung bổ sung cho hồ sơ ứng tuyển.
          </p>
        </div>
        <UserRound className="h-5 w-5 text-brand-600" aria-hidden="true" />
      </div>

      <form
        className="mt-5 grid gap-4 md:grid-cols-2"
        noValidate
        onSubmit={personalForm.handleSubmit(handleSubmit)}
      >
        <div className="md:col-span-2">
          <Input
            id="student-display-name"
            label="Tên hiển thị trên hồ sơ"
            placeholder={profile.originalFullName || profile.fullName}
            maxLength={150}
            disabled={isSuspended || isPending}
            error={personalForm.formState.errors.displayName?.message}
            helperText={`Để trống để hiển thị theo họ tên gốc AGU (${profile.originalFullName || profile.fullName}).`}
            {...personalForm.register("displayName")}
          />
        </div>

        <Input
          id="student-phone"
          type="tel"
          label="Số điện thoại"
          placeholder="VD: 0912345678"
          maxLength={30}
          disabled={isSuspended || isPending}
          error={personalForm.formState.errors.phone?.message}
          {...personalForm.register("phone")}
        />

        <Input
          id="student-dob"
          type="date"
          label="Ngày sinh"
          disabled={isSuspended || isPending}
          error={personalForm.formState.errors.dateOfBirth?.message}
          {...personalForm.register("dateOfBirth")}
        />

        <div className="flex flex-col gap-1.5">
          <label
            className="text-small font-medium text-ink"
            htmlFor="student-gender"
          >
            Giới tính
          </label>
          <select
            id="student-gender"
            disabled={isSuspended || isPending}
            className="h-11 w-full rounded-input border-2 border-line-strong bg-surface px-3.5 text-body text-ink transition-all duration-150 hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-3"
            {...personalForm.register("gender")}
          >
            <option value="">Chưa cập nhật</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <Input
          id="student-gpa"
          type="number"
          min="0"
          max="4"
          step="0.01"
          label="GPA tích lũy (Thang 4.00)"
          placeholder="VD: 3.50"
          disabled={isSuspended || isPending}
          error={personalForm.formState.errors.gpa?.message}
          {...personalForm.register("gpa")}
        />

        <div className="md:col-span-2">
          <Input
            id="student-address"
            label="Địa chỉ hiện tại"
            placeholder="VD: Phường Mỹ Xuyên, TP. Long Xuyên, An Giang"
            maxLength={255}
            disabled={isSuspended || isPending}
            error={personalForm.formState.errors.address?.message}
            {...personalForm.register("address")}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            id="student-bio"
            label="Giới thiệu & Mục tiêu nghề nghiệp"
            placeholder="Mô tả ngắn gọn định hướng nghề nghiệp, thế mạnh chuyên môn của bạn..."
            maxLength={2000}
            rows={4}
            disabled={isSuspended || isPending}
            error={personalForm.formState.errors.bio?.message}
            helperText={`${watchedBio.length}/2000 ký tự`}
            {...personalForm.register("bio")}
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button
            type="submit"
            size="sm"
            isLoading={isPending}
            disabled={isSuspended || isPending}
            className="text-white hover:text-white"
          >
            <Save className="h-4 w-4 text-white" />
            <span className="text-white">Lưu thay đổi</span>
          </Button>
        </div>
      </form>
    </section>
  );
}
