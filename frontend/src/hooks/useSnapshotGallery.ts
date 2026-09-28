"use client";

import { useState } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem } from "@/types";

export function useSnapshotGallery() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotItem | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "aerial" | "ground">("all");

  const openSnapshot = (snapshot: SnapshotItem) => {
    setSelectedSnapshot(snapshot);
  };

  const closeSnapshot = () => {
    setSelectedSnapshot(null);
  };

  const filteredSnapshots = snapshots.filter((snap) => {
    if (filterMode === "all") return true;
    return snap.view_mode === filterMode;
  });

  return {
    snapshots: filteredSnapshots,
    totalCount: snapshots.length,
    isLoading,
    refetch,
    filterMode,
    setFilterMode,
    selectedSnapshot,
    openSnapshot,
    closeSnapshot,
  };
}
