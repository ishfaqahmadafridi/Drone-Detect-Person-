"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { useSuspectSelection } from "@/hooks/useSuspectSelection";
import { VIDEO_TESTING } from "@/constants/tactical";
import { SuspectSnapshots } from "./SuspectSnapshots";
import { SuspectActionToolbar } from "./SuspectActionToolbar";
import { SuspectQuickSelectChips } from "./SuspectQuickSelectChips";
import { SuspectFreezeModal } from "./SuspectFreezeModal";
import type { SuspectSelectionProps } from "@/types";

export const SuspectSelection: React.FC<SuspectSelectionProps> = (props) => {
  const {
    isGround,
    snapshot,
    portraits,
    selectedIds,
    selectedCount,
    liveDetections,
    pending,
    error,
    freeze,
    autoSelectSuspect,
    finish,
    clear,
    toggle,
  } = useSuspectSelection(props);

  if (!isGround) return null;

  return (
    <div className={VIDEO_TESTING.panelClass}>
      {/* Primary Action Button Toolbar */}
      <SuspectActionToolbar
        pending={pending}
        isFrozen={!!snapshot}
        selectedCount={selectedCount}
        onAutoCapture={() => void autoSelectSuspect()}
        onManualFreeze={freeze}
        onClear={clear}
      />

      {/* Quick Direct-Target Buttons for detected people */}
      {!snapshot && (
        <SuspectQuickSelectChips
          detections={liveDetections}
          pending={pending}
          onSelectPerson={(id) => void autoSelectSuspect(id)}
        />
      )}

      {/* Suspect Snapshots Gallery */}
      <SuspectSnapshots portraits={portraits} />

      {/* Switch to Aerial Action Banner */}
      {portraits.length > 0 && props.onOpenAerialView && (
        <div className={TACTICAL_VIEW_STYLES.SuspectSelection_div_className}>
          <button
            type="button"
            onClick={props.onOpenAerialView}
            className={TACTICAL_VIEW_STYLES.SuspectSelection_button_className}
          >
            <span>🚀 Open Aerial Drone View & Track Matches ({portraits.length} Active Suspects)</span>
          </button>
        </div>
      )}

      {/* Manual Freeze Selection Modal */}
      {snapshot && (
        <SuspectFreezeModal
          snapshot={snapshot}
          selectedIds={selectedIds}
          pending={pending}
          error={error}
          onToggle={toggle}
          onFinish={(apply) => void finish(apply)}
        />
      )}
    </div>
  );
};
