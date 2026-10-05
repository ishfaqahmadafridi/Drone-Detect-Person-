import { useRef, useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import { streamApi } from "@/services/api/streamApi";
import { VIDEO_TESTING } from "@/constants/tactical";
import { apiErrorMessage } from "@/utils/apiError";

export function useVideoUpload(onUploaded: () => void, channel?: "ground" | "aerial") {
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busyRef.current) return;
    setError("");
    setMessage("");
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!VIDEO_TESTING.extensions.includes(extension) || file.size === 0 || file.size > VIDEO_TESTING.maxBytes) {
      setError("Choose a non-empty MP4, AVI, MOV, MKV, WebM or M4V video up to 500 MB.");
      return;
    }
    busyRef.current = true;
    setPending(true);
    setProgress(0);
    try {
      await streamApi.uploadVideo(file, setProgress, channel);
      if (!channel) dispatch(setTelemetryData({ source_type: "file", selected_target_ids: [], tracking_mode: "auto" }));
      setMessage(`Testing: ${file.name}`);
      onUploaded();
    } catch (error) {
      setError(apiErrorMessage(error));
    } finally {
      busyRef.current = false;
      setPending(false);
    }
  };
  return { inputRef, pending, progress, message, error, onChange };
}
