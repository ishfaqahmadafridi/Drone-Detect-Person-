import React from "react";
import { SUSPECT_FREEZE_STYLES, VIDEO_TESTING } from "@/constants/tactical";
import type { SuspectFreezeActionsProps } from "@/types";

export const SuspectFreezeActions: React.FC<SuspectFreezeActionsProps> = ({
  selectedIds, pending, onFinish,
}) => (
  <div className={SUSPECT_FREEZE_STYLES.actions}>
    <button
      autoFocus
      type="button"
      className={SUSPECT_FREEZE_STYLES.confirm}
      disabled={pending || selectedIds.length === 0}
      onClick={() => onFinish(true)}
    >
      Track Selected ({selectedIds.length}) &amp; Send to Aerial
    </button>
    <button
      type="button"
      className={VIDEO_TESTING.buttonClass}
      disabled={pending}
      onClick={() => onFinish(false)}
    >
      Cancel &amp; Resume
    </button>
  </div>
);
