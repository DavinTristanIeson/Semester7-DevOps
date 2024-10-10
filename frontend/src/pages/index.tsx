import HomeStyles from "@/modules/dashboard/dashboard.module.css";
import { useGetAlbums } from "@/api/album";
import { UseQueryWrapperComponent } from "@/components/utility/fetch-wrapper";
import PullRefresh from "@/components/utility/pull-refresh";
import { AlbumCard } from "@/modules/dashboard/components/album";
import AppLayout from "@/components/layout/app";
import DashboardNavigationBar from "@/components/layout/navbar";
import Pagination, {
  usePaginationSetup,
} from "@/components/standard/pagination";
import { Alert, Flex, Text } from "@mantine/core";
import Colors from "@/common/constants/colors";
import Button from "@/components/standard/button/base";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";

export default function DashboardPage() {
  const pagination = usePaginationSetup();
  const query = useGetAlbums({
    page: pagination.page,
    size: pagination.size,
  });
  const router = useRouter();

  return (
    <AppLayout Header={<DashboardNavigationBar />}>
      <Flex direction="row-reverse" w="100%" p={16} gap={8}>
        <Button
          onClick={() => {
            router.push(NavigationRoutes.AlbumCreate);
          }}
        >
          Create Album
        </Button>
        <Button
          variant="outline"
          onClick={() => query.refetch()}
          loading={query.isRefetching}
        >
          Refresh
        </Button>
      </Flex>
      <UseQueryWrapperComponent query={query}>
        {({ data, ...meta }) => (
          <>
            {data.length === 0 && (
              <Flex w="100%" justify="center" px={16}>
                <Alert color={Colors.sentimentWarning} maw="500px" p={16}>
                  Looks like you don't have any albums. Why don't you go ahead
                  and create one right now from the{" "}
                  <Text fw="bold" span>
                    button
                  </Text>{" "}
                  above?
                </Alert>
              </Flex>
            )}
            <div className={HomeStyles["gallery"]}>
              {data.map((album) => (
                <AlbumCard album={album} />
              ))}
            </div>
            <Pagination {...pagination} meta={meta} />
          </>
        )}
      </UseQueryWrapperComponent>
    </AppLayout>
  );
}
