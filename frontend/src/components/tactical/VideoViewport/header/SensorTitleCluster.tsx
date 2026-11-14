import { Cctv, Drone } from "lucide-react";
import { VIEWPORT_CONTROLS } from "@/constants/tactical";
import { useActiveCamera } from "@/hooks";
import type { SensorTitleClusterProps } from "@/types";

export function SensorTitleCluster({ className = "" }: SensorTitleClusterProps) {
  const { camId, camName, camLoc, isGround } = useActiveCamera();
  const Icon = isGround ? Cctv : Drone;
  return (
    <div className={`${VIEWPORT_CONTROLS.identityClass} ${className}`} title={`${camId} · ${camLoc}`}>
      <Icon aria-hidden="true" className={VIEWPORT_CONTROLS.sensorIconClass} />
      <h2 className={VIEWPORT_CONTROLS.titleClass}>{camName}</h2>
    </div>
  );
}
