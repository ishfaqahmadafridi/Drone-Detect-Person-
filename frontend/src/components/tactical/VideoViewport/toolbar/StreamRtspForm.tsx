"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamRtspFormProps } from "@/types";

export const StreamRtspForm: React.FC<StreamRtspFormProps> = ({
  show,
  isConnectingRtsp,
  rtspInput,
  onRtspInputChange,
  onRtspSubmit,
  placeholder = CAMERA_UI_TEXT.StreamRtspForm_6,
  buttonLabel = "Connect",
}) => {
  if (!show) return null;

  return (
    <form onSubmit={onRtspSubmit} className="flex items-center gap-2 select-none">
      <input
        type="text"
        placeholder={placeholder}
        value={rtspInput}
        onChange={(e) => onRtspInputChange(e.target.value)}
        className={TACTICAL_VIEW_STYLES.StreamRtspForm_input_className}
      />
      <button
        type="submit"
        disabled={isConnectingRtsp}
        className={TACTICAL_VIEW_STYLES.StreamRtspForm_button_className}
      >
        {isConnectingRtsp ? "Connecting..." : buttonLabel}
      </button>
    </form>
  );
};

export default StreamRtspForm;
