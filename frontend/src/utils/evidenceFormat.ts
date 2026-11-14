import type { SnapshotItem } from "@/types";

export function isVideoEvidence(item: Pick<SnapshotItem, "media_type" | "filename">): boolean {
  return item.media_type === "video" || /\.(mp4|webm|mkv|avi|mov)$/i.test(item.filename);
}

export function formatFileSize(sizeKb?: number): string {
  if (sizeKb == null || !Number.isFinite(sizeKb)) return "";
  if (sizeKb >= 1024 * 1024) return `${(sizeKb / 1024 / 1024).toFixed(1)} GB`;
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${Math.round(sizeKb)} KB`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return mins ? `${mins} min ${secs.toString().padStart(2, "0")} s` : `${secs} s`;
}
