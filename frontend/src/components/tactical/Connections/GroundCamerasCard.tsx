"use client";
import React from "react";
import { Cctv, Plus } from "lucide-react";
import { CONNECTIONS_UI, EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useGroundConnections } from "@/hooks/useConnections";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";
import { CameraConnectionRow } from "./CameraConnectionRow";

export const GroundCamerasCard: React.FC = () => {
  const {
    groundCameras, mainId, isConnected, connectedCount, connect, disconnect,
    addCamera, name, setName, url, setUrl, pending, error,
  } = useGroundConnections();

  return (
    <section aria-label="Ground cameras" className={EVIDENCE_UI.cardClass}>
      <EvidenceSectionHeader
        icon={Cctv}
        title="Ground cameras"
        count={groundCameras.length}
        description={`${connectedCount} of ${groundCameras.length} shown together on the live page. Add as many as you need.`}
      />
      <ul className={EVIDENCE_UI.listClass}>
        {groundCameras.map(camera => (
          <CameraConnectionRow
            key={camera.id}
            camera={camera}
            isMain={camera.id === mainId}
            isConnected={isConnected(camera.id)}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        ))}
      </ul>

      <form onSubmit={addCamera} className="flex flex-col gap-2" aria-label="Add a camera">
        <span className={CONNECTIONS_UI.formLabelClass}>Add a camera</span>
        <div className={CONNECTIONS_UI.formClass}>
          <input aria-label="Camera name" required value={name} onChange={event => setName(event.target.value)} placeholder="Camera name, e.g. Back gate" className={CONNECTIONS_UI.inputClass} />
          <input aria-label="Stream URL" required value={url} onChange={event => setUrl(event.target.value)} placeholder="rtsp://… or http://… stream URL" className={CONNECTIONS_UI.inputClass} />
          <button type="submit" disabled={pending} className={VIDEO_TOOLS.primaryButtonClass}>
            <Plus aria-hidden="true" className="h-4 w-4" />{pending ? "Adding…" : "Add camera"}
          </button>
        </div>
        {error && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}
      </form>
    </section>
  );
};

export default GroundCamerasCard;
