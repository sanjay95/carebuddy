// public environment variables for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!;

export const eventTicketVCTypeID = process.env.NEXT_PUBLIC_CREDENTIAL_TYPE_ID!;
export const iotaFlowTypeRedirect = process.env.NEXT_PUBLIC_IOTA_FLOW_TYPE_REDIRECT === "true";
export const iotaConfigId = process.env.NEXT_PUBLIC_IOTA_CONFIG_ID!;
export const recommendationIota = process.env.NEXT_PUBLIC_IOTA_MUSIC_RECOMMEND_QUERY!;
export const addressIota = process.env.NEXT_PUBLIC_IOTA_ADDRESS_QUERY!;
export const eventTicketQuery = process.env.NEXT_PUBLIC_IOTA_EVENT_TICKET_QUERY!;
export const idvQueryEmailId = process.env.NEXT_PUBLIC_IOTA_IDV_QUERY_EMAIL!;
// export const iotaConfigId = process.env.NEXT_PUBLIC_IOTA_CONFIG_ID!;
export const idvQueryId = process.env.NEXT_PUBLIC_IOTA_IDV_QUERY!;
export const personalInformationQueryId= process.env.NEXT_PUBLIC_IOTA_PERSONAL_INFORMATION_QUERY_ID!;
export const aggregateHealthDataQueryId = process.env.NEXT_PUBLIC_IOTA_AGGREGATE_HEALTH_DATA_QUERY_ID!;

if (!hostUrl)
  throw new Error(
    "NEXT_PUBLIC_HOST environment variable is undefined, please follow instructions in README to setup the application"
  );

 
