"use client";

import React from "react";
import { RecordingsViewProps } from "@/types";
import { useRecordings } from "@/hooks";
import { RecordingsListPane } from "./RecordingsListPane";
import { RecordingsPreviewPane } from "./RecordingsPreviewPane";
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
    setSelectedSnapshot,
    isModalOpen,
    openModal,
    closeModal,
  } = useRecordings();

  return (
    <div className={`flex flex-col h-full gap-4 p-3 md:p-5 ${className}`}>
      {/* ── Main Master-Detail Workspace ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Pane: Records List with Filters & Timestamps (5 cols on lg) */}
        <div className="lg:col-span-5 h-[340px] lg:h-full flex flex-col min-h-0">
          <RecordingsListPane
            snapshots={snapshots}
            totalCount={totalCount}
            filteredCount={filteredCount}
            isLoading={isLoading}
            filterMode={filterMode}
            selectedSnapshot={selectedSnapshot}
            onSelectSnapshot={setSelectedSnapshot}
            onFilterChange={setFilterMode}
            onRefresh={() => refetch()}
          />
        </div>

        {/* Right Pane: Tactical Side Preview Player & Telemetry (7 cols on lg) */}
        <div className="lg:col-span-7 h-[420px] lg:h-full flex flex-col min-h-0">
          <RecordingsPreviewPane
            selectedSnapshot={selectedSnapshot}
            onOpenModal={openModal}
          />
        </div>
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
