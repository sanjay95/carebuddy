import {
  Configuration,
  IotaApi,
  IotaConfigurationDtoModeEnum,
  InitiateDataSharingRequestOKData,
} from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthProvider } from "../../../../lib/clients/auth-provider";
import { ResponseError } from "../../../../types/types";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const initShareSchema = z.object({
  configurationId: z.string(),
  queryId: z.string(),
  redirectUri: z.string(),
  nonce: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    //Add Affinidi Iota Redirect flow login using Affinidi TDK

    // Read the below params from Iota initiate request body
    // configurationId - Iota configuration Id
    // queryId - Iota queryId (e.g. QueryId for PEX requesting Event Ticket VC)
    // redirectUri - Callaback URL (should match with Redirect URLs in the Iota Configuration)
    // nonce - A random Id generated from App to ensure the requestor is the reciever
    const { configurationId, queryId, redirectUri, nonce } =
      initShareSchema.parse(req.body);

    //Initiatlize the Affinidi TDK with Personal Access Token details
    const authProvider = getAuthProvider();

    //Initiatlize the Affinidi Iota API Object
    const api = new IotaApi(
      new Configuration({
        apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
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

    // correlationId - Id generated from App
    // transactionId - Id got from Affinidi Post Iota initiate request
    // jwt - Access token used by Affinidi Vault to ensure Affinidi Iota request is valid
    const { correlationId, transactionId, jwt } =
      dataSharingRequestResponse.data as InitiateDataSharingRequestOKData;

    res.status(200).json({ correlationId, transactionId, jwt });
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get Iota credentials" });
    console.log(error);
  }
}
