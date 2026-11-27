import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  careerProfilesApi,
  normalizeCareerProfileSearchParams,
} from "../api/careerProfilesApi";
import type { CareerProfileSearchParams } from "../types";

export function useCareerProfilesQuery(params?: CareerProfileSearchParams) {
  const normalizedParams = normalizeCareerProfileSearchParams(params);

  return useQuery({
    queryKey: ["career-profiles", normalizedParams] as const,
    queryFn: () =>
      careerProfilesApi.searchPublicCareerProfiles(normalizedParams),
    placeholderData: keepPreviousData,
  });
}
