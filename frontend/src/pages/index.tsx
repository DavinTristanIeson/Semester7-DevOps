import { useLogout } from "@/api/auth/mutation";
import { SessionToken } from "@/common/auth/token";
import Colors from "@/common/constants/colors";
import NavigationRoutes from "@/common/constants/routes";
import { handleErrorFn } from "@/common/utils/form";
import { Box, Button, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import NavbarStyles from "@/styles/navbar.module.css";
import HomeStyles from "@/styles/home.module.css";

export default function HomePage() {
  const { mutateAsync: logout, isPending } = useLogout();
  const router = useRouter();
  return (
    <div>
      <Box className={NavbarStyles["navbar"]}>
        <Title order={1} style={{ fontFamily: "monospace" }}>
          PARALLEL
        </Title>
        <Button
          className={NavbarStyles["logout-button"]}
          loading={isPending}
          onClick={handleErrorFn(async () => {
            // const res = await logout();
            // if (res.message) {
            //   showNotification({
            //     message: res.message,
            //     color: Colors.Sentiment.Info,
            //   });
            // }
            router.replace(NavigationRoutes.Login);
            SessionToken.clear();
          })}
        >
          Logout
        </Button>
      </Box>
      <Box className={HomeStyles["gallery"]}>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 1
          </Title>
        </Box>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 2
          </Title>
        </Box>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 3
          </Title>
        </Box>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 4
          </Title>
        </Box>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 5
          </Title>
        </Box>
        <Box className={HomeStyles["album"]}>
          <Box className={HomeStyles["cover"]}>
            <img src="/images/Login.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example2.png" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Register.jpg" alt="Login Image" className={HomeStyles["cover-image"]} />
            <img src="/images/Example1.jpeg" alt="Login Image" className={HomeStyles["cover-image"]} />
          </Box>
          <Title order={1} style={{ fontFamily: "monospace" }}>
            Album 6
          </Title>
        </Box>

      </Box>
    </div>
  );
}
