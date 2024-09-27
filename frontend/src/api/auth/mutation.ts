import { ApiMutationFunction } from "@/common/api/fetch-types";
import { useMutation } from "@tanstack/react-query";
import { LoginInput, RegisterInput, UserModel } from "./model";
import { ApiResult } from "@/common/api/model";
import { ApiFetch } from "@/common/api/fetch";
import { queryClient } from "@/common/api/query-client";
import { GET_ME_KEY } from "@/common/api/constants";

export const useLogin: ApiMutationFunction<LoginInput, ApiResult<UserModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: UserModel,
        url: 'auth/login',
        body,
        method: 'post',
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [GET_ME_KEY]
      });
    },
  });
}

export const useRegister: ApiMutationFunction<RegisterInput, ApiResult<UserModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: UserModel,
        url: 'auth/register',
        body,
        method: 'post',
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [GET_ME_KEY]
      });
    },
  });
}

export const useLogout: ApiMutationFunction<never, ApiResult<never>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: UserModel,
        url: 'auth/logout',
        body,
        method: 'post',
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [GET_ME_KEY]
      });
    },
  });
}