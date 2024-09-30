import { ApiMutationFunction } from "@/common/api/fetch-types";
import { useMutation } from "@tanstack/react-query";
import { LoginInput, RegisterInput, UserModel } from "./model";
import { ApiResult } from "@/common/api/model";
import { ApiFetch } from "@/common/api/fetch";
import { queryClient } from "@/common/api/query-client";
import { AUTH_KEY } from "@/common/api/constants";
import { SessionTokenModel } from "@/common/auth/api";
import { SessionToken } from "@/common/auth/token";

const ENDPOINT = 'auth';
export const useLogin: ApiMutationFunction<LoginInput, ApiResult<SessionTokenModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: SessionTokenModel,
        url: `${ENDPOINT}/login`,
        body,
        method: 'post',
      });
    },
    onSuccess(data) {
      SessionToken.set(data.data);
      queryClient.refetchQueries({
        queryKey: AUTH_KEY
      });
    },
  });
}

export const useRegister: ApiMutationFunction<RegisterInput, ApiResult<SessionTokenModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: SessionTokenModel,
        url: `${ENDPOINT}/register`,
        body,
        method: 'post',
      });
    },
    onSuccess(data) {
      SessionToken.set(data.data);
      queryClient.refetchQueries({
        queryKey: AUTH_KEY
      });
    },
  });
}

export const useLogout: ApiMutationFunction<void, ApiResult<never>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      const sessionToken = SessionToken.get();
      return ApiFetch({
        classType: UserModel,
        url: `${ENDPOINT}/logout`,
        body: {
          refreshToken: sessionToken?.refreshToken,
        },
        method: 'post',
      });
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: AUTH_KEY
      });
    },
  });
}