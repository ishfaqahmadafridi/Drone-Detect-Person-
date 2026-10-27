"use client";
import { CAMERA_UI_TEXT } from "@/constants/tactical";

import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { MobileCustomStreamFormProps } from "@/types";

export const MobileCustomStreamForm: React.FC<MobileCustomStreamFormProps> = ({
  onConnectRtsp,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.MobileCustomStreamForm_div_className}>
      <span className={TACTICAL_VIEW_STYLES.MobileCustomStreamForm_span_className}>
        OR ENTER CUSTOM MOBILE PHONE IP STREAM:
      </span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("phoneStreamUrl") as HTMLInputElement;
          if (input?.value && onConnectRtsp) {
            onConnectRtsp(input.value);
          }
        }}
        className="flex items-center gap-2"
      >
        <input
          name="phoneStreamUrl"
          type="text"
          defaultValue={CAMERA_UI_TEXT.MobileCustomStreamForm_1}
          placeholder={CAMERA_UI_TEXT.MobileCustomStreamForm_1}
          className={TACTICAL_VIEW_STYLES.MobileCustomStreamForm_input_className}
        />
        <button
          type="submit"
          className={TACTICAL_VIEW_STYLES.MobileCustomStreamForm_button_className}
        >
          LINK PHONE
        </button>
      </form>
      <span className={TACTICAL_VIEW_STYLES.MobileCustomStreamForm_span_className_2}>
        Tip: Use free app &ldquo;IP Webcam&rdquo; (Android) or &ldquo;Live-Reporter&rdquo; (iOS).
      </span>
    </div>
  );
};

export default MobileCustomStreamForm;
