import {
  ToggleDispatcher,
  useSetupToggleDispatcher,
} from "@/hooks/dispatch-action";
import { Alert, Flex, Modal } from "@mantine/core";
import React from "react";
import AlbumForm from "./form";
import { useCreateAlbum, useUpdateAlbum } from "@/api/album";
import { showNotification } from "@mantine/notifications";
import Colors from "@/common/constants/colors";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import { Info, WarningCircle } from "@phosphor-icons/react";

interface CreateAlbumModalProps {
  id?: string;
}

const CreateAlbumModal = React.forwardRef<
  ToggleDispatcher | undefined,
  CreateAlbumModalProps
>(function (props, ref) {
  const [opened, setOpened] = useSetupToggleDispatcher(ref);
  const { mutateAsync: createAlbum } = useCreateAlbum();
  const { mutateAsync: updateAlbum } = useUpdateAlbum();
  const router = useRouter();
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      size="lg"
      title={props.id == null ? "Create Album" : "Update Album"}
    >
      {props.id == null && (
        <Alert color={Colors.sentimentWarning} my={16}>
          <Flex gap={8} pb={4}>
            <WarningCircle size={24} />
            This album will be removed after thirty days of inactivity (e.g.:
            viewing, uploading, downloading).
          </Flex>
        </Alert>
      )}
      <AlbumForm
        onSubmit={async (values) => {
          const res = props.id
            ? await updateAlbum({ id: props.id, body: values })
            : await createAlbum(values);

          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.sentimentInfo,
            });
          }

          if (!props.id) {
            router.push({
              pathname: NavigationRoutes.AlbumView,
              query: {
                id: res.data.id,
              },
            });
          }
        }}
      />
    </Modal>
  );
});

export default CreateAlbumModal;
