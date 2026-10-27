import { VIDEO_TESTING } from "@/constants/tactical";
import { trackingApi } from "@/services/api/trackingApi";
import { cropSuspectSnapshots } from "./suspectSnapshots";
import type { FrozenSelection, StreamChannel } from "@/types";

/** Own the freeze token until it is committed or explicitly resumed. */
export async function captureSuspect(channel?: StreamChannel, targetId?: number) {
  let frame: FrozenSelection | null = null;
  try {
    for (let attempt = 0; attempt < VIDEO_TESTING.captureAttempts; attempt++) {
      frame = await trackingApi.freeze(channel);
      if (frame.detections.length) break;
      await trackingApi.resume(frame.token, channel);
      frame = null;
      if (attempt + 1 < VIDEO_TESTING.captureAttempts) {
        await new Promise(resolve => setTimeout(resolve, VIDEO_TESTING.captureRetryMs));
      }
    }
    if (!frame) throw new Error("No detected person found on the current frame to capture.");
    const requested = frame.detections.find(person => person.id === targetId);
    const chosen = requested ?? frame.detections.reduce((best, person) =>
      (person.conf ?? 0) > (best.conf ?? 0) ? person : best);
    const portraits = await cropSuspectSnapshots(frame, [chosen.id]);
    const result = await trackingApi.commit(frame.token, [chosen.id], channel);
    frame = null;
    return { result, portraits: portraits.filter(person => result.selected_ids.includes(person.id)) };
  } finally {
    if (frame) await trackingApi.resume(frame.token, channel).catch(() => undefined);
  }
}
