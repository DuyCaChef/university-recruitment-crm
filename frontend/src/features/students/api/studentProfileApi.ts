// src/features/student-profile/api/studentProfileApi.ts
import { axiosClient } from "@/shared/api/axiosClient";

export interface StudentProfile {
  id: string;
  studentCode: string;
  fullName: string;
  originalFullName?: string;
  displayName: string | null;
  avatarUrl: string | null;
  institutionalEmail: string;
  major: string;
  faculty: string | null;
  academicYear: number | null;
  status: "ACTIVE" | "GRADUATED" | "SUSPENDED";
  phone: string | null;
  bio: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: "Nam" | "Nữ" | "Khác" | null;
  gpa: number | null;
  careerProfileVisibility: boolean;
  skillsCount: number;
  experiencesCount: number;
  projectsCount: number;
  cvsCount: number;
  updatedAt: string;
}

export interface StudentSkill {
  id: string;
  skillName: string;
  proficiency: string | null;
}

export interface StudentExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface StudentProject {
  id: string;
  name: string;
  role: string | null;
  technologies: string | null;
  projectUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface StudentCv {
  id: string;
  title: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  file: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  } | null;
}

export interface UpdateProfilePayload {
  displayName?: string | null;
  phone?: string | null;
  bio?: string | null;
  address?: string | null;
  gpa?: number | null;
  dateOfBirth?: string | null;
  gender?: "Nam" | "Nữ" | "Khác" | null;
}

export interface SkillPayload {
  skillName: string;
  proficiency?: string | null;
}

export interface ExperiencePayload {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface ProjectPayload {
  name: string;
  role?: string | null;
  technologies?: string | null;
  projectUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

export interface UploadAvatarResponse {
  avatarUrl: string | null;
  file: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
  };
}

/**
 * Interceptor trong axiosClient.ts đã trả về response.data tại runtime.
 * Hàm helper này bóc tách an toàn field `data` từ khung chuẩn { statusCode, message, data }.
 */
function unwrapData<T>(raw: unknown): T {
  let current: unknown = raw;

  // Lớp 1: Nếu là AxiosResponse (chứa headers, config, data) -> lấy response.data
  if (
    current !== null &&
    typeof current === "object" &&
    "data" in current &&
    "headers" in current &&
    "config" in current
  ) {
    current = (current as { data: unknown }).data;
  }

  // Lớp 2: Nếu là khung phản hồi chuẩn của Backend { statusCode, message, data } -> lấy envelope.data
  if (
    current !== null &&
    typeof current === "object" &&
    "data" in current &&
    (current as { data: unknown }).data !== undefined
  ) {
    current = (current as { data: unknown }).data;
  }

  return current as T;
}

export const studentProfileApi = {
  // 1. Hồ sơ cá nhân & học thuật
  getProfile: async (): Promise<StudentProfile> => {
    const raw: unknown = await axiosClient.get("/students/me");
    return unwrapData<StudentProfile>(raw);
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<StudentProfile> => {
    const raw: unknown = await axiosClient.patch("/students/me", payload);
    return unwrapData<StudentProfile>(raw);
  },

  updateVisibility: async (visibility: boolean): Promise<void> => {
    await axiosClient.patch("/students/me/visibility", {
      visibility,
    });
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

  // 4. Dự án cá nhân
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
    const data = unwrapData<{ url?: string; downloadUrl?: string }>(raw);
    return { url: data.downloadUrl ?? data.url ?? "" };
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
};