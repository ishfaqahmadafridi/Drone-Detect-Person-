import { PanelsTopLeft } from "lucide-react";
import { VIEWPORT_CONTROLS } from "@/constants/tactical";
import type { ViewportHeaderProps } from "@/types";
import { SensorTitleCluster } from "./SensorTitleCluster";
import { ViewportLayoutSelector } from "./ViewportLayoutSelector";
import { ViewportHeaderActions } from "./ViewportHeaderActions";

export function ViewportHeader({ layoutMode, connectedCameraCount, onLayoutChange, onManageCameras, ...actions }: ViewportHeaderProps) {
  return (
    <div role="group" aria-label="Video viewport controls" className={VIEWPORT_CONTROLS.headerClass}>
      <SensorTitleCluster />
      <div className={VIEWPORT_CONTROLS.controlsClass}>
        <ViewportLayoutSelector layoutMode={layoutMode} connectedCameraCount={connectedCameraCount} onLayoutChange={onLayoutChange} />
        {onManageCameras && !actions.isFullscreen && (
          <button type="button" className={VIEWPORT_CONTROLS.buttonClass} onClick={onManageCameras}>
            <PanelsTopLeft aria-hidden="true" className={VIEWPORT_CONTROLS.iconClass} />
            <span className={VIEWPORT_CONTROLS.responsiveLabelClass}>Cameras</span>
          </button>
        )}
        <ViewportHeaderActions {...actions} />
      </div>
    </div>
  );
}

export default ViewportHeader;
export * from "./SensorTitleCluster";
export * from "./ViewportLayoutSelector";
export * from "./ViewportHeaderActions";
