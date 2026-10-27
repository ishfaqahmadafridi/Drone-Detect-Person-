"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { MobilePixelQuickConnectProps } from "@/types";

export const MobilePixelQuickConnect: React.FC<MobilePixelQuickConnectProps> = ({
  onConnectRtsp,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onConnectRtsp) {
          onConnectRtsp(CAMERA_UI_TEXT.MobileCustomStreamForm_1);
        }
      }}
      className={TACTICAL_VIEW_STYLES.MobilePixelQuickConnect_button_className}
    >
      <span>{CAMERA_UI_TEXT.cameraLabel_2}</span>
    </button>
  );
};

export default MobilePixelQuickConnect;
