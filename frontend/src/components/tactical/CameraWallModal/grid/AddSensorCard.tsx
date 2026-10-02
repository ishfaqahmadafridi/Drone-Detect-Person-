"use client";

import React from "react";
import { AddSensorCardProps } from "@/types";
import { Plus } from "lucide-react";

export const AddSensorCard: React.FC<AddSensorCardProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/add relative flex flex-col items-center justify-center p-6 rounded-xl bg-[#06080E]/70 hover:bg-emerald-950/20 border border-dashed border-slate-700/80 hover:border-emerald-400 transition-all duration-300 cursor-pointer min-h-[200px]"
    >
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 group-hover/add:border-emerald-400 group-hover/add:bg-emerald-500/20 text-emerald-400 transition-all mb-2.5">
        <Plus className="w-6 h-6 group-hover/add:scale-125 transition-transform" />
      </div>
      <span className="font-display font-bold text-xs uppercase tracking-wider text-white group-hover/add:text-emerald-300 transition-colors">
        CONNECT NEW SENSOR
      </span>
      <span className="font-mono-code text-[10px] text-slate-400 mt-1 text-center">
        Configure IP, RTSP, or PoE Ground Camera
      </span>
    </button>
  );
};

export default AddSensorCard;
