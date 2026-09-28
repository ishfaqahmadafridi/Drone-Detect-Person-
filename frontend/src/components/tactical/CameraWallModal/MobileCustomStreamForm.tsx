"use client";

import React from "react";
import { MobileCustomStreamFormProps } from "@/types";

export const MobileCustomStreamForm: React.FC<MobileCustomStreamFormProps> = ({
  onConnectRtsp,
}) => {
  return (
    <div className="w-full pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 text-left">
      <span className="font-mono-code text-[10px] text-cyan-400">
        OR ENTER CUSTOM MOBILE PHONE IP STREAM:
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("phoneStreamUrl") as HTMLInputElement;
          if (input?.value && onConnectRtsp) {
            onConnectRtsp(input.value);
          }
        }}
        className="flex items-center gap-1.5"
      >
        <input
          name="phoneStreamUrl"
          type="text"
          defaultValue="http://10.10.20.117:8080"
          placeholder="http://10.10.20.117:8080"
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-[11px] font-mono-code focus:border-cyan-400 outline-none"
        />
        <button
          type="submit"
          className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-display text-[10px] font-bold uppercase transition-colors shrink-0"
        >
          LINK PHONE
        </button>
      </form>
      <span className="font-mono-code text-[9px] text-slate-400">
        Tip: Use free app &ldquo;IP Webcam&rdquo; (Android) or &ldquo;Live-Reporter&rdquo; (iOS).
      </span>
    </div>
  );
};
