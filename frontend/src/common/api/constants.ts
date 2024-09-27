import EnvironmentVariables from "../constants/env";

export const GET_ME_KEY = ['getMe'];
export const API_PREFIX = '/api/employee';
export const KY_BASE_CONFIG = {
  prefixUrl: `${EnvironmentVariables.ApiUrl}/${API_PREFIX}`,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
  },
};
