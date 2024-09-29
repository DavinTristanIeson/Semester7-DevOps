import { useRegister } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import { SessionToken } from "@/common/auth/token";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, Title } from "@mantine/core";

export default function RegisterPage() {
  const { mutateAsync: register } = useRegister();
  const router = useRouter();

  return <Box p={16}>
    <Title order={1}>Register</Title>
    <AuthenticationForm onSubmit={async (values) => {
      const res = await register(values);
      if (res.message){
        showNotification({
          message: res.message,
        });
      }
      SessionToken.set(res.data);
      router.push(NavigationRoutes.Home);
    }}/>
    <Link href={NavigationRoutes.Login}>
      Login
    </Link>
  </Box>
}
