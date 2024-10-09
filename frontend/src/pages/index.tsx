import HomeStyles from "@/modules/dashboard/dashboard.module.css";
import { useGetAlbums } from "@/api/album";
import { UseQueryWrapperComponent } from "@/components/utility/fetch-wrapper";
import PullRefresh from "@/components/utility/pull-refresh";
import { AlbumCard } from "@/modules/dashboard/components/album";
import AppLayout from "@/components/layout/app";
import DashboardNavigationBar from "@/components/layout/navbar";

export default function DashboardPage() {
  const query = useGetAlbums();

  return (
    <AppLayout Header={<DashboardNavigationBar />}>
      <UseQueryWrapperComponent query={query}>
        <PullRefresh onRefresh={query.refetch} isLoading={query.isFetching}>
          <div className={HomeStyles["gallery"]}>
            {query.data?.data.map((album) => (
              <AlbumCard album={album} />
            ))}
          </div>
        </PullRefresh>
      </UseQueryWrapperComponent>
    </AppLayout>
  );
}
