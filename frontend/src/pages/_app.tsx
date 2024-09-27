import "reflect-metadata";
import "@/styles/globals.css";
import { createTheme, MantineProvider, TypographyStylesProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/common/api/query-client";
import { PrivateRoutes } from "@/common/auth/private-routes";
import type { AppProps } from "next/app";
import Head from "next/head";

const mantineTheme = createTheme({

});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={mantineTheme}>
      <TypographyStylesProvider>
        <Notifications
          limit={10}
          position="top-right"
          zIndex={9999999}
          autoClose={4000}
        />
        <QueryClientProvider client={queryClient}>
          {/* Enable this if you need to debug react query */}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <PrivateRoutes>
            <Component {...pageProps} />
          </PrivateRoutes>
        </QueryClientProvider>
      </TypographyStylesProvider>
    </MantineProvider>
  );
}
