"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film, Play } from "lucide-react";
import { ListItemThumbnailProps } from "@/types";

export const ListItemThumbnail: React.FC<ListItemThumbnailProps> = ({
  filename,
  url,
}) => {
  const isVideo = filename.toLowerCase().endsWith(".mp4") || url?.toLowerCase().endsWith(".mp4");

  return (
    <div className={TACTICAL_VIEW_STYLES.ListItemThumbnail_div_className}>
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
        <Film className={`w-5 h-5 ${isVideo ? TACTICAL_VIEW_STYLES.PerimeterNightVisionButton_Moon_className : TACTICAL_VIEW_STYLES.PerimeterPowerStatus_span_className_4}`} />
      )}
      <div className={TACTICAL_VIEW_STYLES.ListItemThumbnail_div_className_2} />

      {isVideo && (
        <>
          <span className={TACTICAL_VIEW_STYLES.ListItemThumbnail_span_className}>
            MP4
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={TACTICAL_VIEW_STYLES.ListItemThumbnail_div_className_3}>
              <Play className={TACTICAL_VIEW_STYLES.ListItemThumbnail_Play_className} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItemThumbnail;
