import { useState } from "react";
import type { StreamLinkProberProps, TestConnectionResponse } from "@/types";
import { streamApi } from "@/services/api/streamApi";

export function useStreamLinkProber({ constructedUrl, sourceType = "rtsp", host, port, streamPath, username, password }: StreamLinkProberProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResponse | null>(null);

  const handleTestLink = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await streamApi.testConnection({
        source_type: sourceType,
        source_path: constructedUrl,
        host,
        port,
        stream_path: streamPath,
        username: username || undefined,
        password: password || undefined,
      });
      setTestResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Probe failed";
      setTestResult({
        success: false,
        message: `Connection probe error: ${msg}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return { isTesting, testResult, handleTestLink };
}
