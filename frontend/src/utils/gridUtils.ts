import { VIEWPORT_LAYOUT_CAPACITY, VIEWPORT_LAYOUT_OPTIONS, VIEWPORT_CONTROLS } from "@/constants/tactical";
import type { ViewportLayoutMode, StreamChannel } from "@/types";
import { TacticalCameraChannel } from "@/types";

export const getSplitGridLayoutClass = (channelCount: number): string =>
  channelCount <= VIEWPORT_LAYOUT_CAPACITY.single ? VIEWPORT_CONTROLS.singleGridClass : VIEWPORT_CONTROLS.gridClass;

export const availableViewportLayouts = (cameraCount: number) =>
  VIEWPORT_LAYOUT_OPTIONS.filter(option => cameraCount >= option.minCameras);

export function resolveViewportLayout(layout: ViewportLayoutMode, cameraCount: number): ViewportLayoutMode {
  const available = availableViewportLayouts(cameraCount);
  return available.some(option => option.mode === layout) ? layout : available.at(-1)?.mode ?? "single";
}

export function selectViewportCameras(
  cameras: readonly TacticalCameraChannel[],
  connectedIds: readonly string[],
  view: StreamChannel,
  activeId: string,
  layout: ViewportLayoutMode,
): readonly TacticalCameraChannel[] {
  const connected = cameras.filter(camera => camera.viewMode === view && connectedIds.includes(camera.id));
  const active = connected.find(camera => camera.id === activeId);
  const ordered = active ? [active, ...connected.filter(camera => camera.id !== activeId)] : connected;
  return ordered.slice(0, VIEWPORT_LAYOUT_CAPACITY[layout]);
}
