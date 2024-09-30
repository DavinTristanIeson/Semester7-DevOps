/** We'll put all the refresh models here since the developers in charge of implementation will likely not touch this. */

import { Expose } from 'class-transformer';
import { KY_BASE_CONFIG } from '@/common/api/constants';
import { ApiFetch } from '@/common/api/fetch';
import { ApiResult } from '@/common/api/model';
import ky from 'ky';

// Model
export class SessionTokenModel {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}

// Input

export class RefreshTokenMutationInput {
  refreshToken: string;
}

// Client
// Specific for refresh endpoint to prevent circular dependencies. See long rant in common/api/ky-client.tsx for explanation.
export const refreshTokenClient = ky.create(KY_BASE_CONFIG);

// Mutation
const REFRESH_ENDPOINT = 'auth/refresh';
export async function mutateRefreshToken(
  body: RefreshTokenMutationInput,
): Promise<ApiResult<SessionTokenModel>> {
  return ApiFetch({
    url: REFRESH_ENDPOINT,
    method: 'POST',
    classType: SessionTokenModel,
    body,
    client: refreshTokenClient,
  });
}
