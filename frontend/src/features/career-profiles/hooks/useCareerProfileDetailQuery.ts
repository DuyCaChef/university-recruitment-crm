import { useQuery } from "@tanstack/react-query";
import { careerProfilesApi } from "../api/careerProfilesApi";

export function useCareerProfileDetailQuery(studentId?: string) {
  return useQuery({
    queryKey: ["career-profile-detail", studentId] as const,
    queryFn: () => careerProfilesApi.getPublicCareerProfile(studentId ?? ""),
    enabled: Boolean(studentId),
    retry: false,
  });
}
