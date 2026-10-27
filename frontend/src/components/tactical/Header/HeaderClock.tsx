"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { HeaderClockProps } from "@/types";

export const HeaderClock: React.FC<HeaderClockProps> = ({ utcTime }) => {
  return (
    <div className="text-right font-mono-code mr-1">
      <div className={TACTICAL_VIEW_STYLES.HeaderClock_div_className}>LOCAL TIME</div>
      <div className={TACTICAL_VIEW_STYLES.HeaderClock_div_className_2}>{utcTime || "--:--:--"}</div>
    </div>
  );
};

export default HeaderClock;
