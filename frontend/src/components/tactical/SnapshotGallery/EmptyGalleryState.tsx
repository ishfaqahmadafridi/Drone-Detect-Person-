import React from "react";
import { Camera } from "lucide-react";
import { EVIDENCE_UI } from "@/constants/tactical";

export const EmptyGalleryState: React.FC = () => (
  <div className={EVIDENCE_UI.emptyClass}>
    <span className={EVIDENCE_UI.emptyIconClass}><Camera aria-hidden="true" className="h-5 w-5" /></span>
    <p className={EVIDENCE_UI.emptyTitleClass}>No snapshots yet</p>
    <p className={EVIDENCE_UI.emptyTextClass}>Frames are saved automatically on an intrusion, or when you press Snapshot above the video.</p>
  </div>
);
