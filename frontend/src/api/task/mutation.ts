import { ApiMutationFunction } from "@/common/api/fetch-types";
import { useMutation } from "@tanstack/react-query";
import { ApiFetch } from "@/common/api/fetch";
import { ApiResult } from "@/common/api/model";
import { queryClient } from "@/common/api/query-client";
import { TaskQueryKeys } from "./query";
import { CreateTaskInput, ExpressionRecognitionTaskModel } from "./model";

const ENDPOINT = 'tasks';

export const useCreateTask: ApiMutationFunction<CreateTaskInput, ApiResult<ExpressionRecognitionTaskModel>> = function (options) {
  return useMutation({
    ...options,
    mutationFn(body) {
      const formData = new FormData();
      formData.set("file", body.file);
      return ApiFetch({
        classType: ExpressionRecognitionTaskModel,
        method: 'post',
        url: ENDPOINT,
        body,
        formData
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [TaskQueryKeys.taskKey],
      });
    },
  });
}
