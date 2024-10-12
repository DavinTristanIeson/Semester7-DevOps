import { ExpressionRecognitionTaskStatus, useGetTask } from "@/api/task";
import { useTaskContext } from "./components/context";
import { Alert, Flex, Loader } from "@mantine/core";
import Colors from "@/common/constants/colors";
import {
  ArrowClockwise,
  CheckCircle,
  Warning,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import Text from "@/components/standard/text";
import React from "react";
import Button from "@/components/standard/button/base";

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

  if (!data) {
    return null;
  }

  let color: string, message: string, indicator: React.ReactNode;
  switch (data.data.status) {
    case ExpressionRecognitionTaskStatus.NotStarted:
      color = Colors.sentimentWarning;
      indicator = <Loader size={24} />;
      message =
        "Your images are still waiting in queue. Please wait for a few seconds.";
    case ExpressionRecognitionTaskStatus.Pending:
      color = Colors.sentimentWarning;
      indicator = <Loader size={24} />;
      message =
        "Your images are currently being processed by our algorithms...";
    case ExpressionRecognitionTaskStatus.Success:
      color = Colors.sentimentWarning;
      indicator = <CheckCircle size={24} />;
      message =
        "Your images have been processed successfully! Feel free to look at the results below.";
    case ExpressionRecognitionTaskStatus.Failed:
      color = Colors.sentimentWarning;
      indicator = <XCircle size={24} />;
      message =
        "Oh no, an unexpected error has occurred while processing your images. See below for details";
  }

  return (
    <div>
      <Flex gap={8} direction="row" align="start">
        <Alert color={color}>
          <Flex>
            {indicator}
            <Text wrap w="100%">
              {message}
            </Text>
          </Flex>
        </Alert>
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
      </Flex>
      {data.data.error && (
        <Alert color={Colors.sentimentError} mt={16}>
          <Flex direction="row" align="center">
            <Warning />
            <Text wrap w="100%">
              {data.data.error}
            </Text>
          </Flex>
        </Alert>
      )}
      <Alert color={Colors.sentimentWarning} my={16} radius="lg" mt={16}>
        <Flex gap={8} pb={4} align="center">
          <WarningCircle size={24} />
          <Text wrap>
            To preserve the privacy of your photos, we will only store your
            images temporarily. Any images (as well as the results from our
            analysis) will be removed after you close your browser.
          </Text>
        </Flex>
      </Alert>
    </div>
  );
}
