import NavigationRoutes from "@/common/constants/routes";
import { useRouter } from "next/router";
import React from "react";

import useAuth from "./use-auth";
import { showNotification } from "@mantine/notifications";
import Colors from "../constants/colors";

// Format is the following => [key]: [is public or not]
const PUBLIC_ROUTES: Record<NavigationRoutes, boolean> = {
  [NavigationRoutes.Home]: false,
  [NavigationRoutes.Login]: true,
  [NavigationRoutes.Register]: true,
};

export function isProtectedRoutes(route: string) {
  return !PUBLIC_ROUTES[route as NavigationRoutes];
}

/** A container that observes the authentication state, and redirects the users to the login screen if they are unauthenticated. Components under this can intentionally refetch the getMe query (or whatever query client key is used as the AUTH PROOF key) to trigger the check in this component. */
export function PrivateRoutes(props: React.PropsWithChildren) {
  const router = useRouter();

  // KY-Client will refetch getMe whenever it receives a 401 (on an endpoint that's not /me) which will then trigger this hook to re-run.
  const { isRedirectLogin, isFetching } = useAuth();

  const pathIsProtected = isProtectedRoutes(router.pathname);

  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const isRelocating = React.useRef(false);

  // Check if we need to send user to login screen or not.
  React.useEffect(() => {
    if (!pathIsProtected || isFetching || isRelocating.current) return;
    if (isRedirectLogin) {
      // Add some delay so that user can actually know what's going on than randomly being sent to the login screen.
      const DELAY_MILLIS = 1500;
      showNotification({
        id: "redirecting_to_login_screen",
        message: "Redirecting to login screen...",
        loading: true,
        autoClose: DELAY_MILLIS + 1000,
        color: Colors.Notification.Info,
      });
      isRelocating.current = true;
      timeoutRef.current = setTimeout(() => {
        router.replace(NavigationRoutes.Login);
        isRelocating.current = false;
      }, DELAY_MILLIS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isRedirectLogin, pathIsProtected]);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return <>{props.children}</>;
}
