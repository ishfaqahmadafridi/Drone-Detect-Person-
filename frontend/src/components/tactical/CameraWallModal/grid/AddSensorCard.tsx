"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AddSensorCardProps } from "@/types";
import { Plus } from "lucide-react";

export const AddSensorCard: React.FC<AddSensorCardProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={TACTICAL_VIEW_STYLES.AddSensorCard_button_className}
    >
      <div className={TACTICAL_VIEW_STYLES.AddSensorCard_div_className}>
        <Plus className="w-6 h-6 group-hover/add:scale-125 transition-transform" />
      </div>
      <span className={TACTICAL_VIEW_STYLES.AddSensorCard_span_className}>
        CONNECT NEW SENSOR
      </span>
      <span className={TACTICAL_VIEW_STYLES.AddSensorCard_span_className_2}>
        Configure IP, RTSP, or PoE Ground Camera
      </span>
    </button>
  );
};

export default AddSensorCard;
