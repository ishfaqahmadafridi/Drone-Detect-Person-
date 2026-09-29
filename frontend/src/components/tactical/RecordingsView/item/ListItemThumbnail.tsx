"use client";

import React from "react";
import { Film } from "lucide-react";
import { ListItemThumbnailProps } from "@/types";

export const ListItemThumbnail: React.FC<ListItemThumbnailProps> = ({ url, filename }) => {
  return (
    <div className="relative w-16 h-12 shrink-0 rounded-lg bg-slate-950 border border-slate-700/60 overflow-hidden flex items-center justify-center">
      {url ? (
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <Film className="w-5 h-5 text-slate-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default ListItemThumbnail;
