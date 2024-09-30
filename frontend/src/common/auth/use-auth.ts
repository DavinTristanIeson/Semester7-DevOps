import { useGetMe } from "@/api/auth/query";

interface UseAuthProps {
  queryProps?: Parameters<typeof useGetMe>[0];
}

/** De facto auth check. Use this rather than ``useGetMe`` to check authentication state; modify this hook for any further authentication changes. */
export default function useAuth(props?: UseAuthProps) {
  const queryGetMe = useGetMe(props?.queryProps);
  const { data, error, isFetching } = queryGetMe;

  const isAuthenticated = !!data;
  const isRedirectLogin = !isFetching && error?.statusCode === 401;

  return {
    isAuthenticated,
    isRedirectLogin,
    ...queryGetMe,
  };
}
