export type CapabilityTab = "skills" | "experiences" | "projects";

export type ProjectDomainKey =
  | "tech"
  | "economics"
  | "language"
  | "agri"
  | "general";

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

export interface ConfirmDeleteTarget {
  type: "skill" | "experience" | "project" | "cv" | "avatar";
  id: string;
  label: string;
  isDefaultCv?: boolean;
}
