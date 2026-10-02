import { apiClient } from "./client";
import { TacticalCameraChannel } from "@/types";

export interface CameraListResponse {
  cameras: TacticalCameraChannel[];
  active_camera_id: string;
}

export interface CameraSwitchResponse {
  success: boolean;
  message: string;
  active_camera: TacticalCameraChannel;
}

export interface CameraCreatePayload {
  name: string;
  location: string;
  device_type?: string;
  view_mode?: string;
  source_type?: string;
  stream_url?: string;
  ip_address?: string;
  resolution?: string;
}

export const cameraApi = {
  listCameras: async (): Promise<CameraListResponse> => {
    const { data } = await apiClient.get<CameraListResponse>("/cameras");
    return data;
  },

  getActiveCamera: async (): Promise<TacticalCameraChannel> => {
    const { data } = await apiClient.get<TacticalCameraChannel>("/cameras/active");
    return data;
  },

  activateCamera: async (cameraId: string): Promise<CameraSwitchResponse> => {
    const { data } = await apiClient.post<CameraSwitchResponse>(`/cameras/${cameraId}/activate`);
    return data;
  },

  registerCamera: async (payload: CameraCreatePayload): Promise<TacticalCameraChannel> => {
    const { data } = await apiClient.post<TacticalCameraChannel>("/cameras", payload);
    return data;
  },
};
