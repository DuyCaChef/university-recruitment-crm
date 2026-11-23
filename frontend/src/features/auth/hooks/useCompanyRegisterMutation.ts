// src/features/auth/hooks/useCompanyRegisterMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerCompany, authKeys } from "../api/authApi";
import type {
  CompanyRegisterRequestPayload,
  CompanyRegisterResponseData,
} from "../types";

export interface UseCompanyRegisterMutationOptions {
  onSuccess?: (data: CompanyRegisterResponseData) => void;
  onError?: (error: Error) => void;
}

export const useCompanyRegisterMutation = (
  options?: UseCompanyRegisterMutationOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    CompanyRegisterResponseData,
    Error,
    CompanyRegisterRequestPayload
  >({
    mutationFn: registerCompany,
    onSuccess: (data) => {
      // Invalidate các query liên quan đến auth / company nếu có
      queryClient.invalidateQueries({ queryKey: authKeys.companyRegistration() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
