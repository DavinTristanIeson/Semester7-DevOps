import { useQuery } from "@tanstack/react-query";
import { AlbumModel } from "./model";
import { ApiFetch } from "@/common/api/fetch";
import { ApiQueryFunction } from "@/common/api/fetch-types";
import { IdInput, PaginatedInput } from "../common/model";
import { PaginatedApiResult } from "@/common/api/model";

export const AlbumQueryKeys = {
  listKey: 'getAlbums',
  list() {
    return [AlbumQueryKeys.listKey];
  },
  detailKey: 'getAlbum',
  detail(input: IdInput) {
    return [AlbumQueryKeys.detailKey, input.id];
  }
}

const ENDPOINT = 'albums';

export const useGetAlbums: ApiQueryFunction<PaginatedInput, PaginatedApiResult<AlbumModel>> = function (input, options) {
  return useQuery({
    ...options,
    queryKey: AlbumQueryKeys.list(),
    queryFn() {
      return ApiFetch({
        params: input,
        classType: AlbumModel,
        method: 'get',
        url: ENDPOINT,
      })
    },
  });
}

export const useGetAlbum: ApiQueryFunction<IdInput, AlbumModel> = function (input, options) {
  return useQuery({
    ...options,
    queryKey: AlbumQueryKeys.detail(input),
    queryFn() {
      return ApiFetch({
        classType: AlbumModel,
        method: 'get',
        url: `${ENDPOINT}/${input.id}`,
      })
    },
  });
}