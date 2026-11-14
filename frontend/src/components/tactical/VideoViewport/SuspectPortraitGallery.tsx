import { Download } from "lucide-react";
import { SUSPECT_PICKER, VIDEO_TOOLS } from "@/constants/tactical";
import type { SuspectPortraitGalleryProps } from "@/types";

/** Cropped suspect photos, shared by the ground picker and the aerial reference list. */
export function SuspectPortraitGallery({ portraits }: SuspectPortraitGalleryProps) {
  return (
    <ul className={SUSPECT_PICKER.galleryClass}>
      {portraits.map(person => (
        <li key={person.id} className={SUSPECT_PICKER.portraitClass}>
          {/* eslint-disable-next-line @next/next/no-img-element -- in-memory data URL crop */}
          <img src={person.image} alt={`Suspect ${person.id}`} className={SUSPECT_PICKER.portraitImageClass} />
          <p className={SUSPECT_PICKER.portraitCaptionClass}>Suspect {person.id}</p>
          <a
            className={`${VIDEO_TOOLS.secondaryButtonClass} w-full`}
            href={person.image}
            download={`suspect-${person.id}-${person.capturedAt.replaceAll(":", "-")}.jpg`}
          >
            <Download aria-hidden="true" className="h-4 w-4" />Download
          </a>
        </li>
      ))}
    </ul>
  );
}
