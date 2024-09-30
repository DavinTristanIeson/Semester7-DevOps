import { tokenApi } from '@/common/auth/token';
import { AfterResponseHook, BeforeRequestHook, BeforeRetryHook } from 'ky';
import { queryClient } from './query-client';
import { AUTH_KEY } from './constants';

export namespace KyClientHooks {
  /** WARNING: The client with this implemented should never be used to call auth/refresh; or else you'll get an infinite loop. */
  export const setupAuthorization: BeforeRequestHook = async function (
    request,
  ) {
    const token = await tokenApi(); // This grabs existing tokens if they exist, and refetch if they don't.
    if (token == null) {
      request.headers.delete('Authorization');
    } else {
      request.headers.set('Authorization', `Bearer ${token.accessToken}`);
    }
  };

  export const xRetryHeader: BeforeRetryHook = async function ({
    request,
    retryCount,
  }) {
    request.headers.set('x-retry', retryCount.toString());
  };

  /** WARNING: The client with this hook implemented should never be used to call /me; or else you'll get an infinite loop. */
  export const onUnauthenticated: AfterResponseHook = function (
    request,
    _,
    response,
  ) {
    const isUnauthenticated = response.status === 401;
    // Don't refetch if this is the auth proof endpoint.
    if (isUnauthenticated) {
      // If the user is unauthenticated, we will force a self information refetch, which is used as the basis for our authentication.
      // Any auth state handler should then refetch and consider redirecting user to the login screen.
      queryClient.invalidateQueries({
        queryKey: AUTH_KEY
      });
    }
  };
}
