"use client";
import type { VideoUploadControlsProps } from "@/types";
import { VIDEO_TESTING } from "@/constants/tactical";

export function VideoUploadControls({ inputRef, pending, progress, message, error, onChange }: VideoUploadControlsProps) {
  return (
    <div className={VIDEO_TESTING.panelClass}>
      <input ref={inputRef} type="file" accept={VIDEO_TESTING.extensions.join(",")} onChange={onChange} disabled={pending} className="hidden" aria-label="Upload a test video" />
      <button type="button" className={VIDEO_TESTING.buttonClass} disabled={pending} onClick={() => inputRef.current?.click()}>
        {pending ? (progress < 100 ? `Uploading ${progress}%` : "Validating video...") : "Upload test video"}
      </button>
      <span className="text-xs">Uses the active perspective&apos;s model. Person boxes with confidence and track IDs. Preview skips frames when the CPU falls behind.</span>
      {message && <p role="status" className="w-full text-sm">{message}</p>}
      {error && <p role="alert" className="w-full text-sm">{error}</p>}
    </div>
  );
}
