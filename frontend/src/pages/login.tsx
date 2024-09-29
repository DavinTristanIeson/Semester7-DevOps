import { useLogin } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import { SessionToken } from "@/common/auth/token";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, Title } from "@mantine/core";

import LoginStyles from '@/modules/auth/login.module.css';

export default function LoginPage() {
  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  return <Box p={16} className={LoginStyles["login--card"]}>
    <Title order={1}>Login</Title>
    <AuthenticationForm onSubmit={async (values) => {
      const res = await login(values);
      if (res.message){
        showNotification({
          message: res.message,
        });
      }
      SessionToken.set(res.data);
      router.push(NavigationRoutes.Home);
    }}/>
    <Link href={NavigationRoutes.Register}>
      Register
    </Link>
  </Box>
}
