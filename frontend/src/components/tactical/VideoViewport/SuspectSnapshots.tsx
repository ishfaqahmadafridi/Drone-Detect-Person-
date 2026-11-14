import { UserSearch } from "lucide-react";
import { VIDEO_TOOLS } from "@/constants/tactical";
import type { SuspectSnapshotsProps } from "@/types";
import { SuspectPortraitGallery } from "./SuspectPortraitGallery";

/** Aerial view: the ground suspects the drone is matching against. */
export function SuspectSnapshots({ portraits }: SuspectSnapshotsProps) {
  return (
    <section aria-label="Ground suspect reference images" className={VIDEO_TOOLS.referenceClass}>
      <div className={VIDEO_TOOLS.cardBodyClass}>
        <span className={VIDEO_TOOLS.iconWrapClass}><UserSearch aria-hidden="true" className={VIDEO_TOOLS.iconClass} /></span>
        <div className="min-w-0">
          <h3 className={VIDEO_TOOLS.titleClass}>Ground reference photos</h3>
          <p className={VIDEO_TOOLS.bodyClass}>The drone compares every person it sees with these ground photos.</p>
        </div>
      </div>
      <SuspectPortraitGallery portraits={portraits} />
    </section>
  );
}
