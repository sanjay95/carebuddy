import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { StartIssuanceInput, StartIssuanceInputClaimModeEnum } from "@affinidi-tdk/credential-issuance-client";
import { startIssuance } from "@/lib/clients/credential-issuance";

const issuanceStartSchema = z.object({
  credentialTypeId: z.string(),
  credentialData: z.any(),
  claimMode: z.nativeEnum(StartIssuanceInputClaimModeEnum),
  holderDid: z.string().optional(),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log('body', body);
    const { credentialTypeId, credentialData, claimMode } =
      issuanceStartSchema.parse(body);

    const apiData: StartIssuanceInput = {
      claimMode,
      data: [
        {
          credentialTypeId,
          credentialData: {
            ...credentialData,
          },
          // metaData: {
          //   expirationDate: "2024-12-05T09:50:00Z"
          // }
        },
      ],
    };

    // console.log('apiData', apiData);

    const { credentialOfferUri, txCode, issuanceId, expiresIn } = await startIssuance(apiData);

    return NextResponse.json({ credentialOfferUri, txCode, issuanceId, expiresIn });
  } catch (error) {
    console.error("Issuance Error in handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
