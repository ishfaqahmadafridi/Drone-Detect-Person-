import { useStore } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamApi } from "../api/streamApi";
import type { RootState, SourceSelectionInput } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";

export const useStreamMutation = () => {
  const queryClient = useQueryClient();
  const appStore = useStore<RootState>();
  const dispatch = useAppDispatch();
  const activeChannel = useAppSelector(state => state.telemetry.view_mode);

  const switchSource = useMutation({
    scope: { id: "stream-source" },
    mutationFn: async ({
      sourceType,
      sourcePath,
      channel,
    }: SourceSelectionInput) => {
      const requestedChannel = channel ?? activeChannel;
      const result = await streamApi.switchSource(sourceType, sourcePath, requestedChannel);
      return { ...result, channel: requestedChannel };
    },
    onSuccess: (result) => {
      if (appStore.getState().telemetry.view_mode === result.channel) {
        dispatch(setTelemetryData({ source_type: result.source_type }));
      }
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  const switchView = useMutation({
    scope: { id: "stream-perspective" },
    mutationFn: async (view: "aerial" | "ground") => {
      return await streamApi.switchView(view);
    },
    onSuccess: (data) => {
      dispatch(setTelemetryData({ view_mode: data.active_view as "aerial" | "ground" }));
    },
  });

  return { switchSource, switchView };
};
