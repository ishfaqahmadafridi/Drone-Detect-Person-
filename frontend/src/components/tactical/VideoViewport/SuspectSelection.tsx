"use client";
import React from "react";
import { ArrowRight, Crosshair, UserSearch, X } from "lucide-react";
import { useSuspectSelection } from "@/hooks/useSuspectSelection";
import { SUSPECT_PICKER, VIDEO_TOOLS } from "@/constants/tactical";
import { SuspectPeopleList } from "./SuspectPeopleList";
import { SuspectPortraitGallery } from "./SuspectPortraitGallery";
import { SuspectFreezeModal } from "./SuspectFreezeModal";
import type { SuspectSelectionProps } from "@/types";

export const SuspectSelection: React.FC<SuspectSelectionProps> = (props) => {
  const {
    isGround, snapshot, portraits, selectedIds, selectedCount, liveDetections,
    pending, error, freeze, autoSelectSuspect, finish, clear, toggle,
  } = useSuspectSelection(props);

  if (!isGround) return null;

  return (
    <section aria-label="Choose a suspect" className={SUSPECT_PICKER.cardClass}>
      <div className={VIDEO_TOOLS.cardBodyClass}>
        <span className={VIDEO_TOOLS.iconWrapClass}><UserSearch aria-hidden="true" className={VIDEO_TOOLS.iconClass} /></span>
        <div className="min-w-0">
          <h3 className={VIDEO_TOOLS.titleClass}>Choose a suspect</h3>
          <p className={VIDEO_TOOLS.bodyClass}>
            Pick a person on the camera. The drone searches for them from the air.
          </p>
        </div>
      </div>

      {!snapshot && (
        <SuspectPeopleList detections={liveDetections} pending={pending} onSelect={id => void autoSelectSuspect(id)} />
      )}

      <div className={SUSPECT_PICKER.footerClass}>
        <div className={VIDEO_TOOLS.actionsClass}>
          <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} onClick={() => void freeze()} disabled={pending || !!snapshot}>
            <Crosshair aria-hidden="true" className="h-4 w-4" />Pause video to pick
          </button>
          {selectedCount > 0 && (
            <button type="button" className={VIDEO_TOOLS.secondaryButtonClass} onClick={() => void clear()} disabled={pending || !!snapshot}>
              <X aria-hidden="true" className="h-4 w-4" />Clear selection
            </button>
          )}
        </div>
        {pending && <p role="status" className={VIDEO_TOOLS.statusClass}>Saving suspect photo…</p>}
      </div>
      {error && !snapshot && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}

      {portraits.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className={SUSPECT_PICKER.selectedHeaderClass}>
            <span className={SUSPECT_PICKER.selectedLabelClass}>Selected ({portraits.length})</span>
            {props.onOpenAerialView && (
              <button type="button" className={VIDEO_TOOLS.primaryButtonClass} onClick={props.onOpenAerialView}>
                Search with drone<ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
          <SuspectPortraitGallery portraits={portraits} />
        </div>
      )}

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
    </section>
  );
};
