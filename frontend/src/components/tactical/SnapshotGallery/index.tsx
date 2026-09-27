"use client";

import React from "react";
import { useSnapshotGallery } from "@/hooks";
import { SnapshotHeader } from "./SnapshotHeader";
import { SnapshotCard } from "./SnapshotCard";
import { SnapshotModal } from "./SnapshotModal";
import { EmptyGalleryState } from "./EmptyGalleryState";

export const SnapshotGallery: React.FC = () => {
  const {
    snapshots,
    isLoading,
    refetch,
    selectedSnapshot,
    openSnapshot,
    closeSnapshot,
  } = useSnapshotGallery();

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 border border-slate-800">
      <SnapshotHeader
        count={snapshots.length}
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />

      <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-thin">
        {snapshots.length === 0 ? (
          <EmptyGalleryState />
        ) : (
          snapshots.map((snap, idx) => (
            <SnapshotCard
              key={idx}
              snapshot={snap}
              onClick={() => openSnapshot(snap)}
            />
          ))
        )}
      </div>

      <SnapshotModal
        snapshot={selectedSnapshot}
        onClose={closeSnapshot}
      />
    </div>
  );
};

export default SnapshotGallery;
