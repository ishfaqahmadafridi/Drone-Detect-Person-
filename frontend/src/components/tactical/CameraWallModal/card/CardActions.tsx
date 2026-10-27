"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraCardActionsProps } from "@/types";
import { CheckCircle2, PlusCircle, XCircle } from "lucide-react";

export const CardActions: React.FC<CameraCardActionsProps> = ({
  isActive,
  isConnected,
  onSelect,
  onToggleConnect,
}) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      {isConnected ? (
        <>
          {/* Already Connected: Option to Set as Primary or Disconnect */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              isActive
                ? TACTICAL_VIEW_STYLES.CardActions_button_className
                : TACTICAL_VIEW_STYLES.CardActions_button_className_2
            }`}
          >
            <CheckCircle2 className={TACTICAL_VIEW_STYLES.CardActions_CheckCircle2_className} />
            <span>{isActive ? "ACTIVE PRIMARY" : "SET AS PRIMARY"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleConnect();
            }}
            title="Disconnect camera from simultaneous multi-view"
            className={TACTICAL_VIEW_STYLES.CardActions_button_className_3}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>UNLINK</span>
          </button>
        </>
      ) : (
        <>
          {/* Not Connected: One-Click Multi-Camera Connect */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleConnect();
            }}
            className={TACTICAL_VIEW_STYLES.CardActions_button_className_4}
          >
            <PlusCircle className="w-4 h-4" />
            <span>CONNECT SENSOR (MULTI-LIVE)</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CardActions;
