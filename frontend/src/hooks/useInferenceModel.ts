"use client";

import { useAppSelector } from "@/store";

export function useInferenceModel() {
  return useAppSelector((state) => state.telemetry.engine) || "MODEL CONNECTING";
}

export default useInferenceModel;
