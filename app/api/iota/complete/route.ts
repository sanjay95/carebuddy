import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "../../../../types/types";
import { z } from "zod";
import { iotaCompleteRequest } from "../../../../lib/clients/iota";

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

    // we exchange the VC data with response code
    const iotaVpResponse = await iotaCompleteRequest(responseCode, configurationId, correlationId, transactionId);

    // Reading requested verfiable presentation data from Iota
    const vp = JSON.parse((iotaVpResponse as any).vpToken);

    res.status(200).json({ vp: vp, nonce: iotaVpResponse.nonce });

  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message, details: error?.details });
  }
}
