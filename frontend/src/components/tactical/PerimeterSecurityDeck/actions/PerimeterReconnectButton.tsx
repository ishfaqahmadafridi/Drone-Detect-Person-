"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterReconnectButtonProps } from "@/types";
import { RefreshCw } from "lucide-react";

export const PerimeterReconnectButton: React.FC<PerimeterReconnectButtonProps> = ({
  onReconnect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onReconnect?.()}
      className={TACTICAL_VIEW_STYLES.PerimeterActionButtons_button_className}
      title="Reconnect or reset CCTV feed connection"
    >
      <RefreshCw className="w-3.5 h-3.5" />
      <span>RECONNECT RTSP</span>
    </button>
  );
};

export default PerimeterReconnectButton;
