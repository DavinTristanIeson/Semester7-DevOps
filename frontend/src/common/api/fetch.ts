import { plainToInstance } from "class-transformer";
import { client } from "./ky-client";
import { toApiError } from "./utils";
import { KyInstance, Options } from "ky";

interface CommonQueryFunctionProps {
  url: string;
  params?: Record<string, any>;
  method: Options["method"];
  classType: (new (...args: any) => any);
  body?: any;
  client?: KyInstance;
}

export async function ApiFetch(props: CommonQueryFunctionProps): Promise<any> {
  const usedClient: KyInstance = props.client ?? client;
  const clientProps: Options = {}
  if (props.params) {
    clientProps.searchParams = props.params;
  }
  try {
    const response = await usedClient.get(props.url, clientProps);
    const result = await response.json() as any;
    const data = plainToInstance(props.classType, result.data)
    return {
      data,
      ...result
    }
  } catch (e: any) {
    throw await toApiError(e);
  }
}
