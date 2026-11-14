"use client";
import { FilePlay, RotateCcw, Square, Upload } from "lucide-react";
import type { VideoUploadControlsProps } from "@/types";
import { VIDEO_TESTING, VIDEO_TOOLS } from "@/constants/tactical";

export function VideoUploadControls({
  inputRef, pending, progress, message, error, onChange, isTesting = false, finished = false, busy = false, onReplay, onStopTest,
}: VideoUploadControlsProps) {
  const uploadLabel = pending ? (progress < 100 ? `Uploading ${progress}%` : "Checking video…") : isTesting ? "Choose another video" : "Choose video";
  return (
    <section aria-label="Test with a video file" className={VIDEO_TOOLS.cardClass}>
      <div className={VIDEO_TOOLS.cardBodyClass}>
        <span className={VIDEO_TOOLS.iconWrapClass}><FilePlay aria-hidden="true" className={VIDEO_TOOLS.iconClass} /></span>
        <div className="min-w-0">
          <h3 className={VIDEO_TOOLS.titleClass}>Test with a video file</h3>
          <p className={VIDEO_TOOLS.bodyClass}>
            Upload a recording and every person in it is boxed and numbered. {VIDEO_TOOLS.uploadFormats}.
          </p>
          {isTesting && <p role="status" className={VIDEO_TOOLS.statusClass}>{finished ? "Video finished. Replay it or go back to the live feed." : message || "Playing your test video."}</p>}
          {!isTesting && message && <p role="status" className={VIDEO_TOOLS.statusClass}>{message}</p>}
          {error && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}
        </div>
      </div>
      <div className={VIDEO_TOOLS.actionsClass}>
        <input ref={inputRef} type="file" accept={VIDEO_TESTING.extensions.join(",")} onChange={onChange} disabled={pending} className="hidden" aria-label="Upload a test video" />
        {isTesting && onReplay && (
          <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} disabled={busy || pending} onClick={onReplay}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />Replay
          </button>
        )}
        {isTesting && onStopTest && (
          <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} disabled={busy || pending} onClick={onStopTest}>
            <Square aria-hidden="true" className="h-4 w-4" />Back to live feed
          </button>
        )}
        <button type="button" className={VIDEO_TOOLS.primaryButtonClass} disabled={pending} onClick={() => inputRef.current?.click()}>
          <Upload aria-hidden="true" className="h-4 w-4" />{uploadLabel}
        </button>
      </div>
    </section>
  );
}
