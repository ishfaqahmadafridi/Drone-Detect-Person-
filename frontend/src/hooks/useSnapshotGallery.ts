"use client";

import { useState } from "react";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { SnapshotItem } from "@/types";

export function useSnapshotGallery() {
  const { data: snapshots = [], isLoading, refetch } = useSnapshotsQuery();
  const [selectedSnapshot, setSelectedSnapshot] = useState<SnapshotItem | null>(null);

  const openSnapshot = (snapshot: SnapshotItem) => {
    setSelectedSnapshot(snapshot);
  };

  const closeSnapshot = () => {
    setSelectedSnapshot(null);
  };

  return {
    snapshots,
    isLoading,
    refetch,
    selectedSnapshot,
    openSnapshot,
    closeSnapshot,
  };
}
