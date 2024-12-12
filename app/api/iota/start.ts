import {
  InitiateDataSharingRequestOKData,
} from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { iotaInitiateRequest } from "../../../lib/clients/iota";
import { ResponseError } from "../../../types/types";
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
    const pk = process.env.PRIVATE_KEY

    // Read the below params from Iota initiate request body
    // configurationId - Iota configuration Id
    // queryId - Iota queryId (e.g. QueryId for PEX requesting Event Ticket VC)
    // redirectUri - Callaback URL (should match with Redirect URLs in the Iota Configuration)
    // nonce - A random Id generated from App to ensure the requestor is the reciever
    const { configurationId, queryId, redirectUri, nonce } =
      initShareSchema.parse(req.body);

    // correlationId - Id generated from App
    // transactionId - Id got from Affinidi Post Iota initiate request
    // jwt - Access token used by Affinidi Vault to ensure Affinidi Iota request is valid
    const { correlationId, transactionId, jwt } = await iotaInitiateRequest(configurationId, queryId, nonce, redirectUri) as InitiateDataSharingRequestOKData;

    res.status(200).json({ correlationId, transactionId, jwt });


  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message, details: error?.details || error.response?.data });
  }
}
