import { useLogin } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, Title } from "@mantine/core";

import LoginStyles from "@/modules/auth/login.module.css";
import Colors from "@/common/constants/colors";

export default function LoginPage() {
  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  return (
    <Box p={16} className={LoginStyles["login--card"]}>
      <Title order={1}>Login</Title>
      <AuthenticationForm
        onSubmit={async (values) => {
          const res = await login(values);
          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.Sentiment.Info
            });
          }
          router.replace(NavigationRoutes.Home);
        }}
      />
      <Link href={NavigationRoutes.Register}>Register</Link>
    </Box>
  );
}
