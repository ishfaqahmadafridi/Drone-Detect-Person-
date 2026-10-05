import type { FrozenSelection, SuspectSnapshot } from "@/types";

/** Crop the exact frozen frame used for selection, never a later live frame. */
export async function cropSuspectSnapshots(
  snapshot: FrozenSelection,
  selectedIds: number[],
): Promise<SuspectSnapshot[]> {
  if (!selectedIds.length) return [];
  const image = new Image();
  image.src = snapshot.image;
  await image.decode();
  const capturedAt = new Date().toISOString();
  return snapshot.detections.filter(person => selectedIds.includes(person.id)).map(person => {
    const [left, top, right, bottom] = person.bbox;
    const x = Math.max(0, Math.min(snapshot.width, left));
    const y = Math.max(0, Math.min(snapshot.height, top));
    const width = Math.min(snapshot.width, right) - x;
    const height = Math.min(snapshot.height, bottom) - y;
    if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
      throw new Error("Invalid person box. Resume and select a new frame.");
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not save suspect snapshot in this browser.");
    const scaleX = image.naturalWidth / snapshot.width;
    const scaleY = image.naturalHeight / snapshot.height;
    context.drawImage(image, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0, 0, canvas.width, canvas.height);
    return { id: person.id, image: canvas.toDataURL("image/jpeg"), capturedAt };
  });
}
