"use client";

import { useState, useMemo } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem, RecordingsFilterMode } from "@/types";

export function useRecordings() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();

  const [filterMode, setFilterMode] =
    useState<RecordingsFilterMode>("all");

  const [selectedSnapshotState, setSelectedSnapshot] =
    useState<SnapshotItem | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState<boolean>(false);

  const filteredSnapshots = useMemo(() => {
    return snapshots.filter((snap: SnapshotItem) => {
      if (filterMode === "all") return true;

      return (snap.view_mode ?? "aerial") === filterMode;
    });
  }, [snapshots, filterMode]);

  // Derive the active selection instead of updating state inside an effect
  const selectedSnapshot = useMemo(() => {
    if (filteredSnapshots.length === 0) {
      return null;
    }

    if (
      selectedSnapshotState &&
      filteredSnapshots.some(
        (snap) => snap.filename === selectedSnapshotState.filename
      )
    ) {
      return selectedSnapshotState;
    }

    return filteredSnapshots[0];
  }, [filteredSnapshots, selectedSnapshotState]);

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