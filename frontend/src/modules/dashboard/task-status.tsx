import { ExpressionRecognitionTaskStatus, useGetTask } from "@/api/task";
import { useTaskContext } from "./components/context";
import { Alert, Flex, Loader } from "@mantine/core";
import Colors from "@/common/constants/colors";
import { ArrowClockwise, CheckCircle, XCircle } from "@phosphor-icons/react";
import Text from "@/components/standard/text";
import React from "react";
import Button from "@/components/standard/button/base";
import { usePolling } from "@/hooks/polling";
import { categorize } from "@/common/utils/iterable";

export default function ExpressionRecognitionTaskStatusComponent() {
  const { taskId, setFiles } = useTaskContext();
  const { data, refetch, isRefetching } = useGetTask(
    {
      id: taskId as string,
    },
    {
      enabled: !!taskId,
    }
  );

  const status = React.useRef(ExpressionRecognitionTaskStatus.NotStarted);
  status.current = data?.data.status ?? ExpressionRecognitionTaskStatus.Success;

  React.useEffect(() => {
    if (
      data?.data.results == null ||
      data?.data.status !== ExpressionRecognitionTaskStatus.Success
    ) {
      return;
    }

    const resultMap = categorize(
      data.data.results,
      (result) => result.filename
    );
    setFiles((files) => {
      return files.map((file) => {
        return {
          ...file,
          results: resultMap[file.file.name],
        };
      });
    });
  }, [data?.data, setFiles]);

  usePolling({
    fn() {
      refetch();
    },
    interval: 3000,
    enabled: !!data?.data,
    key: taskId,
    limit() {
      return (
        status.current !== ExpressionRecognitionTaskStatus.Success &&
        status.current !== ExpressionRecognitionTaskStatus.Failed
      );
    },
  });

  if (!taskId) {
    return null;
  }

  let color: string, message: string, indicator: React.ReactNode;
  switch (data?.data.status ?? ExpressionRecognitionTaskStatus.NotStarted) {
    case ExpressionRecognitionTaskStatus.NotStarted:
      color = Colors.foregroundDull;
      indicator = <Loader size={24} />;
      message =
        "Your images are still waiting in queue. Please wait for a few seconds.";
      break;
    case ExpressionRecognitionTaskStatus.Pending:
      color = Colors.sentimentWarning;
      indicator = <Loader size={24} />;
      message =
        "Your images are currently being processed by our algorithms...";
      break;
    case ExpressionRecognitionTaskStatus.Success:
      color = Colors.sentimentSuccess;
      indicator = <CheckCircle size={24} />;
      message =
        "Your images have been processed successfully! Feel free to look at the results below.";
      break;
    case ExpressionRecognitionTaskStatus.Failed:
      color = Colors.sentimentError;
      indicator = <XCircle size={24} />;
      message = `Oh no, an unexpected error has occurred while processing your images. Please try again later.`;
      break;
  }

  return (
    <div>
      <Flex gap={8} direction="row" align="center">
        <Button
          variant="outline"
          leftSection={<ArrowClockwise size={16} />}
          onClick={() => {
            refetch();
          }}
          loading={isRefetching}
        >
          Refresh
        </Button>
        <Alert color={color} className="flex-1">
          <Flex gap={8}>
            {indicator}
            <Text wrap w="100%">
              {`${message} `}
              {data?.data.error && (
                <Text span fw="bold">
                  {data?.data.error}
                </Text>
              )}
            </Text>
          </Flex>
        </Alert>
      </Flex>
    </div>
  );
}
