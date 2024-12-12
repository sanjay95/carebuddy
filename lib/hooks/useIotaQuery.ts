import { IotaRequestType } from "../../types/types";
import { iotaFlowTypeRedirect } from "../../lib/variables";
import useIotaQueryWebsocket from "../../lib/hooks/useIotaQueryWebsocket";
import useIotaQueryRedirect from "../../lib/hooks/useIotaQueryRedirect";

export default function useIotaQuery(params: IotaRequestType) {
  if (iotaFlowTypeRedirect) {
    return useIotaQueryRedirect(params)
  } else {
    return useIotaQueryWebsocket(params)
  }
}
