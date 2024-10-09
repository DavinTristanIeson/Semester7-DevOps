import { useRegister } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import Text from "@/components/standard/text/base";
import Colors from "@/common/constants/colors";
import AuthStyles from "@/styles/auth.module.css";
import { TextInput } from "@mantine/core";
import LoginLayout, { LoginBox } from "@/modules/auth/layout";
import TextLink from "@/components/standard/button/link";

export default function RegisterPage() {
  const { mutateAsync: register } = useRegister();
  const router = useRouter();

  return (
    <LoginLayout>
      <LoginBox title="Create an Account">
        <TextInput
          label="Name"
          placeholder="Enter Name"
          style={{ width: "400px", marginTop: "20px" }}
        />
        <AuthenticationForm
          onSubmit={async (values) => {
            const res = await register(values);
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
          Already have an account?
          <TextLink href={NavigationRoutes.Login} span>
            Login
          </TextLink>
        </Text>
      </LoginBox>
    </LoginLayout>
  );
}
