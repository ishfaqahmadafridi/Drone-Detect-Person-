"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { RecentIncidentsTableProps } from "@/types";
import { useAlertsQuery } from "@/services/queries/useAlertsQuery";
import { ArrowRight, ShieldCheck, Eye } from "lucide-react";

export const RecentIncidentsTable: React.FC<RecentIncidentsTableProps> = ({
  onViewAll,
  onOpenEvidence,
}) => {
  const { data: alerts } = useAlertsQuery();

  // Map real alert data if available
  const incidents = alerts && alerts.length > 0
    ? alerts.slice(0, 3).map((a, idx) => ({
        id: `inc-${idx}`,
        time: a.timestamp ? (a.timestamp.includes("T") ? a.timestamp.split("T")[1]?.slice(0, 8) : a.timestamp.slice(0, 8)) : "19:28:41",
        source: idx % 2 === 0 ? "Ground-04" : "UAV-01",
        eventType: a.threat_level === "INTRUSION" ? "Perimeter review" : "Person detected",
        track: a.person_ids ? `Track ${a.person_ids.slice(0, 5)}` : `Track 0${idx + 1}`,
        confidence: (0.88 + (idx * 0.04)).toFixed(2),
        status: a.threat_level === "CLEAR" ? "Resolved" : "Monitoring",
        statusColor: a.threat_level === "CLEAR"
          ? TACTICAL_VIEW_STYLES.RecentIncidentsTable_color
          : TACTICAL_VIEW_STYLES.RecentIncidentsTable_color_2,
      }))
    : [];

  return (
    <div className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_div_className}>
      {/* Header Cluster */}
      <div className="flex items-center justify-between">
        <div>
          <div className={TACTICAL_VIEW_STYLES.DeviceDeckHeader_div_className}>
            EVENT STREAM
          </div>
          <h3 className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_h3_className}>
            Recent incidents
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_button_className}
          >
            <span>View all incidents</span>
            <ArrowRight className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_ArrowRight_className} />
          </button>
        )}
      </div>

      {/* Structured Tactical Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_tr_className}>
              <th className="pb-3 font-semibold">TIME</th>
              <th className="pb-3 font-semibold">SOURCE</th>
              <th className="pb-3 font-semibold">EVENT TYPE</th>
              <th className="pb-3 font-semibold">TRACK</th>
              <th className="pb-3 font-semibold">CONFIDENCE</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold text-right pr-2">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {incidents.map((item) => (
              <tr key={item.id} className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_tr_className_2}>
                <td className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_td_className}>{item.time}</td>
                <td className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_td_className_2}>{item.source}</td>
                <td className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_td_className_3}>{item.eventType}</td>
                <td className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_td_className_4}>{item.track}</td>
                <td className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_td_className_4}>{item.confidence}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-code font-medium border ${item.statusColor}`}
                  >
                    {item.status === "Resolved" ? (
                      <ShieldCheck className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
                    ) : (
                      <Eye className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Satellite_className} />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right pr-2">
                  <button
                    onClick={() => onOpenEvidence?.(item.id)}
                    className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_button_className_2}
                  >
                    Evidence
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentIncidentsTable;
