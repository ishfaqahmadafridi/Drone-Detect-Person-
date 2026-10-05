import type { ReIDTargetResultsProps } from "@/types";
import { REID_UI } from "@/constants/tactical";
import { ReIDCandidateCard } from "./ReIDCandidateCard";

export function ReIDTargetResults({ target }: ReIDTargetResultsProps) {
  return (
    <section className="space-y-3" aria-label={`Matches for ground person ${target.ground_track_id}`}>
      <div className="flex items-center gap-3">
        {target.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={REID_UI.portraitClass}
            src={target.image}
            alt={`Selected ground person ${target.ground_track_id}`}
          />
        )}
        <div>
          <h3 className="font-semibold">Ground ID {target.ground_track_id}</h3>
          <p className={REID_UI.mutedClass}>{REID_UI.stateLabels[target.state]}</p>
          {target.state === "collecting" && (
            <p className={REID_UI.mutedClass}>
              {target.samples}/{target.required_samples} frames.
              Keep the person visible; reselect if their track was lost.
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {target.candidates.map(candidate => (
          <ReIDCandidateCard key={candidate.track_key} candidate={candidate} />
        ))}
      </div>
    </section>
  );
}
