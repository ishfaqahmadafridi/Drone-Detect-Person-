import React from "react";
import { Clock } from "lucide-react";
import { SnapshotCardProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onClick }) => {
  const [imgError, setImgError] = React.useState(false);
  const { datePart, timePart, perspectiveLabel, perspectiveBadgeClass } =
    useEvidenceMetadata(snapshot);

  return (
    <div
      onClick={onClick}
      className="relative shrink-0 w-52 h-32 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-400/80 transition-all cursor-pointer group shadow-xl bg-slate-950"
    >
      {/* Thumbnail / Fallback */}
      {imgError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 text-slate-500 gap-1 select-none">
          <Clock className="w-5 h-5 text-slate-600" />
          <span className="text-[10px] font-mono-code text-slate-400">Preview Unavailable</span>
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
      <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 flex flex-col border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-cyan-300 font-mono-code text-[11px] font-bold">
          <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>{timePart}</span>
          <span className="text-slate-400 text-[9px] font-normal">{datePart}</span>
        </div>
        <span className="font-mono-code text-[9px] text-slate-400 truncate mt-0.5">
          {snapshot.filename}
        </span>
      </div>
    </div>
  );
};
