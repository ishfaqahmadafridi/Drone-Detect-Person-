"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { useConfigMutation } from "@/services/queries/useConfigMutation";

export function useTuningForm() {
  const { multi_person_threshold, confidence_threshold, proximity_distance_px } = useAppSelector(
    (state) => state.telemetry
  );
  const configMutation = useConfigMutation();

  const [multiThresh, setMultiThresh] = useState<number>(multi_person_threshold || 2);
  const [conf, setConf] = useState<number>(confidence_threshold || 0.35);
  const [proxDist, setProxDist] = useState<number>(proximity_distance_px || 120);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await configMutation.mutateAsync({
      multi_person_threshold: Number(multiThresh),
      confidence_threshold: Number(conf),
      proximity_alert_distance_px: Number(proxDist),
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return {
    multiThresh,
    setMultiThresh,
    conf,
    setConf,
    proxDist,
    setProxDist,
    showSavedToast,
    isPending: configMutation.isPending,
    handleSubmit,
  };
}
