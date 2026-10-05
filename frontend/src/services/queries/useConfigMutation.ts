import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi, UpdateConfigPayload } from "../api/configApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateConfigState, setIsSaving } from "@/store/slices/configSlice";

export const useConfigMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(state => state.telemetry.view_mode);

  return useMutation({
    mutationFn: async (payload: UpdateConfigPayload) => {
      dispatch(setIsSaving(true));
      const response = await configApi.updateConfig(payload, viewMode === "ground" ? "ground" : "aerial");
      return response;
    },
    onSuccess: (data) => {
      dispatch(
        updateConfigState({
          confidence_threshold: data.config.confidence_threshold,
          zone_polygon: data.config.zone_polygon,
          isSaving: false,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["config"] });
    },
    onError: (err) => {
      console.error("Config update error", err);
      dispatch(setIsSaving(false));
    },
  });
};
