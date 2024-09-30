import { ApiQueryFunction } from "@/common/api/fetch-types";
import { UserModel } from "./model";
import { ApiResult } from "@/common/api/model";
import { useQuery } from "@tanstack/react-query";
import { AUTH_KEY, KY_BASE_CONFIG } from "@/common/api/constants";
import { ApiFetch } from "@/common/api/fetch";
import ky from "ky";
import { KyClientHooks } from "@/common/api/ky-hooks";
import { StaleTimes } from "../common/query";

// Handles auth state
const meClient = ky.create({
  ...KY_BASE_CONFIG,
  hooks: {
    beforeRequest: [KyClientHooks.setupAuthorization]
  }
});
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