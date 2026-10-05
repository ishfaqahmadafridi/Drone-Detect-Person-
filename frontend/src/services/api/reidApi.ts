import type { ReIDStatus } from "@/types";
import { REID_API } from "@/constants/network";
import { apiClient } from "./client";

export const reidApi = {
  async status(signal?: AbortSignal): Promise<ReIDStatus> {
    return (await apiClient.get<ReIDStatus>(REID_API.status, { signal })).data;
  },
  async retry(): Promise<ReIDStatus> {
    return (await apiClient.post<ReIDStatus>(REID_API.retry)).data;
  },
};
