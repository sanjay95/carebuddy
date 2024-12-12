import {
  InitiateDataSharingRequestOKData,
} from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { iotaInitiateRequest } from "../../../../lib/clients/iota";
import { ResponseError } from "../../../../types/types";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const initShareSchema = z.object({
  configurationId: z.string(),
  queryId: z.string(),
  redirectUri: z.string(),
  nonce: z.string(),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { configurationId, queryId, redirectUri, nonce } = initShareSchema.parse(body);

    const { correlationId, transactionId, jwt } = await iotaInitiateRequest(configurationId, queryId, nonce, redirectUri) as InitiateDataSharingRequestOKData;

    return NextResponse.json({ correlationId, transactionId, jwt });
  } catch (error) {
    console.error("Error in handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
