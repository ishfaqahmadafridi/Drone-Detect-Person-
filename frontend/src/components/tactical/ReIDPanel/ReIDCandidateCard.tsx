import type { ReIDCandidateCardProps } from "@/types";
import { REID_UI } from "@/constants/tactical";

export function ReIDCandidateCard({ candidate }: ReIDCandidateCardProps) {
  return (
    <article className={REID_UI.cardClass}>
      <h4 className="font-medium">#{candidate.rank} · Aerial ID {candidate.track_id}</h4>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={REID_UI.portraitClass}
        src={candidate.image}
        alt={`Candidate aerial person ${candidate.track_id}`}
      />
      <p className="text-sm">Similarity: {candidate.similarity.toFixed(3)}</p>
      <p className={REID_UI.mutedClass}>
        Frame {candidate.frame_idx} · {new Date(candidate.seen_at * 1000).toLocaleTimeString()}
      </p>
    </article>
  );
}
