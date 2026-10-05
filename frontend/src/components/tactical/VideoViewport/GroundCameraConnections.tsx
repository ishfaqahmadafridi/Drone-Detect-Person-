"use client";

import type { GroundCameraConnectionsProps } from "@/types";
import { useGroundCameraConnections } from "@/hooks/useGroundCameraConnections";
import { VIDEO_TESTING } from "@/constants/tactical";

export function GroundCameraConnections({ onManageCameras }: GroundCameraConnectionsProps) {
  const { groundCameras, connectedIds, name, setName, url, setUrl, pending, error, addCamera, connectCamera } = useGroundCameraConnections();
  return (
    <section aria-label="Ground camera connections" className={VIDEO_TESTING.panelClass}>
      <header className="flex w-full flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">Ground cameras</h3>
          <p className="text-xs">Connect cameras to show their streams together on the main screen.</p>
        </div>
        {onManageCameras && <button className={VIDEO_TESTING.buttonClass} onClick={onManageCameras}>Manage cameras</button>}
      </header>
      <div className="flex w-full flex-wrap gap-2">
        {groundCameras.map(camera => <button key={camera.id} className={VIDEO_TESTING.buttonClass}
          onClick={() => connectCamera(camera.id)} disabled={pending} aria-pressed={connectedIds.includes(camera.id)}>
          {camera.name} · {connectedIds.includes(camera.id) ? "On main screen" : "Connect"}
        </button>)}
      </div>
      <form onSubmit={event => void addCamera(event)} className="flex w-full flex-wrap gap-2">
        <input required aria-label="New ground camera name" placeholder="Camera name" value={name} onChange={event => setName(event.target.value)} className={VIDEO_TESTING.cameraInputClass} disabled={pending} />
        <input required aria-label="New ground camera stream URL" placeholder="RTSP or HTTP stream URL" value={url} onChange={event => setUrl(event.target.value)} className={VIDEO_TESTING.cameraInputClass} disabled={pending} />
        <button className={VIDEO_TESTING.buttonClass} disabled={pending}>{pending ? "Connecting…" : "Add camera"}</button>
      </form>
      {error && <p role="alert" className="w-full text-sm">{error}</p>}
    </section>
  );
}
