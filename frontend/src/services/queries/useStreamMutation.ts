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
      return await streamApi.switchSource(sourceType, sourcePath);
    },
    onSuccess: (_, variables) => {
      dispatch(setTelemetryData({ source_type: variables.sourceType }));
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  const uploadVideo = useMutation({
    mutationFn: async (file: File) => {
      return await streamApi.uploadVideo(file);
    },
    onSuccess: () => {
      dispatch(setTelemetryData({ source_type: "file" }));
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
  });

  return { switchSource, uploadVideo };
};
