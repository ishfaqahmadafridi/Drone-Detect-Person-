"use client";
import React from "react";
import { EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useSnapshotGallery } from "@/hooks";
import { SnapshotHeader } from "./SnapshotHeader";
import { SnapshotCard } from "./SnapshotCard";
import { EvidenceViewerModal } from "../EvidenceViewer";
import { EmptyGalleryState } from "./EmptyGalleryState";

export const SnapshotGallery: React.FC = () => {
  const {
    snapshots, visibleSnapshots, hasMore, showMore, total, listedCount,
    isLoading, refetch, filterMode, setFilterMode, selectedSnapshot, openSnapshot, closeSnapshot,
  } = useSnapshotGallery();
  const description = total > listedCount
    ? `Newest ${listedCount} of ${total.toLocaleString()} saved frames. Click one to enlarge or download.`
    : "Saved frames, newest first. Click one to enlarge or download.";

  return (
    <section aria-label="Evidence snapshots" className={EVIDENCE_UI.cardClass}>
      <SnapshotHeader
        count={total}
        description={description}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
      />

      {snapshots.length === 0 ? (
        <EmptyGalleryState />
      ) : (
        <>
          <ul className={EVIDENCE_UI.gridClass}>
            {visibleSnapshots.map(snap => (
              <SnapshotCard key={snap.id ?? snap.filename} snapshot={snap} onClick={() => openSnapshot(snap)} />
            ))}
          </ul>
          <div className={EVIDENCE_UI.footerClass}>
            <span>Showing {visibleSnapshots.length} of {snapshots.length}</span>
            {hasMore && (
              <button type="button" onClick={showMore} className={VIDEO_TOOLS.secondaryButtonClass}>Show more</button>
            )}
          </div>
        </>
      )}

      <EvidenceViewerModal item={selectedSnapshot} onClose={closeSnapshot} />
    </section>
  );
};

export default SnapshotGallery;
