"use client";

import { useState, useMemo, useEffect } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem, RecordingsFilterMode } from "@/types";

export function useRecordings() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();
  const [filterMode, setFilterMode] = useState<RecordingsFilterMode>("all");
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredSnapshots = useMemo(() => {
    return snapshots.filter((snap: SnapshotItem) => {
      if (filterMode === "all") return true;
      return (snap.view_mode ?? "aerial") === filterMode;
    });
  }, [snapshots, filterMode]);

  // Keep active selection in sync with the filtered list
  useEffect(() => {
    if (filteredSnapshots.length === 0) {
      setSelectedSnapshot(null);
      return;
    }

    if (!selectedSnapshot || !filteredSnapshots.some((s) => s.filename === selectedSnapshot.filename)) {
      setSelectedSnapshot(filteredSnapshots[0]);
    }
  }, [filteredSnapshots, selectedSnapshot]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    snapshots: filteredSnapshots,
    allSnapshots: snapshots,
    totalCount: snapshots.length,
    filteredCount: filteredSnapshots.length,
    isLoading,
    refetch,
    filterMode,
    setFilterMode,
    selectedSnapshot,
    setSelectedSnapshot,
    isModalOpen,
    openModal,
    closeModal,
  };
}
