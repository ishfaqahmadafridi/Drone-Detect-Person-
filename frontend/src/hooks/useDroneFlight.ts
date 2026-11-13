"use client";

import { useEffect, useRef, useState } from "react";
import { DRONE_LINK } from "@/constants/tactical";
import { useMutation } from "@tanstack/react-query";
import { droneApi } from "@/services/api/droneApi";
import { useAppSelector } from "@/store";
import { apiErrorMessage } from "@/utils/apiError";

export function useDroneFlight() {
  const telemetry = useAppSelector((state) => state.telemetry);
  const avionics = telemetry.avionics;

  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const commandBusy = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const showMessage = (message: string) => {
    if (!mounted.current) return;
    if (messageTimer.current) clearTimeout(messageTimer.current);
    setLastMessage(message);
    messageTimer.current = setTimeout(() => setLastMessage(null), DRONE_LINK.messageDurationMs);
  };

  const commandMutation = useMutation({
    mutationFn: (action: string) => droneApi.sendCommand(action),
    onSuccess: data => showMessage(data.message),
    onError: err => showMessage(`Command error: ${apiErrorMessage(err)}`),
    onSettled: () => { commandBusy.current = false; },
  });

  const handleCommand = (action: string) => {
    if (commandBusy.current) return;
    commandBusy.current = true;
    commandMutation.mutate(action);
  };

  return {
    avionics,
    isCommandPending: commandMutation.isPending,
    lastMessage,
    handleCommand,
  };
}
