"use client";

import React from "react";
import { Film } from "lucide-react";
import { ListItemThumbnailProps } from "@/types";

export const ListItemThumbnail: React.FC<ListItemThumbnailProps> = ({
  filename,
  url,
}) => {
  const isVideo = filename.toLowerCase().endsWith(".mp4") || url?.toLowerCase().endsWith(".mp4");

  return (
    <div className="relative w-16 h-12 shrink-0 rounded-lg bg-slate-950 border border-slate-700/60 overflow-hidden flex items-center justify-center">
      {url && !isVideo ? (
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <Film className={`w-5 h-5 ${isVideo ? "text-purple-400" : "text-slate-600"}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

      {isVideo && (
        <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-purple-500/80 text-[8px] font-mono-code font-bold text-white shadow">
          MP4
        </span>
      )}
    </div>
  );
};

export default ListItemThumbnail;
