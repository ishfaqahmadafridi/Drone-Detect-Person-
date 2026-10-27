"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { GroundActiveStreamStateProps } from "@/types";
import { ShieldCheck, Eye, Settings } from "lucide-react";

export const GroundActiveStreamState: React.FC<GroundActiveStreamStateProps> = ({
  onPromote,
  onReconfigure,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-4">
      <div className={TACTICAL_VIEW_STYLES.GroundActiveStreamState_div_className}>
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div>
        <h4 className={TACTICAL_VIEW_STYLES.GroundActiveStreamState_h4_className}>
          GROUND SENSOR ENGAGED
        </h4>
        <p className={TACTICAL_VIEW_STYLES.GroundActiveStreamState_p_className}>
          Live stream is active. Select Viewport to promote this camera to main tactical view.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={onPromote}
          className={TACTICAL_VIEW_STYLES.GroundActiveStreamState_button_className}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>VIEWPORT</span>
        </button>

        <button
          type="button"
          onClick={onReconfigure}
          className={TACTICAL_VIEW_STYLES.GroundActiveStreamState_button_className_2}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>RECONFIGURE</span>
        </button>
      </div>
    </div>
  );
};

export default GroundActiveStreamState;
