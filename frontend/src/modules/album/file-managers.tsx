import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Camera, Upload, X } from "@phosphor-icons/react";
import Text from "@/components/standard/text";
import { Group, SimpleGrid } from "@mantine/core";
import { useUploadAlbumFiles } from "@/api/album";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import Colors from "@/common/constants/colors";
import Button from "@/components/standard/button/base";
import { handleErrorFn } from "@/common/utils/form";
import React from "react";
import Image from "next/image";

export function AlbumUploadFileManager() {
  const { mutateAsync: uploadFiles, isLoading: uploadLoading } =
    useUploadAlbumFiles();
  const [files, setFiles] = React.useState<File[]>([]);
  const id = useRouter().query.id as string;

  const filePreviews = files.slice(8).map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt={file.name}
        layout="fill"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });
  return (
    <div className="p-4">
      <Dropzone
        onDrop={setFiles}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * Math.pow(1024, 2)}
      >
        <Group
          justify="center"
          gap="xl"
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

          <SimpleGrid
            cols={{ base: 1, sm: 4 }}
            mt={filePreviews.length > 0 ? "xl" : 0}
          >
            {filePreviews}
          </SimpleGrid>
        </Group>
      </Dropzone>

      <Button
        mt={16}
        onClick={handleErrorFn(async () => {
          const res = await uploadFiles({
            files,
            id,
          });
          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.sentimentInfo,
            });
          }
        })}
        loading={uploadLoading}
        disabled={files.length === 0}
      >
        Upload Selected Files
      </Button>
    </div>
  );
}
