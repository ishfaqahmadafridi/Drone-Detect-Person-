import React from "react";
import { EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import type { EvidenceSectionHeaderProps } from "@/types";

/** Shared header for the incident log and snapshot cards. */
export const EvidenceSectionHeader: React.FC<EvidenceSectionHeaderProps> = ({ icon: Icon, title, count, description, children }) => (
  <header className={EVIDENCE_UI.headerClass}>
    <div className={VIDEO_TOOLS.cardBodyClass}>
      <span className={VIDEO_TOOLS.iconWrapClass}><Icon aria-hidden="true" className={VIDEO_TOOLS.iconClass} /></span>
      <div className="min-w-0">
        <div className={EVIDENCE_UI.headingRowClass}>
          <h2 className={EVIDENCE_UI.titleClass}>{title}</h2>
          {count != null && <span className={EVIDENCE_UI.countClass}>{count.toLocaleString()}</span>}
        </div>
        <p className={EVIDENCE_UI.descriptionClass}>{description}</p>
      </div>
    </div>
    {children && <div className={EVIDENCE_UI.actionsClass}>{children}</div>}
  </header>
);

export default EvidenceSectionHeader;
