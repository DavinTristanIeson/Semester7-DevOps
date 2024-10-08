import { ApiMutationFunction } from "@/common/api/fetch-types";
import { AlbumModel, AlbumMutationInput } from "./model";
import { useMutation } from "@tanstack/react-query";
import { ApiFetch } from "@/common/api/fetch";
import { IdInput, UpdateInput } from "../common/model";
import { ApiResult } from "@/common/api/model";
import { queryClient } from "@/common/api/query-client";
import { AlbumQueryKeys } from "./query";

const ENDPOINT = 'album';

export const useCreateAlbum: ApiMutationFunction<AlbumMutationInput, ApiResult<AlbumModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: AlbumModel,
        method: 'post',
        url: ENDPOINT,
        body,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [AlbumQueryKeys.listKey],
      });
    },
  });
}

export const useUpdateAlbum: ApiMutationFunction<UpdateInput<AlbumMutationInput>, ApiResult<AlbumModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: AlbumModel,
        method: 'put',
        url: `${ENDPOINT}/${body.id}`,
        body: body.body,
      });
    },
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: [AlbumQueryKeys.listKey],
      });
      queryClient.invalidateQueries({
        queryKey: AlbumQueryKeys.detail({
          id: variables.id,
        }),
      });
    },
  });
}

export const useDeleteAlbum: ApiMutationFunction<IdInput, ApiResult<never>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      return ApiFetch({
        classType: AlbumModel,
        method: 'delete',
        url: `${ENDPOINT}/${body.id}`,
        body,
      });
    },
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: [AlbumQueryKeys.listKey]
      })
      queryClient.removeQueries({
        queryKey: AlbumQueryKeys.detail({
          id: variables.id,
        }),
      });
    },
  });
}