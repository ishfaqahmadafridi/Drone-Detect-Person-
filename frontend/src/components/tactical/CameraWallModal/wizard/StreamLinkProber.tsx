"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamLinkProberProps } from "@/types";
import { useStreamLinkProber } from "@/hooks/useStreamLinkProber";
import { Activity, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

/**
 * Standalone tactical stream connection prober component.
 * Validates TCP/RTSP link reachability and latency without disrupting active video loops.
 */
export const StreamLinkProber: React.FC<StreamLinkProberProps> = ({
  constructedUrl,
  sourceType = "rtsp",
  host,
  port,
  streamPath,
  username,
  password,
}) => {
  const { isTesting, testResult, handleTestLink } = useStreamLinkProber({
    constructedUrl, sourceType, host, port, streamPath, username, password,
  });

  return (
    <div className={TACTICAL_VIEW_STYLES.StreamLinkProber_div_className}>
      <div className="flex items-center gap-2 text-xs font-mono-code min-w-0 flex-1">
        <Activity className={TACTICAL_VIEW_STYLES.StreamLinkProber_Activity_className} />
        {testResult ? (
          testResult.success ? (
            <span className={TACTICAL_VIEW_STYLES.StreamLinkProber_span_className}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>LINK ONLINE ({testResult.latency_ms}ms)</span>
            </span>
          ) : (
            <span className={TACTICAL_VIEW_STYLES.StreamLinkProber_span_className_2}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{testResult.message}</span>
            </span>
          )
        ) : (
          <span className={TACTICAL_VIEW_STYLES.StreamLinkProber_span_className_3}>
            Click probe to test target port reachability
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleTestLink}
        disabled={isTesting}
        className={TACTICAL_VIEW_STYLES.StreamLinkProber_button_className}
      >
        {isTesting && <Loader2 className={TACTICAL_VIEW_STYLES.StreamLinkProber_Loader2_className} />}
        <span>{isTesting ? "PROBING..." : "TEST LINK"}</span>
      </button>
    </div>
  );
};
