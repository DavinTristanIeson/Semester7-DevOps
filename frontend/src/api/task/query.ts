import { useQuery } from "@tanstack/react-query";
import { ApiFetch } from "@/common/api/fetch";
import { ApiQueryFunction } from "@/common/api/fetch-types";
import { IdInput, PaginatedInput } from "../common/model";
import { ApiResult, PaginatedApiResult } from "@/common/api/model";
import { ExpressionRecognitionTaskModel } from "./model";
import { StaleTimes } from "../common/query";

export const TaskQueryKeys = {
  taskKey: ['getTaskKey'],
  task(input: IdInput){
    return [TaskQueryKeys.taskKey, input.id];
  }
}

const ENDPOINT = 'tasks';

export const useGetTask: ApiQueryFunction<IdInput, ApiResult<ExpressionRecognitionTaskModel>> = function (input, options) {
  return useQuery({
    ...options,
    queryKey: TaskQueryKeys.task(input),
    queryFn() {
      return ApiFetch({
        classType: ExpressionRecognitionTaskModel,
        method: 'get',
        url: `${ENDPOINT}/${input.id}`,
      })
    },
    staleTime: StaleTimes.Medium,
  });
}
