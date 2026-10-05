import type { CameraWireModel, TacticalCameraChannel } from "@/types";

export function normalizeCamera(camera: CameraWireModel): TacticalCameraChannel {
  return {
    id: camera.id,
    channelNum: camera.channel_num,
    name: camera.name,
    location: camera.location,
    deviceType: camera.device_type,
    viewMode: camera.view_mode,
    sourceType: camera.source_type,
    streamUrl: camera.stream_url ?? undefined,
    ipAddress: camera.ip_address ?? undefined,
    status: camera.status,
    resolution: camera.resolution ?? undefined,
  };
}
