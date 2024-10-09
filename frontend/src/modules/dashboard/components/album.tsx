import { AlbumModel } from "@/api/album";
import { Box, Title } from "@mantine/core";
import HomeStyles from "../dashboard.module.css";

interface AlbumCardProps {
  album: AlbumModel;
}

export function AlbumCard(props: AlbumCardProps) {
  const { album } = props;
  return (
    <div className={HomeStyles["album__card"]}>
      <div className={HomeStyles["album__cover"]}>
        <img
          src="/images/Login.jpg"
          alt="Login Image"
          className={HomeStyles["album__cover__image"]}
        />
        <img
          src="/images/Example2.png"
          alt="Login Image"
          className={HomeStyles["album__cover__image"]}
        />
        <img
          src="/images/Register.jpg"
          alt="Login Image"
          className={HomeStyles["album__cover__image"]}
        />
        <img
          src="/images/Example1.jpeg"
          alt="Login Image"
          className={HomeStyles["album__cover__image"]}
        />
      </div>
      <Title order={3} className={HomeStyles["album__title"]}>
        {album.name}
      </Title>
    </div>
  );
}
