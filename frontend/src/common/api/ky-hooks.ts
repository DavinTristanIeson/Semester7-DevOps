import { AfterResponseHook, BeforeRequestHook, BeforeRetryHook } from 'ky';
import { queryClient } from './query-client';
import { GET_ME_KEY } from './constants';

export namespace KyClientHooks {
  /** WARNING: The client with this hook implemented should never be used to call /me; or else you'll get an infinite loop. */
  export const onUnauthenticated: AfterResponseHook = function (
    request,
    _,
    response,
  ) {
    const isUnauthenticated = response.status === 401;
    if (isUnauthenticated) {
      // If the user is unauthenticated, we will force a self information refetch, which is used as the basis for our authentication.
      // Any auth state handler should then refetch and consider redirecting user to the login screen.
      queryClient.invalidateQueries({queryKey: GET_ME_KEY});
    }
  };
}
