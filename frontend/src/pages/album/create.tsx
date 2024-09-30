import { useCreateAlbum } from "@/api/album/mutation";
import Colors from "@/common/constants/colors";
import AlbumForm from "@/modules/album/form";
import { Alert, Title } from "@mantine/core";

export default function AlbumCreatePage() {
  const { mutateAsync: createAlbum } = useCreateAlbum();
  return (
    <div>
      <Title order={1}>Album Create</Title>
      <Alert color={Colors.Sentiment.Warning} my={16}>
        This album will be removed after thirty days of inactivity (e.g.:
        viewing, uploading, downloading).
      </Alert>
      <AlbumForm
        onSubmit={async (values) => {
          await createAlbum(values);
          console.log(values);
        }}
      />
    </div>
  );
}
