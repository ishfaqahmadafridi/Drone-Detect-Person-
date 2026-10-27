import { VIDEO_TESTING } from "@/constants/tactical";
import type { FrozenSelection, SuspectSnapshot } from "@/types";

/** Crop the exact frozen frame used for selection, never a later live frame. */
export async function cropSuspectSnapshots(
  snapshot: FrozenSelection,
  selectedIds: number[],
): Promise<SuspectSnapshot[]> {
  if (!selectedIds.length || !snapshot.detections.length) return [];
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not decode frozen frame."));
    image.src = snapshot.image;
    if (image.complete) resolve();
  });

  const capturedAt = new Date().toISOString();
  const matchingDetections = snapshot.detections.filter(person => selectedIds.includes(person.id));

  return matchingDetections.map(person => {
    const [left, top, right, bottom] = person.bbox;
    const imgW = image.naturalWidth || snapshot.width || VIDEO_TESTING.defaultFrameWidth;
    const imgH = image.naturalHeight || snapshot.height || VIDEO_TESTING.defaultFrameHeight;
    const snapW = snapshot.width > 0 ? snapshot.width : imgW;
    const snapH = snapshot.height > 0 ? snapshot.height : imgH;

    const x = Math.max(0, Math.min(snapW, left));
    const y = Math.max(0, Math.min(snapH, top));
    const width = Math.max(VIDEO_TESTING.minimumCropSize, Math.min(snapW, right) - x);
    const height = Math.max(VIDEO_TESTING.minimumCropSize, Math.min(snapH, bottom) - y);

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not save suspect snapshot in this browser.");

    const scaleX = imgW / snapW;
    const scaleY = imgH / snapH;
    context.drawImage(image, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0, 0, canvas.width, canvas.height);
    return { id: person.id, image: canvas.toDataURL("image/jpeg"), capturedAt };
  });
}
