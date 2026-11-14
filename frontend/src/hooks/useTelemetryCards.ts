import { useToggle } from "./useToggle";
import { useTelemetryMetrics } from "./useTelemetryMetrics";
import { useSnapshotsQuery } from "@/services/queries/useSnapshotsQuery";
import { buildTelemetryCards } from "@/utils/telemetryCards";
import type { TelemetryCardsProps } from "@/types";

export function useTelemetryCards(viewMode?: TelemetryCardsProps["viewMode"]) {
  const [isModalOpen, setIsModalOpen] = useToggle(false);
  const metrics = useTelemetryMetrics();
  const snapshots = useSnapshotsQuery();
  const cards = buildTelemetryCards(
    { ...metrics, evidenceCount: snapshots.data?.total },
    () => setIsModalOpen(true),
  );
  return {
    cards, isModalOpen,
    activeViewMode: viewMode ?? metrics.viewMode,
    closeModal: () => setIsModalOpen(false),
  };
}
