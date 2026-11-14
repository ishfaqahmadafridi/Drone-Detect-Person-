import React from "react";
import { Cctv, Smartphone } from "lucide-react";
import { CONNECTIONS_UI, VIDEO_TOOLS } from "@/constants/tactical";
import type { CameraConnectionRowProps } from "@/types";

export const CameraConnectionRow: React.FC<CameraConnectionRowProps> = ({ camera, isConnected, isMain, onConnect, onDisconnect }) => {
  const Icon = camera.deviceType === "mobile_phone" ? Smartphone : Cctv;
  const online = camera.status === "ONLINE";
  return (
    <li className={CONNECTIONS_UI.rowClass}>
      <div className={CONNECTIONS_UI.rowMainClass}>
        <span className={CONNECTIONS_UI.rowIconClass}><Icon aria-hidden="true" className="h-4 w-4" /></span>
        <div className="min-w-0">
          <p className={CONNECTIONS_UI.rowNameClass}>{camera.name}</p>
          <p className={CONNECTIONS_UI.rowMetaClass}>
            {CONNECTIONS_UI.deviceLabels[camera.deviceType]} · {camera.location}
          </p>
        </div>
      </div>
      <div className={CONNECTIONS_UI.rowActionsClass}>
        <span className={online ? CONNECTIONS_UI.pillClass.on : CONNECTIONS_UI.pillClass.off}>
          {CONNECTIONS_UI.cameraStatusLabels[camera.status]}
        </span>
        {isMain ? (
          <span className={CONNECTIONS_UI.pillClass.on}>Main view</span>
        ) : isConnected ? (
          <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} onClick={() => onDisconnect(camera.id)}>Disconnect</button>
        ) : (
          <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} onClick={() => onConnect(camera.id)}>Connect</button>
        )}
      </div>
    </li>
  );
};

export default CameraConnectionRow;
