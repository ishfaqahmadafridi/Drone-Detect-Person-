"use client";
import React from "react";
import { CircleAlert } from "lucide-react";
import { EVIDENCE_UI } from "@/constants/tactical";
import { useToggle } from "@/hooks/useToggle";
import type { EvidenceMediaProps } from "@/types";

/** Image or video stage. Keyed by URL by the parent, so the error state resets per item. */
export const EvidenceMedia: React.FC<EvidenceMediaProps> = ({ item, isVideo }) => {
  const [failed, setFailed] = useToggle(false);

  if (failed) {
    return (
      <div role="alert" className={EVIDENCE_UI.mediaErrorClass}>
        <CircleAlert aria-hidden="true" className="h-6 w-6" />
        <p className={EVIDENCE_UI.emptyTitleClass}>{isVideo ? "This recording can't be played" : "This image can't be shown"}</p>
        <p className={EVIDENCE_UI.emptyTextClass}>
          {isVideo
            ? "The file may be incomplete, for example if recording stopped unexpectedly. You can still try downloading it."
            : "The file is missing or damaged on the server."}
        </p>
      </div>
    );
  }

  return isVideo ? (
    <video
      src={item.url}
      controls
      autoPlay
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      className={EVIDENCE_UI.mediaClass}
    >
      Your browser can&apos;t play this video.
    </video>
  ) : (
    /* eslint-disable-next-line @next/next/no-img-element -- backend-served evidence file */
    <img src={item.url} alt={`Evidence ${item.filename}`} onError={() => setFailed(true)} className={EVIDENCE_UI.mediaClass} />
  );
};

export default EvidenceMedia;
