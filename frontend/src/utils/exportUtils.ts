import { IncidentAlert } from "@/types";

export const exportAlertsToCsv = (alerts: IncidentAlert[], filenamePrefix = "drone_incident_report") => {
  if (!alerts || alerts.length === 0) return;

  const headers = ["Timestamp", "Threat Level", "Total Persons", "Intruders", "Gatherings", "Snapshot Path"];
  const rows = alerts.map((a) => [
    a.timestamp,
    a.threat_level,
    a.total_persons,
    a.intruders_count,
    a.gathering_clusters,
    a.snapshot_path,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.map((x) => `"${x}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filenamePrefix}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
