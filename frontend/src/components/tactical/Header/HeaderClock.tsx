"use client";

import React from "react";
import { HeaderClockProps } from "@/types";

export const HeaderClock: React.FC<HeaderClockProps> = ({ utcTime }) => {
  return (
    <div className="text-right font-mono-code mr-1">
      <div className="text-[10px] text-slate-400">LOCAL TIME</div>
      <div className="text-sm font-bold text-cyan-400">{utcTime || "--:--:--"}</div>
    </div>
  );
};

export default HeaderClock;
