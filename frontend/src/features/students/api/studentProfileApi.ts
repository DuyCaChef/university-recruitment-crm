import { axiosClient } from "@/shared/api/axiosClient";
import type {
  ExperiencePayload,
  ProjectPayload,
  SkillPayload,
  StudentCv,
  StudentExperience,
  StudentProfile,
  StudentProject,
  StudentSkill,
  UpdateProfilePayload,
  UploadAvatarResponse,
} from "../types";

export type {
  ExperiencePayload,
  ProjectPayload,
  SkillPayload,
  StudentCv,
  StudentExperience,
  StudentProfile,
  StudentProject,
  StudentSkill,
  UpdateProfilePayload,
  UploadAvatarResponse,
} from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function unwrapData<T>(raw: unknown): T {
  let current: unknown = raw;

  // AxiosResponse -> response.data
  if (
    isRecord(current) &&
    "data" in current &&
    "headers" in current &&
    "config" in current
  ) {
    current = current.data;
  }

  // Backend envelope -> envelope.data
  if (
    isRecord(current) &&
    "statusCode" in current &&
    "message" in current &&
    "data" in current
  ) {
    current = current.data;
  }

  return current as T;
}

export const studentProfileApi = {
  // 1. Hồ sơ cá nhân, hiển thị công khai & ảnh đại diện
  getProfile: async (): Promise<StudentProfile> => {
    const raw: unknown = await axiosClient.get("/students/me");
    return unwrapData<StudentProfile>(raw);
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<Partial<StudentProfile>> => {
    const raw: unknown = await axiosClient.patch("/students/me", payload);
    return unwrapData<Partial<StudentProfile>>(raw);
  },

  updateVisibility: async (visibility: boolean): Promise<void> => {
    await axiosClient.patch("/students/me/visibility", {
      visibility,
    });
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const form = new FormData();
    form.append("file", file);
    const raw: unknown = await axiosClient.post("/students/me/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapData<UploadAvatarResponse>(raw);
  },

  deleteAvatar: async (): Promise<{ avatarUrl: null }> => {
    const raw: unknown = await axiosClient.delete("/students/me/avatar");
    return unwrapData<{ avatarUrl: null }>(raw);
  },

  // 2. Kỹ năng chuyên môn
  getSkills: async (): Promise<StudentSkill[]> => {
    const raw: unknown = await axiosClient.get("/students/me/skills");
    return unwrapData<StudentSkill[]>(raw);
  },

  createSkill: async (payload: SkillPayload): Promise<StudentSkill> => {
    const raw: unknown = await axiosClient.post("/students/me/skills", payload);
    return unwrapData<StudentSkill>(raw);
  },

  updateSkill: async (
    id: string,
    payload: Partial<SkillPayload>,
  ): Promise<StudentSkill> => {
    const raw: unknown = await axiosClient.patch(
      `/students/me/skills/${id}`,
      payload,
    );
    return unwrapData<StudentSkill>(raw);
  },

  deleteSkill: async (id: string): Promise<void> => {
    await axiosClient.delete(`/students/me/skills/${id}`);
  },

  // 3. Kinh nghiệm làm việc / Thực tập
  getExperiences: async (): Promise<StudentExperience[]> => {
    const raw: unknown = await axiosClient.get("/students/me/experiences");
    return unwrapData<StudentExperience[]>(raw);
  },

  createExperience: async (
    payload: ExperiencePayload,
  ): Promise<StudentExperience> => {
    const raw: unknown = await axiosClient.post(
      "/students/me/experiences",
      payload,
    );
    return unwrapData<StudentExperience>(raw);
  },

  updateExperience: async (
    id: string,
    payload: Partial<ExperiencePayload>,
  ): Promise<StudentExperience> => {
    const raw: unknown = await axiosClient.patch(
      `/students/me/experiences/${id}`,
      payload,
    );
    return unwrapData<StudentExperience>(raw);
  },

  deleteExperience: async (id: string): Promise<void> => {
    await axiosClient.delete(`/students/me/experiences/${id}`);
  },

  // 4. Dự án / Đề tài cá nhân
  getProjects: async (): Promise<StudentProject[]> => {
    const raw: unknown = await axiosClient.get("/students/me/projects");
    return unwrapData<StudentProject[]>(raw);
  },

  createProject: async (payload: ProjectPayload): Promise<StudentProject> => {
    const raw: unknown = await axiosClient.post(
      "/students/me/projects",
      payload,
    );
    return unwrapData<StudentProject>(raw);
  },

  updateProject: async (
    id: string,
    payload: Partial<ProjectPayload>,
  ): Promise<StudentProject> => {
    const raw: unknown = await axiosClient.patch(
      `/students/me/projects/${id}`,
      payload,
    );
    return unwrapData<StudentProject>(raw);
  },

  deleteProject: async (id: string): Promise<void> => {
    await axiosClient.delete(`/students/me/projects/${id}`);
  },

  // 5. Quản lý đa bản CV
  getCvs: async (): Promise<StudentCv[]> => {
    const raw: unknown = await axiosClient.get("/students/me/cvs");
    return unwrapData<StudentCv[]>(raw);
  },

  uploadCv: async (
    title: string,
    isDefault: boolean,
    file: File,
  ): Promise<StudentCv> => {
    const form = new FormData();
    form.append("title", title.trim());
    form.append("isDefault", String(isDefault));
    form.append("file", file);

    const raw: unknown = await axiosClient.post("/students/me/cvs", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapData<StudentCv>(raw);
  },

  setDefaultCv: async (id: string): Promise<void> => {
    await axiosClient.patch(`/students/me/cvs/${id}/default`);
  },

  updateCvTitle: async (id: string, title: string): Promise<void> => {
    await axiosClient.patch(`/students/me/cvs/${id}`, { title: title.trim() });
  },

  deleteCv: async (id: string): Promise<void> => {
    await axiosClient.delete(`/students/me/cvs/${id}`);
  },

  getCvDownloadUrl: async (id: string): Promise<{ url: string }> => {
    const raw: unknown = await axiosClient.get(
      `/students/me/cvs/${id}/download-url`,
    );
    const data = unwrapData<{
      url?: string | null;
      downloadUrl?: string | null;
    } | null>(raw);
    return { url: data?.downloadUrl ?? data?.url ?? "" };
  },
};
