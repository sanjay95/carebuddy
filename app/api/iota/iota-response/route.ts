import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { iotaCompleteRequest } from '../../../../lib/clients/iota';
import { ResponseError } from '../../../../types/types';

const responseSchema = z.object({
  configurationId: z.string(),
  correlationId: z.string(),
  transactionId: z.string(),
  responseCode: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { responseCode, configurationId, correlationId, transactionId } = responseSchema.parse(body);

    // Exchange the VC data with response code
    const iotaVpResponse = await iotaCompleteRequest(responseCode, configurationId, correlationId, transactionId);

    // Read requested verifiable presentation data from Iota
    const vp = JSON.parse((iotaVpResponse as any).vpToken);

    return NextResponse.json({ vp: vp, nonce: iotaVpResponse.nonce });
  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500;
    return NextResponse.json({ message: error.message, details: error?.details }, { status: statusCode });
  }
}