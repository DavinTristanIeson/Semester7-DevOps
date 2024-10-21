import { Box, Button, FileInput, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";
import AlbumStyles from "@/styles/album.module.css";
import NavbarStyles from "@/styles/navbar.module.css";
import { handleErrorFn } from "@/common/utils/form";
import { SessionToken } from "@/common/auth/token";
import { useLogout } from "@/api/auth/mutation";
import NavigationRoutes from "@/common/constants/routes";

export default function AlbumViewPage() {
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
      <Box className={AlbumStyles["title"]}>
        <Box>
          <Box className={AlbumStyles["title"]}>
            <Title order={1}>Album {router.query.id}</Title>
          </Box>
          <Flex align="center" direction="column">
            <FileInput className={AlbumStyles["file-input"]} multiple />
            <Button>Upload Photo</Button>
          </Flex>
        </Box>
      </Box>
      <Box className={AlbumStyles["gallery"]}>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Login.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example2.png"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example1.jpeg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Register.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Login.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example2.png"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example1.jpeg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Register.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Login.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example2.png"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Example1.jpeg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img
            src="/images/Register.jpg"
            alt="Login Image"
            className={AlbumStyles["cover-image"]}
          />
        </Box>
      </Box>
    </div>
  );
}
