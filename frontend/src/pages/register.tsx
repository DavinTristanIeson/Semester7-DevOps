import { useRegister } from "@/api/auth/mutation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import Link from "next/link";
import AuthenticationForm from "@/modules/auth/form";
import { Box, Title } from "@mantine/core";
import Colors from "@/common/constants/colors";
import AuthStyles from "@/styles/auth.module.css";
import { TextInput } from "@mantine/core";

export default function RegisterPage() {
  const { mutateAsync: register } = useRegister();
  const router = useRouter();

  return (
    <Box className={AuthStyles["full-screen-box"]}>
      <Box className={AuthStyles["container-box"]}>
        <Box className={AuthStyles["register-image-box"]}>
          <Title order={1} style={{ fontFamily: "monospace" }}>PARALLEL</Title>
          <Box className={AuthStyles["quote-box"]}>
            <Title order={2}>Capturing Moments,</Title>
            <Title order={2}>Creating Memories</Title>
          </Box>
        </Box>
        <Box className={AuthStyles["content-box"]}>
          <Title order={1}>Create an Account</Title>
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
                  color: Colors.Sentiment.Info
                });
              }
              router.replace(NavigationRoutes.Home);
            }}
          />
          <text>Already have account?
            <span>
              <Link href={NavigationRoutes.Login} className={AuthStyles["link-style"]}>
                Login
              </Link>
            </span>
          </text>

        </Box>
      </Box>
    </Box>
  );
}
