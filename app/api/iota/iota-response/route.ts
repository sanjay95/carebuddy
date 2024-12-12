import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  IotaApi,
  FetchIOTAVPResponseOK,
} from "@affinidi-tdk/iota-client";
import { getAuthProvider } from "../../../../lib/clients/auth-provider";
import { ResponseError } from "../../../../types/types";
import { z } from "zod";

const responseSchema = z.object({
  configurationId: z.string(),
  correlationId: z.string(),
  transactionId: z.string(),
  responseCode: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    //Get the Requested data for initiated request using Affinidi Iota

    // Read the below params from request body
    // Response Code - We get this from the Iota callback URL
    // configurationId - Iota configuration Id
    // correlationId - Id generated from App during Iota initiate request
    // transactionId - Id got from Affinidi Iota initiate request
    const { responseCode, configurationId, correlationId, transactionId } =
      responseSchema.parse(req.body);

    //Initiatlize the Affinidi TDK with Personal Access Token details
    const authProvider = getAuthProvider();

    //Initiatlize the Affinidi Iota API Object
    const api = new IotaApi(
      new Configuration({
        apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      })
    );

    // we exchange the VC data with response code
    const iotaVpResponse: FetchIOTAVPResponseOK = await api.fetchIotaVpResponse(
      {
        configurationId,
        correlationId,
        transactionId,
        responseCode,
      }
    );

    // Reading requested verfiable presentation data from Iota
    const vp = JSON.parse((iotaVpResponse.data as any).vpToken);

    res.status(200).json({ vp: vp, nonce: iotaVpResponse.data.nonce });
  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message, details: error?.details });
  }
}
