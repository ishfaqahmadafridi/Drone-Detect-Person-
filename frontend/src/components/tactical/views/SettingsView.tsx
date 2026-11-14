"use client";
import React from "react";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import { AlertSettingsCard, DetectionSettingsCard, StorageCard } from "../Settings";

export const SettingsView: React.FC = () => (
  <div className="flex flex-col gap-5">
    <h1 className={TACTICAL_VIEW_STYLES.AirspaceCommandView_h1_className}>Settings</h1>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <DetectionSettingsCard />
      <div className="flex flex-col gap-5">
        <AlertSettingsCard />
        <StorageCard />
      </div>
    </div>
  </div>
);

export default SettingsView;
