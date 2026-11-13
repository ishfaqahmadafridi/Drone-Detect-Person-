import { useAppSelector } from "@/store";
import { useStreamMutation } from "@/services/queries/useStreamMutation";

export function useCalibrationView() {
  const sourceType = useAppSelector(state => state.telemetry.source_type);
  const { switchSource } = useStreamMutation();
  const reconnectGround = () => switchSource.mutate({ sourceType, channel: "ground" });
  return { reconnectGround };
}
