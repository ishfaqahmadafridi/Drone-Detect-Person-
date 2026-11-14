import React from "react";
import { ImageOff } from "lucide-react";
import { EVIDENCE_UI } from "@/constants/tactical";
import { useToggle } from "@/hooks/useToggle";
import { useEvidenceMetadata } from "@/hooks";
import { SnapshotCardProps } from "@/types";

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onClick }) => {
  const [imgError, setImgError] = useToggle(false);
  const { datePart, timePart } = useEvidenceMetadata(snapshot);
  const view = snapshot.view_mode === "aerial" ? "aerial" : "ground";

  return (
    <li>
      <button type="button" onClick={onClick} className={`${EVIDENCE_UI.tileClass} w-full`} aria-label={`Open snapshot ${snapshot.filename}`}>
        <div className={EVIDENCE_UI.thumbClass}>
          {imgError ? (
            <div className={EVIDENCE_UI.thumbFallbackClass}>
              <ImageOff aria-hidden="true" className="h-5 w-5" />No preview
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- backend-served evidence file */
            <img
              src={snapshot.thumbnail_url || snapshot.url}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className={EVIDENCE_UI.thumbImageClass}
            />
          )}
          <span className={EVIDENCE_UI.viewBadgeClass[view]}>{EVIDENCE_UI.viewLabels[view]}</span>
        </div>
        <div className={EVIDENCE_UI.tileBodyClass}>
          <span className={EVIDENCE_UI.tileTimeClass}>{timePart} · {datePart}</span>
          <span className={EVIDENCE_UI.tileFileClass} title={snapshot.filename}>{snapshot.filename}</span>
        </div>
      </button>
    </li>
  );
};
