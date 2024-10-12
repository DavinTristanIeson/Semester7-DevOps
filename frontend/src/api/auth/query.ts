import { ApiQueryFunction } from "@/common/api/fetch-types";
import { UserModel } from "./model";
import { ApiResult } from "@/common/api/model";
import { useQuery } from "@tanstack/react-query";
import { AUTH_KEY } from "@/common/api/constants";
import { ApiFetch } from "@/common/api/fetch";
import { StaleTimes } from "../common/query";
import { meClient } from "@/common/api/ky-client";

// Handles auth state
export const useGetMe: ApiQueryFunction<never, ApiResult<UserModel>> = function (options) {
  return useQuery({
    staleTime: StaleTimes.Medium,
    ...options,
    queryKey: AUTH_KEY,
    queryFn() {
      return ApiFetch({
        classType: UserModel,
        url: 'auth/me',
        method: 'get',
        client: meClient,
      });
    },
  });
}