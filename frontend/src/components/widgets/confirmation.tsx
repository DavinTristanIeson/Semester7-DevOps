import {
  ToggleDispatcher,
  useSetupToggleDispatcher,
} from "@/hooks/dispatch-action";
import { CheckIcon, Flex, Modal, Title } from "@mantine/core";
import React from "react";
import Text from "../standard/text";
import Button from "../standard/button/base";
import { TrashSimple, X } from "@phosphor-icons/react";
import Colors from "@/common/constants/colors";
import PromiseButton from "../standard/button/promise";

interface ConfirmationDialogProps {
  title?: React.ReactNode;
  message: React.ReactNode;
  icon?: React.ReactNode;
  onConfirm(): Promise<void>;
  dangerous?: boolean;
  positiveAction?: string;
}

const ConfirmationDialog = React.forwardRef<
  ToggleDispatcher | undefined,
  ConfirmationDialogProps
>(function ConfirmationDialog(props, ref) {
  const [opened, setOpened] = useSetupToggleDispatcher(ref);
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      title={
        <Title order={3} fw="bold">
          {props.title ?? "Confirmation"}
        </Title>
      }
    >
      <Text pb={16}>{props.message}</Text>
      <Flex direction="row-reverse" gap={8}>
        <PromiseButton
          variant="filled"
          leftSection={
            props.dangerous ? props.icon ?? <TrashSimple /> : <CheckIcon />
          }
          color={props.dangerous ? Colors.sentimentError : undefined}
          onClick={props.onConfirm}
        >
          {props.positiveAction ?? "Confirm"}
        </PromiseButton>
        <Button
          variant="outline"
          leftSection={<X />}
          onClick={() => setOpened(false)}
        >
          Cancel
        </Button>
      </Flex>
    </Modal>
  );
});

export default ConfirmationDialog;
