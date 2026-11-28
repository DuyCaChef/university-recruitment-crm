import { useQuery } from "@tanstack/react-query";
import { careerProfilesApi } from "../api/careerProfilesApi";

// hook lấy thông tin chi tiết hồ sơ nghề nghiệp của sinh viên dựa trên studentId
export function useCareerProfileDetailQuery(studentId?: string) {
  return useQuery({
    queryKey: ["career-profile-detail", studentId] as const,
    queryFn: () => careerProfilesApi.getPublicCareerProfile(studentId ?? ""),
    enabled: Boolean(studentId),
    retry: false,
  });
}
