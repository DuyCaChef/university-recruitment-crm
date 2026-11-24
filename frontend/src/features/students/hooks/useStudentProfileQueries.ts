import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentProfileApi } from "../api/studentProfileApi";
import type { ExperiencePayload, ProjectPayload, SkillPayload } from "../types";

export const STUDENT_PROFILE_QUERY_KEYS = {
  profile: ["student-profile"] as const,
  skills: ["student-skills"] as const,
  experiences: ["student-experiences"] as const,
  projects: ["student-projects"] as const,
  cvs: ["student-cvs"] as const,
};

export function useStudentProfileQueries() {
  const queryClient = useQueryClient();

  // ── Queries ────────────────────────────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
    queryFn: studentProfileApi.getProfile,
  });

  const skillsQuery = useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEYS.skills,
    queryFn: studentProfileApi.getSkills,
  });

  const experiencesQuery = useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEYS.experiences,
    queryFn: studentProfileApi.getExperiences,
  });

  const projectsQuery = useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEYS.projects,
    queryFn: studentProfileApi.getProjects,
  });

  const cvsQuery = useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEYS.cvs,
    queryFn: studentProfileApi.getCvs,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const uploadAvatarMutation = useMutation({
    mutationFn: studentProfileApi.uploadAvatar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
      });
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: studentProfileApi.deleteAvatar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
      });
    },
  });

  const profileMutation = useMutation({
    mutationFn: studentProfileApi.updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
      });
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: studentProfileApi.updateVisibility,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
      });
    },
  });

  const saveSkillMutation = useMutation({
    mutationFn: async (params: { id?: string; payload: SkillPayload }) => {
      if (params.id) {
        return studentProfileApi.updateSkill(params.id, params.payload);
      }
      return studentProfileApi.createSkill(params.payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.skills,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: studentProfileApi.deleteSkill,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.skills,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const saveExperienceMutation = useMutation({
    mutationFn: async (params: { id?: string; payload: ExperiencePayload }) => {
      if (params.id) {
        return studentProfileApi.updateExperience(params.id, params.payload);
      }
      return studentProfileApi.createExperience(params.payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.experiences,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: studentProfileApi.deleteExperience,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.experiences,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (params: { id?: string; payload: ProjectPayload }) => {
      if (params.id) {
        return studentProfileApi.updateProject(params.id, params.payload);
      }
      return studentProfileApi.createProject(params.payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.projects,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: studentProfileApi.deleteProject,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.projects,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const cvUploadMutation = useMutation({
    mutationFn: (params: { title: string; isDefault: boolean; file: File }) =>
      studentProfileApi.uploadCv(params.title, params.isDefault, params.file),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.cvs,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  const cvDefaultMutation = useMutation({
    mutationFn: studentProfileApi.setDefaultCv,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.cvs,
      });
    },
  });

  const cvRenameMutation = useMutation({
    mutationFn: (params: { id: string; title: string }) =>
      studentProfileApi.updateCvTitle(params.id, params.title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STUDENT_PROFILE_QUERY_KEYS.cvs,
      });
    },
  });

  const cvDeleteMutation = useMutation({
    mutationFn: studentProfileApi.deleteCv,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.cvs,
        }),
        queryClient.invalidateQueries({
          queryKey: STUDENT_PROFILE_QUERY_KEYS.profile,
        }),
      ]);
    },
  });

  return {
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
  };
}
