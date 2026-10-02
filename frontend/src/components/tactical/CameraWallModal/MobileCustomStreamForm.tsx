"use client";

import React from "react";
import { MobileCustomStreamFormProps } from "@/types";

export const MobileCustomStreamForm: React.FC<MobileCustomStreamFormProps> = ({
  onConnectRtsp,
}) => {
  return (
    <div className="w-full pt-2.5 border-t border-slate-700/60 flex flex-col gap-1.5 text-left">
      <span className="font-mono-code text-[10px] font-semibold text-blue-400">
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
        className="flex items-center gap-2"
      >
        <input
          name="phoneStreamUrl"
          type="text"
          defaultValue="http://10.10.20.117:8080"
          placeholder="http://10.10.20.117:8080"
          className="flex-1 bg-[#06080E] border border-slate-700/80 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 outline-none transition-all"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-display text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer shadow-sm"
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
