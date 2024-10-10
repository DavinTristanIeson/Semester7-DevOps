import { SessionTokenModel, mutateRefreshToken } from '@/common/auth/api';
import { LocalStorageKeys } from '@/common/constants/browser-storage';
import { plainToInstance } from 'class-transformer';
import { jwtDecode } from 'jwt-decode';
import throttle from 'lodash/throttle';

export namespace SessionToken {
  interface SessionTokenPayload {
    user_id: string;
    exp: number;
  }
  export function get(): SessionTokenModel | undefined {
    if (typeof window === 'undefined') return undefined;
    const response = localStorage.getItem(LocalStorageKeys.Auth);
    if (response === null) return undefined;
    const token = plainToInstance(SessionTokenModel, JSON.parse(response));
    return token;
  }

  export function set(token: SessionTokenModel | undefined) {
    if (typeof window === 'undefined') return;
    if (token === undefined) {
      localStorage.removeItem(LocalStorageKeys.Auth);
    } else {
      const value = JSON.stringify(token);
      localStorage.setItem(LocalStorageKeys.Auth, value);
    }
  }

  export function clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LocalStorageKeys.Auth);
  }

  /** Preferably, use ``checkTokenExpiration`` rather than this. */
  export function isJwtTokenExpired(
    jwtToken: string,
  ) {
    if (!jwtToken) return true;

    const decoded = jwtDecode(jwtToken) as SessionTokenPayload;
    if (!decoded.exp) return true;
    const expiredAt = new Date(decoded.exp * 1000);
    const currentAt = new Date();
    return currentAt.getTime() > expiredAt.getTime();
  }
}

/** Throttle is required so that we don't spam the endpoint. */
const throttledMutateRefreshToken = throttle(mutateRefreshToken, 5000);

/**
 * if token is expired function will fire refresh token api and return new token and otherwise function will return current token
 */
export async function tokenApi(): Promise<SessionTokenModel | undefined> {
  try {
    const token = SessionToken.get();
    if (!token) {
      return undefined;
    }

    const isAccessTokenExpired =
      SessionToken.isJwtTokenExpired(token.accessToken);

    const isRefreshTokenExpired =
      SessionToken.isJwtTokenExpired(token.refreshToken);

    // Refresh token is expired; user has to log in again. This is not exactly a logout action though, since the user should be allowed to resume their activities once they have logged in again.
    if (isRefreshTokenExpired) {
      SessionToken.clear();
      return undefined;
    }

    // If it's just their access token being expired, we'll just fetch the new token
    if (isAccessTokenExpired) {
      const result = await throttledMutateRefreshToken({
        refreshToken: token.refreshToken,
      })!;
      SessionToken.set(result.data);
      return result.data;
    }

    return token;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
