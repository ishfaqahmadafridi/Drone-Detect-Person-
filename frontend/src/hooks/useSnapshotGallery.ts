"use client";

import { useState, useMemo } from "react";
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

  // Strictly filter to evidentiary photo snapshots only (videos belong in Recordings Hub)
  const imageSnapshots = useMemo(() => {
    return snapshots.filter(
      (snap) => snap.media_type !== "video" && !snap.filename?.endsWith(".mp4")
    );
  }, [snapshots]);

  const filteredSnapshots = useMemo(() => {
    return imageSnapshots.filter((snap) => {
      if (filterMode === "all") return true;
      return snap.view_mode === filterMode;
    });
  }, [imageSnapshots, filterMode]);

  return {
    snapshots: filteredSnapshots,
    totalCount: imageSnapshots.length,
    isLoading,
    refetch,
    filterMode,
    setFilterMode,
    selectedSnapshot,
    openSnapshot,
    closeSnapshot,
  };
}
