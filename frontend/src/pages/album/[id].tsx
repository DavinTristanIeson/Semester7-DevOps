import { Button, FileInput, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";

export default function AlbumViewPage() {
  const router = useRouter();
  return (
    <div>
      <Title order={1}>Album View {router.query.id}</Title>
      <Flex align="center" direction="row">
        <FileInput label="Album Files" multiple />
        <Button>Upload</Button>
      </Flex>
    </div>
  );
}
