"use client";

import { useReID } from "@/hooks/useReID";
import { REID_UI, VIDEO_TESTING } from "@/constants/tactical";
import { ReIDTargetResults } from "./ReIDTargetResults";
import { getChannelStreamUrl } from "@/constants/network";
import { useVideoStreamUrl } from "@/hooks/useVideoStreamUrl";

export function ReIDPanel() {
  const { status, error, pending, retry, reconnect, groundCameraId } = useReID();
  const groundStreamUrl = useVideoStreamUrl(getChannelStreamUrl("ground", 0, groundCameraId));
  return (
    <section className={REID_UI.panelClass} aria-label="Ground to aerial person matching">
      {/* Keep the selected ground track collecting reference frames while the aerial feed is visible. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={groundStreamUrl} alt="" aria-hidden="true" className="hidden" />
      <header className="flex flex-wrap justify-between gap-2">
        <h2 className="font-semibold">Aerial person matching</h2>
        <span className="text-sm" role="status">
          {status?.status ?? (error ? "Disconnected" : "Connecting")}
        </span>
      </header>
      {error && <p role="alert" className={REID_UI.errorClass}>{error}</p>}
      {error && <button disabled={pending} onClick={() => void reconnect()} className={VIDEO_TESTING.buttonClass}>
        {pending ? "Reconnecting…" : "Reconnect matching"}
      </button>}
      {status && (
        <>
          <p className={REID_UI.mutedClass}>{status.message}</p>
          {status.status === "error" && (
            <button disabled={pending} onClick={() => void retry()} className={VIDEO_TESTING.buttonClass}>
              {pending ? "Retrying..." : "Retry matching"}
            </button>
          )}
          {status.status !== "disabled" && (
            <>
              {!status.threshold_configured && status.targets.length > 0 && (
                <p className={REID_UI.mutedClass}>
                  Ranking only: a top result may still be a different person. Similarity is not confidence.
                </p>
              )}
              {!status.targets.length && (
                <p className={REID_UI.mutedClass}>
                  Select a person in the ground panel. Use real camera footage or uploaded
                  videos of your consenting volunteers in both views.
                </p>
              )}
              <p className={REID_UI.mutedClass}>
                Aerial tracks buffered: {status.gallery_tracks}
                {status.last_inference_ms !== null
                  ? ` · Last completed batch: ${(status.last_inference_ms / 1000).toFixed(1)} seconds`
                  : ""}
              </p>
              {status.targets.map(target => (
                <ReIDTargetResults key={target.target_key} target={target} />
              ))}
            </>
          )}
        </>
      )}
    </section>
  );
}
