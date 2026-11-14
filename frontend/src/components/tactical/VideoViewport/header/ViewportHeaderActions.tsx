import { Camera, Maximize2, Minimize2, LoaderCircle } from "lucide-react";
import { VIEWPORT_CONTROLS } from "@/constants/tactical";
import { useViewportActions } from "@/hooks/useViewportActions";
import type { ViewportHeaderActionsProps } from "@/types";

export function ViewportHeaderActions({ onSnapshotTrigger, onToggleFullscreen, isFullscreen, fullscreenSupported }: ViewportHeaderActionsProps) {
  const { pending, error, message, run } = useViewportActions();
  const FullscreenIcon = isFullscreen ? Minimize2 : Maximize2;
  const fullscreenLabel = isFullscreen ? VIEWPORT_CONTROLS.fullscreen.exit : VIEWPORT_CONTROLS.fullscreen.enter;
  return (
    <>
      <div className={VIEWPORT_CONTROLS.actionGroupClass}>
        {onSnapshotTrigger && (
          <button type="button" disabled={pending !== null} aria-busy={pending === "snapshot"}
            className={VIEWPORT_CONTROLS.buttonClass} onClick={() => void run("snapshot", onSnapshotTrigger)}>
            {pending === "snapshot" ? <LoaderCircle aria-hidden="true" className={`${VIEWPORT_CONTROLS.iconClass} animate-spin`} /> : <Camera aria-hidden="true" className={VIEWPORT_CONTROLS.iconClass} />}
              <span className={VIEWPORT_CONTROLS.responsiveLabelClass}>{pending === "snapshot" ? VIEWPORT_CONTROLS.snapshot.pending : VIEWPORT_CONTROLS.snapshot.idle}</span>
          </button>
        )}
        <button type="button" disabled={!fullscreenSupported || pending !== null} aria-pressed={isFullscreen}
          title={fullscreenSupported ? fullscreenLabel : VIEWPORT_CONTROLS.fullscreen.unsupported}
          aria-label={fullscreenLabel} className={VIEWPORT_CONTROLS.buttonClass}
          onClick={() => void run("fullscreen", onToggleFullscreen)}>
          <FullscreenIcon aria-hidden="true" className={VIEWPORT_CONTROLS.iconClass} />
          <span className={VIEWPORT_CONTROLS.responsiveLabelClass}>{fullscreenLabel}</span>
        </button>
      </div>
      {error && <p role="alert" className={VIEWPORT_CONTROLS.errorClass}>{error}</p>}
      {message && <p role="status" className={VIEWPORT_CONTROLS.feedbackClass}>{message}</p>}
    </>
  );
}
