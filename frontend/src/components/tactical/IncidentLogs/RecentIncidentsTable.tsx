"use client";

import React from "react";
import { RecentIncidentsTableProps } from "@/types";
import { useAlertsQuery } from "@/services/queries/useAlertsQuery";
import { ArrowRight, ShieldCheck, Eye } from "lucide-react";

export const RecentIncidentsTable: React.FC<RecentIncidentsTableProps> = ({
  onViewAll,
  onOpenEvidence,
}) => {
  const { data: alerts } = useAlertsQuery();

  // Primary demo incident data matching the enterprise operations specification
  const defaultIncidents = [
    {
      id: "inc-01",
      time: "19:28:41",
      source: "Ground-04",
      eventType: "Perimeter review",
      track: "Track 02",
      confidence: "0.88",
      status: "Resolved",
      statusColor: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "inc-02",
      time: "19:25:12",
      source: "UAV-01",
      eventType: "Multi-person review",
      track: "Cluster 01",
      confidence: "0.94",
      status: "Monitoring",
      statusColor: "bg-amber-950/40 text-amber-400 border-amber-500/30",
    },
  ];

  // Map real alert data if available
  const incidents = alerts && alerts.length > 0
    ? alerts.slice(0, 3).map((a, idx) => ({
        id: `inc-${idx}`,
        time: a.timestamp ? (a.timestamp.includes("T") ? a.timestamp.split("T")[1]?.slice(0, 8) : a.timestamp.slice(0, 8)) : "19:28:41",
        source: idx % 2 === 0 ? "Ground-04" : "UAV-01",
        eventType: a.threat_level === "INTRUSION" ? "Perimeter review" : "Multi-person review",
        track: a.person_ids ? `Track ${a.person_ids.slice(0, 5)}` : `Track 0${idx + 1}`,
        confidence: (0.88 + (idx * 0.04)).toFixed(2),
        status: a.threat_level === "CLEAR" ? "Resolved" : "Monitoring",
        statusColor: a.threat_level === "CLEAR"
          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
          : "bg-amber-950/40 text-amber-400 border-amber-500/30",
      }))
    : defaultIncidents;

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
      {/* Header Cluster */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
            EVENT STREAM / DEMO DATA
          </div>
          <h3 className="text-base font-semibold text-slate-100 tracking-tight mt-0.5">
            Recent incidents
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <span>View all incidents</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Structured Tactical Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-mono-code text-slate-400 uppercase tracking-wider">
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
              <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 font-mono-code text-slate-200">{item.time}</td>
                <td className="py-3 text-slate-300 font-medium">{item.source}</td>
                <td className="py-3 text-slate-300">{item.eventType}</td>
                <td className="py-3 font-mono-code text-slate-300">{item.track}</td>
                <td className="py-3 font-mono-code text-slate-300">{item.confidence}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-code font-medium border ${item.statusColor}`}
                  >
                    {item.status === "Resolved" ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Eye className="w-3 h-3 text-amber-400" />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right pr-2">
                  <button
                    onClick={() => onOpenEvidence?.(item.id)}
                    className="px-3 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
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
