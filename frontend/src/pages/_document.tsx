import { ColorSchemeScript } from "@mantine/core";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document(){
  return <Html lang="en">
    <Head>
      <title>Parallel</title>
      <ColorSchemeScript defaultColorScheme="auto" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
}