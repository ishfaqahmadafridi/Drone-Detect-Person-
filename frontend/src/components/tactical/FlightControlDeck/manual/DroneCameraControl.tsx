import React from "react";
import type { DroneCameraControlProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

export const DroneCameraControl: React.FC<DroneCameraControlProps> = ({ video, videoError, videoPending, disabled, onStart }) => (
  <section aria-label="Tello camera" className="flex flex-col gap-1.5">
    <div className={DRONE_MOVEMENT.cameraRowClass}>
      <p role="status" aria-label="Tello camera status" className={DRONE_MOVEMENT.mutedClass}>
        {videoPending ? "Starting Tello camera…" : video?.message ?? "Camera starts after SDK connection."}
      </p>
      <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={disabled || videoPending} onClick={onStart}>
        Start Tello camera
      </button>
    </div>
    {videoError && <p role="alert" className={DRONE_MOVEMENT.errorClass}>{videoError}</p>}
  </section>
);
