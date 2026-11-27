export interface PublicSkill {
  skillName: string;
  proficiency: string | null;
}

export interface PublicExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface PublicProject {
  name: string;
  description: string | null;
  role: string | null;
  technologies: string | null;
  projectUrl: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface PublicCareerProfile {
  studentId: string;
  fullName: string;
  avatarUrl: string | null;
  major: string;
  faculty: string | null;
  academicYear: number | null;
  bio: string | null;
  skills: PublicSkill[];
  experiences: PublicExperience[];
  projects: PublicProject[];
}

export interface CareerProfileSearchParams {
  major?: string;
  skill?: string;
}

export interface CareerProfileListResponse {
  total: number;
  items: PublicCareerProfile[];
}
