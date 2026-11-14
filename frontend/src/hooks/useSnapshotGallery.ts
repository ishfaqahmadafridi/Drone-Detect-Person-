"use client";

import { useState, useMemo } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem, SnapshotFilter } from "@/types";
import { EVIDENCE_UI } from "@/constants/tactical";

export function useSnapshotGallery() {
  const { data, isLoading, refetch } = useSnapshotsQuery();
  const snapshots = useMemo(() => data?.snapshots ?? [], [data]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotItem | null>(null);
  const [filterMode, setFilter] = useState<SnapshotFilter>("all");
  const [visibleCount, setVisibleCount] = useState<number>(EVIDENCE_UI.pageSize);
  const setFilterMode = (filter: SnapshotFilter) => { setFilter(filter); setVisibleCount(EVIDENCE_UI.pageSize); };

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
    visibleSnapshots: filteredSnapshots.slice(0, visibleCount),
    hasMore: visibleCount < filteredSnapshots.length,
    showMore: () => setVisibleCount(count => count + EVIDENCE_UI.pageSize),
    total: data?.total ?? imageSnapshots.length,
    listedCount: imageSnapshots.length,
    isLoading,
    refetch,
    filterMode,
    setFilterMode,
    selectedSnapshot,
    openSnapshot,
    closeSnapshot,
  };
}
