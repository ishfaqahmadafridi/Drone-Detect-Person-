import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { configApi } from "@/services/api/configApi";
import { apiErrorMessage } from "@/utils/apiError";
import { SETTINGS_UI } from "@/constants/tactical";
import type { StreamChannel, UpdateConfigPayload } from "@/types";

/** Confidence threshold and restricted zone for one perspective, read from and saved to the backend. */
export function useDetectionSettings(channel: StreamChannel) {
  const queryClient = useQueryClient();
  const queryKey = ["config", channel] as const;
  const query = useQuery({ queryKey, queryFn: () => configApi.getConfig(channel) });
  const [draft, setDraft] = useState<number | null>(null);
  const [saved, setSaved] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: UpdateConfigPayload) => configApi.updateConfig(payload, channel),
    onSuccess: (data, payload) => {
      queryClient.setQueryData(queryKey, data.config);
      setDraft(null);
      setSaved(payload.zone_polygon ? "Zone updated" : "Saved");
    },
  });

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(""), SETTINGS_UI.savedMessageMs);
    return () => clearTimeout(timer);
  }, [saved]);

  const stored = query.data?.confidence_threshold;
  const confidence = draft ?? stored ?? SETTINGS_UI.confidence.min;
  const zonePoints = query.data?.zone_polygon?.length ?? 0;

  return {
    model: query.data?.model_name ?? "",
    isLoading: query.isLoading,
    confidence,
    setConfidence: setDraft,
    isDirty: draft !== null && draft !== stored,
    zonePoints,
    saving: mutation.isPending,
    saved,
    error: query.error ? apiErrorMessage(query.error) : mutation.error ? apiErrorMessage(mutation.error) : "",
    saveOnAlert: query.data?.save_snapshots_on_alert ?? true,
    cooldownSeconds: query.data?.snapshot_cooldown_seconds ?? SETTINGS_UI.cooldownOptions[0].seconds,
    setSaveOnAlert: (value: boolean) => mutation.mutate({ save_snapshots_on_alert: value }),
    setCooldown: (seconds: number) => mutation.mutate({ snapshot_cooldown_seconds: seconds }),
    saveConfidence: () => mutation.mutate({ confidence_threshold: confidence }),
    applyCentreZone: () => mutation.mutate({ zone_polygon: SETTINGS_UI.centreZone }),
    clearZone: () => mutation.mutate({ zone_polygon: [] }),
  };
}
