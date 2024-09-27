import ky, { Options } from "ky";

import { KY_BASE_CONFIG } from "./constants";
import { KyClientHooks } from "./ky-hooks";

const KY_DEFAULT_CONFIG = {
  ...KY_BASE_CONFIG,
  hooks: {
    // 24/06/2024: Removed afterResponse hook because it literally does nothing (...hopefully) to the response (the actual values still need to be fetched via .json() and .blob() from the response). QueryFetchFunction and MutationFetchFunction already handles the JSON parsing and blobToBase64 conversion.
    afterResponse: [KyClientHooks.onUnauthenticated],
    beforeRetry: [KyClientHooks.xRetryHeader],
    beforeRequest: [KyClientHooks.setupAuthorization],
  },
} as Options;

export const client = ky.create(KY_DEFAULT_CONFIG);
export const meClient = ky.create({
  ...KY_BASE_CONFIG,
  hooks: {
    beforeRetry: [KyClientHooks.xRetryHeader],
    beforeRequest: [KyClientHooks.setupAuthorization],
  },
});
