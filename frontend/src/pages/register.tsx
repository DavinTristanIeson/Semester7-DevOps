import { useRegister } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, Title } from "@mantine/core";
import Colors from "@/common/constants/colors";

export default function RegisterPage() {
  const { mutateAsync: register } = useRegister();
  const router = useRouter();

  return (
    <Box p={16}>
      <Title order={1}>Register</Title>
      <AuthenticationForm
        onSubmit={async (values) => {
          const res = await register(values);
          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.Sentiment.Info
            });
          }
          router.replace(NavigationRoutes.Home);
        }}
      />
      <Link href={NavigationRoutes.Login}>Login</Link>
    </Box>
  );
}
