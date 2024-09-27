import { ApiQueryFunction } from "@/common/api/fetch-types";
import { UserModel } from "./model";
import { ApiResult } from "@/common/api/model";
import { useQuery } from "@tanstack/react-query";
import { GET_ME_KEY, KY_BASE_CONFIG } from "@/common/api/constants";
import { ApiFetch } from "@/common/api/fetch";
import ky from "ky";

// Handles auth state
const meClient = ky.create(KY_BASE_CONFIG);
export const useGetMe: ApiQueryFunction<never, ApiResult<UserModel>> = function (options) {
  return useQuery({
    ...options,
    queryKey: GET_ME_KEY,
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