"use client";

import React from "react";
import { Film, Play } from "lucide-react";
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
        <>
          <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-purple-500/90 text-[8px] font-mono-code font-bold text-white shadow z-10">
            MP4
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-5 h-5 rounded-full bg-purple-950/90 border border-purple-400/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-2.5 h-2.5 text-purple-200 fill-purple-200 ml-0.5" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItemThumbnail;
