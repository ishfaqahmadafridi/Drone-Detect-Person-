"use client";

import type { ChannelPanelProps } from "@/types";
import { useChannelPanel } from "@/hooks/useChannelPanel";
import { getChannelStreamUrl, getChannelSnapshotUrl } from "@/constants/network";
import { VIDEO_TESTING } from "@/constants/tactical";
import { VideoUploadControls } from "./VideoUploadControls";
import { StreamSourceSelector } from "./toolbar/StreamSourceSelector";
import { SuspectSelection } from "./SuspectSelection";
import { useVideoStreamUrl } from "@/hooks/useVideoStreamUrl";

export function ChannelVideoPanel({ channel }: ChannelPanelProps) {
  const { containerRef, telemetry, revision, sourceType, networkUrl, setNetworkUrl, showNetwork, pending, error, streamError, setStreamError, toggleFullscreen, upload, selectSource, submitNetwork, reconnect, replay } = useChannelPanel(channel);
  const streamUrl = useVideoStreamUrl(getChannelStreamUrl(channel, revision));
  return (
    <section aria-label={`${channel} video panel`} className="min-w-0 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-2 p-3">
        <h2 className="font-semibold">{channel === "ground" ? "Ground CCTV" : "Aerial drone"}</h2>
        <span className="text-xs">{sourceType === "synthetic" ? "Simulation" : sourceType === "file" ? "Uploaded video" : "Camera stream"}</span>
      </header>
      <div ref={containerRef} className="relative aspect-video bg-black flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={streamUrl} alt={`${channel} person detection stream`} className="w-full h-full object-contain" onLoad={() => setStreamError(false)} onError={() => setStreamError(true)} />
        {streamError && <div role="alert" className={VIDEO_TESTING.panelClass}>Stream unavailable. <button className={VIDEO_TESTING.buttonClass} onClick={reconnect}>Reconnect</button></div>}
      </div>
      <div className="flex flex-wrap gap-3 p-3 text-xs" aria-live="polite">
        <span>Persons: {telemetry.total_persons ?? 0}</span>
        <span>Processing: {(telemetry.fps ?? 0).toFixed(1)} FPS</span>
        <span>{telemetry.model_name || "Loading model…"}</span>
        {sourceType === "file" && telemetry.video_finished && <span>Video ended · matching can continue</span>}
      </div>
      <VideoUploadControls {...upload} />
      <fieldset disabled={pending || upload.pending} className={VIDEO_TESTING.panelClass}>
        <legend className="sr-only">{channel} stream controls</legend>
        <StreamSourceSelector sourceType={sourceType} viewMode={channel} onSourceSelect={selectSource} />
        <button className={VIDEO_TESTING.buttonClass} onClick={toggleFullscreen}>Fullscreen</button>
        <a className={VIDEO_TESTING.buttonClass} href={getChannelSnapshotUrl(channel)} download={`${channel}-frame.jpg`}>Save frame</a>
        <button className={VIDEO_TESTING.buttonClass} onClick={reconnect}>Reconnect</button>
        {sourceType === "file" && <button className={VIDEO_TESTING.buttonClass} onClick={() => void replay()}>Replay video</button>}
        {showNetwork && <form onSubmit={submitNetwork} className="flex flex-wrap gap-2 w-full">
          <input aria-label={`${channel} camera URL`} required value={networkUrl} onChange={event => setNetworkUrl(event.target.value)} placeholder={channel === "ground" ? "RTSP / HTTP camera URL" : "Drone RTSP URL"} className="flex-1 min-w-0 rounded border bg-transparent p-2" />
          <button className={VIDEO_TESTING.buttonClass} disabled={pending}>{pending ? "Connecting…" : "Connect"}</button>
        </form>}
        {error && <p role="alert" className="w-full text-sm">{error}</p>}
      </fieldset>
      {channel === "ground" && <SuspectSelection key={`${sourceType}:${revision}`} channel={channel} sourceType={sourceType} selectedTargetIds={telemetry.selected_target_ids ?? []} />}
    </section>
  );
}
