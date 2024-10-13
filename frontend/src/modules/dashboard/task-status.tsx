import { ExpressionRecognitionTaskStatus, useGetTask } from "@/api/task";
import { useTaskContext } from "./components/context";
import { Alert, Flex, Loader } from "@mantine/core";
import Colors from "@/common/constants/colors";
import {
  ArrowClockwise,
  CheckCircle,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import Text from "@/components/standard/text";
import React from "react";
import Button from "@/components/standard/button/base";
import { usePolling } from "@/hooks/polling";
import { showNotification } from "@mantine/notifications";

export default function ExpressionRecognitionTaskStatusComponent() {
  const { taskId } = useTaskContext();
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

  usePolling({
    fn() {
      refetch();
      showNotification({
        message: "Refetching status...",
      });
    },
    interval: 1000,
    limit(constraint) {
      return status.current === ExpressionRecognitionTaskStatus.Success;
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
      message =
        "Oh no, an unexpected error has occurred while processing your images. See below for details";
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
              {message}
            </Text>
          </Flex>
        </Alert>
      </Flex>
      {data?.data.error && (
        <Alert color={Colors.sentimentError} mt={16}>
          <Flex direction="row" align="center">
            <Warning />
            <Text wrap w="100%">
              {data.data.error}
            </Text>
          </Flex>
        </Alert>
      )}
    </div>
  );
}
