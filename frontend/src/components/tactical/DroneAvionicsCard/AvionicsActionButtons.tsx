"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AvionicsActionButtonsProps } from "@/types";

export const AvionicsActionButtons: React.FC<AvionicsActionButtonsProps> = ({
  onOpenFlightDeck,
  onConnectAirLink,
}) => {
  if (!onOpenFlightDeck && !onConnectAirLink) return null;

  return (
    <div className={TACTICAL_VIEW_STYLES.AvionicsActionButtons_div_className}>
      {onOpenFlightDeck && (
        <button
          onClick={onOpenFlightDeck}
          className={TACTICAL_VIEW_STYLES.AvionicsActionButtons_button_className}
        >
          LAUNCH / RE-FLY
        </button>
      )}
      {onConnectAirLink && (
        <button
          onClick={onConnectAirLink}
          className={TACTICAL_VIEW_STYLES.AvionicsActionButtons_button_className_2}
        >
          DRONE AIR LINK
        </button>
      )}
    </div>
  );
};

export default AvionicsActionButtons;
