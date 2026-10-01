import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamApi } from "../api/streamApi";
import { StreamSourceType } from "@/types";
import { useAppDispatch } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";

export const useStreamMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const switchSource = useMutation({
    mutationFn: async ({
      sourceType,
      sourcePath,
    }: {
      sourceType: StreamSourceType;
      sourcePath?: string;
    }) => {
      const safeType = typeof sourceType === "string" ? sourceType : "synthetic";
      const safePath = typeof sourcePath === "string" && sourcePath.trim().length > 0 ? sourcePath.trim() : undefined;
      return await streamApi.switchSource(safeType, safePath);
    },
    onSuccess: (_, variables) => {
      dispatch(setTelemetryData({ source_type: variables.sourceType }));
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  const switchView = useMutation({
    mutationFn: async (view: "aerial" | "ground") => {
      return await streamApi.switchView(view);
    },
    onSuccess: (data) => {
      dispatch(setTelemetryData({ view_mode: data.active_view as "aerial" | "ground" }));
    },
  });

  return { switchSource, switchView };
};
