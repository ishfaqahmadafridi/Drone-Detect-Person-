"use client";

import React from "react";
import { RecordingsViewProps } from "@/types";
import { useRecordings } from "@/hooks";
import { RecordingsListPane } from "./RecordingsListPane";
import { RecordingsFullscreenModal } from "./RecordingsFullscreenModal";
import { RecordingsFooter } from "./RecordingsFooter";

export const RecordingsView: React.FC<RecordingsViewProps> = ({ className = "" }) => {
  const {
    snapshots,
    totalCount,
    filteredCount,
    isLoading,
    refetch,
    filterMode,
    setFilterMode,
    selectedSnapshot,
    isModalOpen,
    closeModal,
    isRecording,
    isActionLoading,
    toggleRecording,
    selectRecordAndInspect,
  } = useRecordings();

  return (
    <div className={`flex flex-col h-full gap-4 p-3 md:p-5 ${className}`}>
      {/* ── Main Recordings Workspace (Full-Width Tactical Grid) ── */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <RecordingsListPane
          snapshots={snapshots}
          totalCount={totalCount}
          filteredCount={filteredCount}
          isLoading={isLoading}
          filterMode={filterMode}
          selectedSnapshot={selectedSnapshot}
          onSelectSnapshot={selectRecordAndInspect}
          onFilterChange={setFilterMode}
          onRefresh={() => refetch()}
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          isActionLoading={isActionLoading}
        />
      </div>

      {/* ── Bottom Advisory Banner ── */}
      {!isLoading && totalCount > 0 && (
        <RecordingsFooter totalCount={totalCount} />
      )}

      {/* ── High-Resolution Fullscreen Inspection Modal ── */}
      <RecordingsFullscreenModal
        snapshot={selectedSnapshot}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default RecordingsView;
export * from "./RecordingsHeader";
export * from "./RecordingsFilterTabs";
export * from "./RecordingsListItem";
export * from "./RecordingsListPane";
export * from "./RecordingsPreviewPane";
export * from "./RecordingsFullscreenModal";
export * from "./RecordingsEmptyState";
export * from "./RecordingsFooter";
export * from "./EvidenceRecordRow";
export * from "./RecordDetailPanel";
