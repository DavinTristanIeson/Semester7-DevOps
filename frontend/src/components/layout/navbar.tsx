import { Box, Button, Title } from "@mantine/core";
import LayoutStyles from "./layout.module.css";
import { handleErrorFn } from "@/common/utils/form";
import { useLogout } from "@/api/auth";
import { showNotification } from "@mantine/notifications";
import Colors from "@/common/constants/colors";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import { SessionToken } from "@/common/auth/token";

export default function DashboardNavigationBar() {
  const router = useRouter();
  const { mutateAsync: logout, isPending } = useLogout();
  return (
    <Box className={LayoutStyles["navbar"]}>
      <Title order={1} style={{ fontFamily: "monospace" }}>
        PARALLEL
      </Title>
      <Button
        className={LayoutStyles["navbar__logout-button"]}
        loading={isPending}
        onClick={handleErrorFn(async () => {
          const res = await logout();
          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.sentimentInfo,
            });
          }
          router.replace(NavigationRoutes.Login);
          SessionToken.clear();
        })}
      >
        Logout
      </Button>
    </Box>
  );
}
