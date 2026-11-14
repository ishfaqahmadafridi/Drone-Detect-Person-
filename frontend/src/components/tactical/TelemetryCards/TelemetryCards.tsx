"use client";

import React from "react";
import { useTelemetryCards } from "@/hooks/useTelemetryCards";
import { TelemetryCardsProps } from "@/types";
import { DetectedPersonsModal } from "./DetectedPersonsModal";
import { TelemetryCardTile } from "./TelemetryCardTile";

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({
  viewMode: propViewMode,
  layout = "horizontal",
}) => {
  const { cards, isModalOpen, activeViewMode, closeModal } = useTelemetryCards(propViewMode);

  const gridClass =
    layout === "horizontal"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      : "grid grid-cols-2 gap-3";

  return (
    <>
      <div className={gridClass}>
        {cards.map((c) => (
          <TelemetryCardTile
            key={c.id}
            title={c.title}
            value={c.value}
            subText={c.subText}
            isAlert={c.isAlert}
            onClick={c.onClick}
          />
        ))}
      </div>

      {/* Real-time Target Inspector Modal */}
      <DetectedPersonsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        viewMode={activeViewMode}
      />
    </>
  );
};

export default TelemetryCards;
export * from "./TelemetryCardTile";
export * from "./DetectedPersonsModal";
