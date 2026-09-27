import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi, UpdateConfigPayload } from "../api/configApi";
import { useAppDispatch } from "@/store";
import { updateConfigState, setIsSaving } from "@/store/slices/configSlice";

export const useConfigMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (payload: UpdateConfigPayload) => {
      dispatch(setIsSaving(true));
      const response = await configApi.updateConfig(payload);
      return response;
    },
    onSuccess: (data) => {
      dispatch(
        updateConfigState({
          multi_person_threshold: data.config.multi_person_threshold,
          confidence_threshold: data.config.confidence_threshold,
          proximity_alert_distance_px: data.config.proximity_alert_distance_px,
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
