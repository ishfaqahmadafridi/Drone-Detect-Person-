"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem, RecordingsFilterMode } from "@/types";
import { recordingsApi } from "@/services/api/recordingsApi";

export function useRecordings() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();
  const [filterMode, setFilterMode] = useState<RecordingsFilterMode>("all");
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // Filter snapshots by perspective or media type
  const filteredSnapshots = useMemo(() => {
    return snapshots.filter((snap: SnapshotItem) => {
      if (filterMode === "all") return true;
      if (filterMode === "video") {
        return snap.media_type === "video" || snap.filename.endsWith(".mp4");
      }
      if (filterMode === "image") {
        return (snap.media_type === "image" || !snap.filename.endsWith(".mp4")) && snap.media_type !== "video";
      }
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

  // Check initial recording status
  useEffect(() => {
    recordingsApi.getRecordingStatus()
      .then((res) => setIsRecording(res.is_recording))
      .catch(() => {});
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setIsActionLoading(true);
      const res = await recordingsApi.startRecording();
      setIsRecording(true);
      return res;
    } catch (err) {
      console.error("[RECORDINGS] Failed to start recording:", err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setIsActionLoading(true);
      const res = await recordingsApi.stopRecording();
      setIsRecording(false);
      await refetch();
      if (res.record) {
        setSelectedSnapshot(res.record);
      }
      return res;
    } catch (err) {
      console.error("[RECORDINGS] Failed to stop recording:", err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  }, [refetch]);

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
    isRecording,
    isActionLoading,
    startRecording,
    stopRecording,
  };
}
