import type { SuspectSnapshotsProps } from "@/types";
import { VIDEO_TESTING } from "@/constants/tactical";

export function SuspectSnapshots({ portraits, reference = false }: SuspectSnapshotsProps) {
  return (
    <section aria-label={reference ? "Ground suspect reference images" : "Selected suspect snapshots"} className={VIDEO_TESTING.referenceBoxClass}>
      <h3 className="text-sm font-semibold">{reference ? "Ground reference images" : "Selected suspects"}</h3>
      {portraits.length === 0 ? (
        <p className="text-xs mt-1">{reference ? "Select a suspect in Ground CCTV to add a reference image here." : "Freeze the video, select a person, then confirm to save their picture here."}</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto py-2">
          {portraits.map(person => (
            <figure key={person.id} className={VIDEO_TESTING.portraitCardClass}>
              <a href={person.image} download={`suspect-${person.id}-${person.capturedAt.replaceAll(":", "-")}.jpg`} title={`Download suspect #${person.id} snapshot`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={person.image} alt={`Selected suspect #${person.id}`} className="w-32 h-36 object-contain rounded border" />
              </a>
              <figcaption className="text-xs mt-1">Suspect #{person.id}</figcaption>
              <a className={VIDEO_TESTING.buttonClass} href={person.image} download={`suspect-${person.id}.jpg`}>Download image</a>
            </figure>
          ))}
        </div>
      )}
      <p className="text-xs mt-2">{reference ? "These selected ground suspects are the references for aerial matching." : "Open Aerial View to use these images as references for person matching."}</p>
    </section>
  );
}
