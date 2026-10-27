"use client";

import React from "react";
import { Crosshair } from "lucide-react";
import { SUSPECT_FREEZE_STYLES, VIDEO_TESTING } from "@/constants/tactical";
import type { SuspectFreezeModalProps } from "@/types";
import { FrozenSuspectFrame } from "./suspect-freeze/FrozenSuspectFrame";
import { FrozenSuspectChoices } from "./suspect-freeze/FrozenSuspectChoices";
import { SuspectFreezeActions } from "./suspect-freeze/SuspectFreezeActions";

export const SuspectFreezeModal: React.FC<SuspectFreezeModalProps> = ({
  snapshot, selectedIds, pending, error, onToggle, onFinish,
}) => (
  <div className={VIDEO_TESTING.dialogBackdropClass}>
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="suspect-selection-title"
      className={VIDEO_TESTING.dialogClass}
    >
      <h2 id="suspect-selection-title" className={SUSPECT_FREEZE_STYLES.title}>
        <Crosshair className={SUSPECT_FREEZE_STYLES.icon} />
        <span>Select Suspects on Frozen Frame</span>
      </h2>
      <p className={SUSPECT_FREEZE_STYLES.description}>
        Click on any detected bounding box or ID button. Playback will resume once committed.
      </p>
      <p className={SUSPECT_FREEZE_STYLES.counts}>
        {snapshot.detections.length} detected | {selectedIds.length} selected
      </p>
      <FrozenSuspectFrame snapshot={snapshot} selectedIds={selectedIds} pending={pending} onToggle={onToggle} />
      <FrozenSuspectChoices snapshot={snapshot} selectedIds={selectedIds} pending={pending} onToggle={onToggle} />
      {!snapshot.detections.length && (
        <p className={SUSPECT_FREEZE_STYLES.empty}>
          No people detected in this frame. Resume and try another frame or adjust detection confidence.
        </p>
      )}
      {error && <p role="alert" className={SUSPECT_FREEZE_STYLES.error}>{error}</p>}
      <SuspectFreezeActions selectedIds={selectedIds} pending={pending} onFinish={onFinish} />
    </section>
  </div>
);
