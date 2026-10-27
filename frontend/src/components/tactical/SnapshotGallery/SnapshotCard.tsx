
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import React from "react";
import { useToggle } from "@/hooks/useToggle";
import { Clock } from "lucide-react";
import { SnapshotCardProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onClick }) => {
  const [imgError, setImgError] = useToggle(false);
  const { datePart, timePart, perspectiveLabel, perspectiveBadgeClass } =
    useEvidenceMetadata(snapshot);

  return (
    <div
      onClick={onClick}
      className={TACTICAL_VIEW_STYLES.SnapshotCard_div_className}
    >
      {/* Thumbnail / Fallback */}
      {imgError ? (
        <div className={TACTICAL_VIEW_STYLES.SnapshotCard_div_className_2}>
          <Clock className={TACTICAL_VIEW_STYLES.SnapshotCard_Clock_className} />
          <span className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_p_className}>Preview Unavailable</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={snapshot.thumbnail_url || snapshot.url}
          alt={snapshot.filename}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}

      {/* Perspective Badge Top-Right */}
      <span
        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase shadow-md border ${perspectiveBadgeClass}`}
      >
        {perspectiveLabel}
      </span>

      {/* Clear Time & Info Bottom Bar */}
      <div className={TACTICAL_VIEW_STYLES.SnapshotCard_div_className_3}>
        <div className={TACTICAL_VIEW_STYLES.SnapshotCard_div_className_4}>
          <Clock className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_Clock_className} />
          <span>{timePart}</span>
          <span className={TACTICAL_VIEW_STYLES.SnapshotCard_span_className}>{datePart}</span>
        </div>
        <span className={TACTICAL_VIEW_STYLES.SnapshotCard_span_className_2}>
          {snapshot.filename}
        </span>
      </div>
    </div>
  );
};
