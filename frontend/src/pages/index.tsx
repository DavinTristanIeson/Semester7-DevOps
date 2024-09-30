import { useLogout } from "@/api/auth/mutation";
import { SessionToken } from "@/common/auth/token";
import Colors from "@/common/constants/colors";
import NavigationRoutes from "@/common/constants/routes";
import { handleErrorFn } from "@/common/utils/form";
import { Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function HomePage() {
  const { mutateAsync: logout, isPending } = useLogout();
  const router = useRouter();
  return <div>
    <Title order={1}>Hello world</Title>
    <Button loading={isPending} onClick={handleErrorFn(async () => {
      const res = await logout();
      if (res.message){
        showNotification({
          message: res.message,
          color: Colors.Sentiment.Info,
        })
      }
      router.replace(NavigationRoutes.Login);
      SessionToken.clear();
    })}>Logout</Button>
  </div>;
}
