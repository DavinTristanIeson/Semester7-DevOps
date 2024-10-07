import { useLogin } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, lighten, Title } from "@mantine/core";

import AuthStyles from "@/styles/auth.module.css";
import Colors from "@/common/constants/colors";

export default function LoginPage() {
  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  return (
    <Box className={AuthStyles["full-screen-box"]}>
      <Box className={AuthStyles["container-box"]}>
        <Box className={AuthStyles["login-image-box"]}>
          <Title order={1} style={{ fontFamily: "monospace" }}>PARALLEL</Title>
          <Box className={AuthStyles["quote-box"]}>
            <Title order={2}>Capturing Moments,</Title>
            <Title order={2}>Creating Memories</Title>
          </Box>
        </Box>
        <Box className={AuthStyles["content-box"]}>
          <Title order={1}>Sign In</Title>
          <AuthenticationForm
            onSubmit={async (values) => {
              const res = await login(values);
              if (res.message) {
                showNotification({
                  message: res.message,
                  color: Colors.Sentiment.Info,
                });
              }
              router.replace(NavigationRoutes.Home);
            }}
          />
          <text>Don't have an account?
            <span>
              <Link href={NavigationRoutes.Register} className={AuthStyles["link-style"]}>
                Register
              </Link>
            </span>
          </text>
        </Box>
      </Box>
    </Box>
  );
}
