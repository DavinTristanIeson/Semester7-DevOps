import { useLogin } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import AuthenticationForm from "@/modules/auth/form";

import Colors from "@/common/constants/colors";
import LoginLayout, { LoginBox } from "@/modules/auth/layout";
import Text from "@/components/standard/text/base";
import TextLink from "@/components/standard/button/link";

export default function LoginPage() {
  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  return (
    <LoginLayout>
      <LoginBox title="Sign In">
        <AuthenticationForm
          onSubmit={async (values) => {
            const res = await login(values);
            if (res.message) {
              showNotification({
                message: res.message,
                color: Colors.sentimentInfo,
              });
            }
            router.replace(NavigationRoutes.Home);
          }}
        />
        <Text>
          Don&apos;t have an account?
          <TextLink href={NavigationRoutes.Register} span>
            Register
          </TextLink>
        </Text>
      </LoginBox>
    </LoginLayout>
  );
}
