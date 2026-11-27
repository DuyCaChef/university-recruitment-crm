import { axiosClient } from "@/shared/api/axiosClient";
import type {
  CareerProfileListResponse,
  CareerProfileSearchParams,
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

export function normalizeCareerProfileSearchParams(
  params?: CareerProfileSearchParams,
): CareerProfileSearchParams {
  const trimmedMajor = params?.major?.trim();
  const trimmedSkill = params?.skill?.trim();

  return {
    major: trimmedMajor ? trimmedMajor : undefined,
    skill: trimmedSkill ? trimmedSkill : undefined,
  };
}

export const careerProfilesApi = {
  searchPublicCareerProfiles: async (
    params?: CareerProfileSearchParams,
  ): Promise<CareerProfileListResponse> => {
    const normalized = normalizeCareerProfileSearchParams(params);
    const raw: unknown = await axiosClient.get("/career-profiles", {
      params: normalized,
    });
    return unwrapData<CareerProfileListResponse>(raw);
  },
};
