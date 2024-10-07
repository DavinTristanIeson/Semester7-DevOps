import { Box, Button, FileInput, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";
import AlbumStyles from "@/styles/album.module.css";

export default function AlbumViewPage() {
  const router = useRouter();
  return (
    <div>
      <Title order={1}>Album View {router.query.id}</Title>
      <Flex align="center" direction="row">
        <FileInput label="Album Files" multiple />
        <Button>Upload</Button>
      </Flex>
      <Box className={AlbumStyles["gallery"]}>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Login.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example2.png" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example1.jpeg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Register.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Login.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example2.png" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example1.jpeg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Register.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Login.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example2.png" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Example1.jpeg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
        <Box className={AlbumStyles["album"]}>
          <img src="/images/Register.jpg" alt="Login Image" className={AlbumStyles["cover-image"]} />
        </Box>
      </Box>
    </div>
  );
}
