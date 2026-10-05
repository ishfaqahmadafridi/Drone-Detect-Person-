import { useSyncExternalStore } from "react";
import { resolveVideoStreamUrl } from "@/constants/network";

const subscribe = () => () => {};

export function useVideoStreamUrl(path: string): string {
  // Keep SSR and the first hydration render identical, then resolve the local video origin.
  return useSyncExternalStore(subscribe, () => resolveVideoStreamUrl(path), () => path);
}
