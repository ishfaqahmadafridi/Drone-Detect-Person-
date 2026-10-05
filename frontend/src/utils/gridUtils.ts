import { TacticalCameraChannel } from "@/types";

export const getSplitGridLayoutClass = (channelCount: number): string => {
  if (channelCount <= 1) return "grid grid-cols-1";
  if (channelCount === 2) {
    return "grid grid-cols-1 md:grid-cols-2";
  }
  if (channelCount === 3) {
    return "grid grid-cols-1 md:grid-cols-3";
  }
  return "grid grid-cols-1 md:grid-cols-2";
};

export const filterConnectedChannels = (
  allChannels: readonly TacticalCameraChannel[],
  connectedIds: readonly string[],
  layoutMode: "dual" | "quad" = "dual"
): readonly TacticalCameraChannel[] => {
  const matched = allChannels.filter((cam) => connectedIds.includes(cam.id));
  if (matched.length > 0) {
    return matched;
  }
  return allChannels.slice(0, layoutMode === "dual" ? 2 : 4);
};
