import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  Camera,
  ClockClockwise,
  Upload,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import Text from "@/components/standard/text";
import { Flex, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Colors from "@/common/constants/colors";
import Button from "@/components/standard/button/base";
import { handleErrorFn } from "@/common/utils/form";
import React from "react";
import { useCreateTask } from "@/api/task";
import { useTaskContext } from "./context";
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";

async function zipFiles(files: File[]): Promise<File> {
  const zipWriter = new ZipWriter(new BlobWriter());
  const promises = files.map(async (file) => {
    const reader = new BlobReader(file);
    return zipWriter.add(file.name, reader);
  });
  await Promise.all(promises);
  const data = await zipWriter.close();
  if (zipWriter.hasCorruptedEntries) {
    throw new Error(
      "Some of the files has been corrupted and cannot be gathered into a zip file!"
    );
  }
  const zipfile = new File([data], `${Date.now().toString(16)}.zip`);
  return zipfile;
}

function useTaskFilesUpload(
  stagedFiles: File[],
  setStagedFiles: React.Dispatch<React.SetStateAction<File[]>>
) {
  const { mutateAsync: createTask, isPending } = useCreateTask();
  const { setStagedFiles: setFiles, setTaskId, files } = useTaskContext();
  const onUpload = handleErrorFn(async () => {
    const zipfile = await zipFiles(stagedFiles);
    const res = await createTask({
      file: zipfile,
    });
    if (res.message) {
      showNotification({
        message: res.message,
        color: Colors.sentimentInfo,
      });
    }
    setTaskId(res.data.id);
    setFiles(stagedFiles);
    setStagedFiles([]);
  });
  const onReupload = handleErrorFn(async () => {
    const zipfile = await zipFiles(files.map((file) => file.file));
    const res = await createTask({
      file: zipfile,
    });
    if (res.message) {
      showNotification({
        message: res.message,
        color: Colors.sentimentInfo,
      });
    }
    setTaskId(res.data.id);
    setStagedFiles([]);
  });
  return { onUpload, isPending, onReupload, canReupload: files.length > 0 };
}

export function TaskFileUploadManager() {
  const [stagedFiles, setStagedFiles] = React.useState<File[]>([]);
  const { onUpload, canReupload, onReupload, isPending } = useTaskFilesUpload(
    stagedFiles,
    setStagedFiles
  );

  const filePreviews = React.useMemo(() => {
    return stagedFiles.map((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={imageUrl}
          alt={file.name}
          style={{
            maxHeight: 96,
          }}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      );
    });
  }, [stagedFiles]);

  return (
    <div className="p-4">
      <Dropzone
        onDrop={setStagedFiles}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * Math.pow(1024, 2)}
        radius="xl"
      >
        <Group
          justify="center"
          gap="xl"
          w="100%"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <Upload size={52} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <X size={52} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Camera size={52} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
        {filePreviews.length > 0 && (
          <Flex gap={8} pb={4} align="center" justify="center">
            <WarningCircle size={24} />
            <Text wrap>
              To preserve the privacy of your photos, we will only store your
              images temporarily. Any images (as well as the results from our
              analysis) will be removed after you close your browser.
            </Text>
          </Flex>
        )}
        <Flex align="center" direction="row" wrap="wrap">
          {filePreviews}
        </Flex>
      </Dropzone>

      <Flex direction="row-reverse" w="100%" mt={16} gap={16}>
        {canReupload && (
          <Button
            variant="outline"
            loading={isPending}
            leftSection={<ClockClockwise />}
            color={Colors.backgroundPrimary}
            onClick={onReupload}
          >
            Re-Upload Previous Files
          </Button>
        )}
        <Button
          onClick={onUpload}
          loading={isPending}
          disabled={stagedFiles.length === 0}
        >
          Upload Selected Files
        </Button>
      </Flex>
    </div>
  );
}
