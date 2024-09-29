import { Options } from "ky";
import EnvironmentVariables from "../constants/env";

export const GET_ME_KEY = ['getMe'];

export const API_PREFIX = 'api';
export const KY_BASE_CONFIG: Options = {
  prefixUrl: `${EnvironmentVariables.ApiUrl}/${API_PREFIX}`,
  timeout: 60000,
  retry: 2,
  headers: {
    Accept: 'application/json',
  },
};
