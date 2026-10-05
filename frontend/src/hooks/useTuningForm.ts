"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { useConfigMutation } from "@/services/queries/useConfigMutation";

export function useTuningForm() {
  const { confidence_threshold } = useAppSelector(
    (state) => state.telemetry
  );
  const configMutation = useConfigMutation();

  const [conf, setConf] = useState<number>(confidence_threshold || 0.35);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await configMutation.mutateAsync({
      confidence_threshold: Number(conf),
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return {
    conf,
    setConf,
    showSavedToast,
    isPending: configMutation.isPending,
    handleSubmit,
  };
}
