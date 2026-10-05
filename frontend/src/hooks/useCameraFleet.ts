import { useQuery } from "@tanstack/react-query";
import { cameraApi } from "@/services/api/cameraApi";
import { DEFAULT_TACTICAL_CAMERAS, VIDEO_TESTING } from "@/constants/tactical";

export const CAMERA_FLEET_QUERY_KEY = ["camera-fleet"] as const;

export function useCameraFleet() {
  const query = useQuery({
    queryKey: CAMERA_FLEET_QUERY_KEY,
    queryFn: cameraApi.listCameras,
    staleTime: VIDEO_TESTING.cameraQueryStaleMs,
  });
  return { ...query, cameras: query.data?.cameras ?? DEFAULT_TACTICAL_CAMERAS };
}
