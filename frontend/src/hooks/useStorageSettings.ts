import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recordingsApi } from "@/services/api/recordingsApi";
import { SNAPSHOTS_QUERY_KEY } from "@/services/queries/useSnapshotsQuery";
import { RECORDINGS_QUERY_KEY } from "@/services/queries/useRecordingsQuery";
import { apiErrorMessage } from "@/utils/apiError";
import { formatFileSize } from "@/utils/evidenceFormat";
import { SETTINGS_UI } from "@/constants/tactical";

export const STORAGE_STATS_QUERY_KEY = ["evidence-storage"] as const;

/** Real evidence storage usage, plus age-based cleanup of old snapshots. */
export function useStorageSettings() {
  const queryClient = useQueryClient();
  const stats = useQuery({ queryKey: STORAGE_STATS_QUERY_KEY, queryFn: recordingsApi.getStorageStats, refetchInterval: 30000 });
  const [days, setDays] = useState<number>(SETTINGS_UI.cleanupOptions[1].days);
  const [result, setResult] = useState("");

  const cleanup = useMutation({
    mutationFn: () => recordingsApi.cleanupEvidence(days, "image"),
    onSuccess: data => {
      setResult(data.deleted
        ? `Deleted ${data.deleted.toLocaleString()} snapshots and freed ${formatFileSize(data.freed_kb)}.`
        : `No snapshots older than ${days} days.`);
      for (const key of [STORAGE_STATS_QUERY_KEY, SNAPSHOTS_QUERY_KEY, RECORDINGS_QUERY_KEY]) {
        void queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });

  const confirmCleanup = () => {
    setResult("");
    if (window.confirm(`Permanently delete every snapshot older than ${days} days? This cannot be undone.`)) cleanup.mutate();
  };

  const describe = (bucket?: { count: number; size_kb: number }) =>
    bucket ? `${bucket.count.toLocaleString()} · ${formatFileSize(bucket.size_kb) || "0 KB"}` : "—";

  return {
    rows: [
      { label: "Snapshots", value: describe(stats.data?.image) },
      { label: "Recordings", value: describe(stats.data?.video) },
    ],
    days,
    setDays,
    confirmCleanup,
    cleaning: cleanup.isPending,
    result,
    error: stats.error ? apiErrorMessage(stats.error) : cleanup.error ? apiErrorMessage(cleanup.error) : "",
  };
}
