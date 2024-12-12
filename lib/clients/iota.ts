
import { getAuthProvider } from "./auth-provider";
import {
  Configuration,
  IotaApi,
  IotaConfigurationDtoModeEnum,
  FetchIOTAVPResponseOK,
} from "@affinidi-tdk/iota-client";
import { v4 as uuidv4 } from "uuid";
import { isDev } from "../secrets";

export async function iotaInitiateRequest(configurationId: string, queryId: string, nonce: string, redirectUri: string) {

  //Initialise the Affinidi TDK with Personal Access Token details
  const authProvider = getAuthProvider();
  //Initialise the Affinidi Iota API Object
  const api = new IotaApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      ...(isDev && { basePath: 'https://apse1.dev.api.affinidi.io/ais' })
    })
  );

  // Initiate the Affinidi Iota API data request
  const { data: dataSharingRequestResponse } =
    await api.initiateDataSharingRequest({
      configurationId,
      mode: IotaConfigurationDtoModeEnum.Redirect,
      queryId,
      correlationId: uuidv4(),
      nonce,
      redirectUri,
    });

  return dataSharingRequestResponse?.data;
}

export async function iotaCompleteRequest(responseCode: string, configurationId: string, correlationId: string, transactionId: string) {
  //Initialise the Affinidi TDK with Personal Access Token details
  const authProvider = getAuthProvider();

  //Initialise the Affinidi Iota API Object
  const api = new IotaApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      ...(isDev && { basePath: 'https://apse1.dev.api.affinidi.io/ais' })
    })
  );

  // we exchange the VC data with response code
  const iotaVpResponse: FetchIOTAVPResponseOK = await api.fetchIotaVpResponse({
    configurationId,
    correlationId,
    transactionId,
    responseCode,
  });

  return iotaVpResponse?.data;
}

export async function listIotaConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  );
  const { data } = await api.listIotaConfigurations();
  return data.configurations;
}

export async function listPexQueriesByConfigurationId(configurationId: string) {
  const authProvider = getAuthProvider();
  const api = new PexQueryApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  );
  const { data } = await api.listPexQueries(configurationId);
  return data.pexQueries;
}
