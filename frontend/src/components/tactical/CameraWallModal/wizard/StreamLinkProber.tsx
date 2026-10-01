"use client";

import React, { useState } from "react";
import { StreamLinkProberProps, TestConnectionResponse } from "@/types";
import { streamApi } from "@/services/api/streamApi";
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

  return (
    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
      <div className="flex items-center gap-2 text-xs font-mono-code min-w-0 flex-1">
        <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
        {testResult ? (
          testResult.success ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>LINK ONLINE ({testResult.latency_ms}ms)</span>
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px] truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{testResult.message}</span>
            </span>
          )
        ) : (
          <span className="text-slate-400 text-[10px] truncate">
            Click probe to test target port reachability
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleTestLink}
        disabled={isTesting}
        className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-mono-code text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 disabled:opacity-50"
      >
        {isTesting && <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />}
        <span>{isTesting ? "PROBING..." : "TEST LINK"}</span>
      </button>
    </div>
  );
};
