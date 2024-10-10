import { Box } from "@mantine/core";
import { useRouter } from "next/router";
import AlbumStyles from "@/modules/dashboard/dashboard.module.css";
import AppLayout from "@/components/layout/app";
import DashboardNavigationBar from "@/components/layout/navbar";
import { AlbumUploadFileManager } from "@/modules/album/file-managers";
import { UseQueryWrapperComponent } from "@/components/utility/fetch-wrapper";
import { useGetAlbum } from "@/api/album";
import Image from "next/image";

export default function AlbumViewPage() {
  const router = useRouter();
  const query = useGetAlbum({
    id: router.query.id as string,
  });
  return (
    <AppLayout Header={<DashboardNavigationBar back />}>
      <AlbumUploadFileManager />
      <UseQueryWrapperComponent query={query}>
        {(data) => (
          <>
            <Box className={AlbumStyles["gallery"]}></Box>
          </>
        )}
      </UseQueryWrapperComponent>
    </AppLayout>
  );
}
