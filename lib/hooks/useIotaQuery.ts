import { useEffect, useRef, useState } from "react";
import { IotaRequestRedirectType } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import { VaultUtils } from "@affinidi-tdk/common";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { hostUrl } from "../variables";

async function getIotaRequestStart(
  configurationId: string,
  redirectUri: string,
  queryId: string,
  nonce: string
) {
  const response = await fetch("/api/iota/start", {
    method: "POST",
    body: JSON.stringify({
      configurationId: configurationId,
      queryId,
      redirectUri: redirectUri,
      nonce,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
}

async function getIotaResponse(iotaRedirect: any, responseCode: string) {
  const params = { ...iotaRedirect, responseCode };
  const response = await fetch("/api/iota/complete", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
}

export default function useIotaQuery({
  configurationId,
  redirectUrl,
}: IotaRequestRedirectType) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasHandledResponse = useRef(false); // Track if the logic has been executed
  const [isInitializing, setIsInitializing] = useState(false);
  const [isWaitingForResponse, setWaitingForResonse] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [dataRequest, setDataRequest] = useState<any>();
  const [data, setData] = useState<any>();

  const handleInitiate = async (queryId: string) => {
    try {
      if (!queryId) {
        setErrorMessage("queryId is required to initiate Iota request");
        return;
      }

      setErrorMessage(undefined);
      setIsInitializing(true);

      const nonce = uuidv4().slice(0, 10);

      const iotaResponseData = await getIotaRequestStart(
        configurationId,
        redirectUrl || `${hostUrl}${pathname}`,
        queryId,
        nonce
      );
      if (!iotaResponseData.correlationId || !iotaResponseData.transactionId) {
        console.error("Error while calling API", iotaResponseData);
        setErrorMessage("Error Occcured :" + iotaResponseData.message);
        setIsInitializing(false);
        return;
      }
      setDataRequest((prevRequests: any) => ({
        ...prevRequests,
        request: iotaResponseData,
      }));

      const toStore = {
        nonce,
        queryId,
        configurationId: configurationId,
        correlationId: iotaResponseData.correlationId,
        transactionId: iotaResponseData.transactionId,
      };

      localStorage.setItem("iotaRedirect", JSON.stringify(toStore));

      const vaultLink = VaultUtils.buildShareLink(iotaResponseData.jwt, "client_id");
      router.push(vaultLink);
    } catch (error: any) {
      console.error("Error initializing Iota Session:", error);
      setErrorMessage("IotaSession response error: " + error.message);
    } finally {
      //setIsInitializing(false);
    }
  };

  const handleCallback = async (responseCode: string) => {
    setWaitingForResonse(true);
    setErrorMessage(undefined);
    const iotaRedirectString = localStorage.getItem("iotaRedirect") || "{}";
    const iotaRedirect = JSON.parse(iotaRedirectString);

    const iotaResponse = await getIotaResponse(iotaRedirect, responseCode);
    console.log('iotaResponse', iotaResponse);

    if (!iotaResponse?.vp || !iotaResponse?.nonce) {
      console.error("Error while calling API", iotaResponse);
      setErrorMessage("Error Occcured :" + iotaResponse.message);
      setWaitingForResonse(false);
      return;
    }

    const generatedNonce = iotaRedirect?.nonce;
    const receivedNonce = iotaResponse?.nonce;
    const matched = generatedNonce === receivedNonce;

    setDataRequest((prevRequests: any) => ({
      ...prevRequests,
      response: {
        verifiablePresentation: iotaResponse.vp,
        nonce: iotaResponse?.nonce
      },
    }));

    const allCrdentialSubjectArray = iotaResponse.vp.verifiableCredential?.map((vc: any) => vc.credentialSubject) || [];
    const allCredentailSubject = Object.assign({}, ...allCrdentialSubjectArray);
    console.log(allCredentailSubject)
    const data = { [iotaRedirect?.queryId]: allCredentailSubject };
    setData(data);

    setErrorMessage(undefined);
    //setWaitingForResonse(false);
  };

  useEffect(() => {
    console.log("configurationId", configurationId);
    if (!configurationId) {
      setErrorMessage("ConfigurationID missing");
      return;
    }
  }, [configurationId]);


  useEffect(() => {
    const responseCode = searchParams.get("response_code");
    const errorMessage = searchParams.get("error");
    if (errorMessage && !hasHandledResponse.current) {
      setIsInitializing(false);
      setErrorMessage(errorMessage);
      hasHandledResponse.current = true; // Mark as handled
      router.push(pathname)
    }
    else if (responseCode && !hasHandledResponse.current) {
      handleCallback(responseCode);
      hasHandledResponse.current = true; // Mark as handled
      router.push(pathname)
    }
  }, [router, searchParams, pathname]);

  return {
    isInitializing,
    isWaitingForResponse,
    handleInitiate,
    errorMessage,
    dataRequest,
    data
  };
}
