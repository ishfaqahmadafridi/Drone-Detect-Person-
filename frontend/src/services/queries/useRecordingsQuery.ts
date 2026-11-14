import { useQuery } from "@tanstack/react-query";
import { recordingsApi } from "../api/recordingsApi";
import type { SnapshotList } from "@/types";

export const RECORDINGS_QUERY_KEY = ["recordings"] as const;

export const useRecordingsQuery = () =>
  useQuery<SnapshotList, Error>({
    queryKey: RECORDINGS_QUERY_KEY,
    queryFn: () => recordingsApi.listRecordings(),
    refetchInterval: 15000,
  });
