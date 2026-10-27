import type { CameraListResponse, CameraSwitchResponse, CameraCreatePayload } from "@/types";
export type { CameraListResponse, CameraSwitchResponse, CameraCreatePayload } from "@/types";
import { apiClient } from "./client";
import { TacticalCameraChannel, CameraWireModel } from "@/types";
import { normalizeCamera } from "@/utils/cameraUtils";







export const cameraApi = {
  listCameras: async (): Promise<CameraListResponse> => {
    const { data } = await apiClient.get<{ cameras: CameraWireModel[]; active_camera_id: string }>("/cameras");
    return { ...data, cameras: data.cameras.map(normalizeCamera) };
  },

  getActiveCamera: async (): Promise<TacticalCameraChannel> => {
    const { data } = await apiClient.get<CameraWireModel>("/cameras/active");
    return normalizeCamera(data);
  },

  activateCamera: async (cameraId: string): Promise<CameraSwitchResponse> => {
    const { data } = await apiClient.post<{ success: boolean; message: string; active_camera: CameraWireModel }>(`/cameras/${encodeURIComponent(cameraId)}/activate`);
    return { ...data, active_camera: normalizeCamera(data.active_camera) };
  },

  registerCamera: async (payload: CameraCreatePayload): Promise<TacticalCameraChannel> => {
    const { data } = await apiClient.post<CameraWireModel>("/cameras", payload);
    return normalizeCamera(data);
  },
};
