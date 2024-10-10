import { Options } from "ky";
import EnvironmentVariables from "../constants/env";

export const AUTH_KEY = ['auth'];

export const API_PREFIX = 'api';
export function getFilesUrl(id: string){
  return `${EnvironmentVariables.ApiUrl}/${API_PREFIX}/files`;
}

export const KY_BASE_CONFIG: Options = {
  prefixUrl: `${EnvironmentVariables.ApiUrl}/${API_PREFIX}`,
  timeout: 60000,
  retry: 2,
  headers: {
    Accept: 'application/json',
  },
};
