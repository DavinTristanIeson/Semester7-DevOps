import { useRouter } from "next/router";
import { Box, Title } from "@mantine/core";

import AuthStyles from "./auth.module.css";
import React from "react";
import Colors from "@/common/constants/colors";

export default function LoginLayout(props: React.PropsWithChildren) {
  return (
    <Box className={AuthStyles["full-screen-box"]}>
      <Box className={AuthStyles["container-box"]}>
        <Box className={AuthStyles["login-image-box"]}>
          <Title order={1} style={{ fontFamily: "monospace" }} c={Colors.foregroundPrimary} fs="italic">
            PARALLEL
          </Title>
          <Box className={AuthStyles["quote-box"]}>
            <Title order={2} c={Colors.foregroundPrimary} fs="italic">Capturing Moments,</Title>
            <Title order={2} c={Colors.foregroundPrimary} fs="italic">Creating Memories</Title>
          </Box>
        </Box>
        {props.children}
      </Box>
    </Box>
  );
}

interface LoginBoxProps {
  title: string;
  children?: React.ReactNode;
}

export function LoginBox(props: LoginBoxProps) {
  return (
    <Box className={AuthStyles["content-box"]}>
      <Title order={1}>{props.title}</Title>
      {props.children}
    </Box>
  );
}
