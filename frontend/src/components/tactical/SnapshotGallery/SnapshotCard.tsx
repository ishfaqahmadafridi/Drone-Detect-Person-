"use client";

import React from "react";
import { SnapshotCardProps } from "@/types";

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative shrink-0 w-40 h-24 rounded-lg overflow-hidden border border-slate-800 hover:border-cyan-400 transition-all cursor-pointer group shadow-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={snapshot.url}
        alt={snapshot.filename}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {snapshot.view_mode && (
        <span
          className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono-code font-bold uppercase shadow ${
            snapshot.view_mode === "ground"
              ? "bg-blue-600/90 text-white border border-blue-400/40"
              : "bg-emerald-600/90 text-white border border-emerald-400/40"
          }`}
        >
          {snapshot.view_mode}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-sm px-2 py-1 flex flex-col">
        <span className="font-mono-code text-[9px] text-cyan-400 truncate">{snapshot.filename}</span>
        <span className="font-mono-code text-[8px] text-slate-400">{snapshot.created_at}</span>
      </div>
    </div>
  );
};
