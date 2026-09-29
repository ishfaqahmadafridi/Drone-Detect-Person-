"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem, RecordingsFilterMode } from "@/types";
import { recordingsApi } from "@/services/api/recordingsApi";

export function useRecordings() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();

  const [filterMode, setFilterMode] = useState<RecordingsFilterMode>("all");
  const [selectedSnapshotState, setSelectedSnapshot] = useState<SnapshotItem | null>(null);
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

  // Derive the active selection safely without triggering state update cascading
  const selectedSnapshot = useMemo(() => {
    if (!selectedSnapshotState) return null;
    const exists = filteredSnapshots.some((s) => s.filename === selectedSnapshotState.filename);
    return exists ? selectedSnapshotState : null;
  }, [filteredSnapshots, selectedSnapshotState]);

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

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      return stopRecording();
    } else {
      return startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const selectRecordAndInspect = useCallback((snap: SnapshotItem) => {
    setSelectedSnapshot(snap);
    setIsModalOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setSelectedSnapshot(null);
  }, []);

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
    closePreview,
    isRecording,
    isActionLoading,
    startRecording,
    stopRecording,
    toggleRecording,
    selectRecordAndInspect,
  };
}