"use client";

import React from "react";
import { IncidentAuditViewProps } from "@/types";
import { IncidentLogs } from "../IncidentLogs";
import { SnapshotGallery } from "../SnapshotGallery";

export const IncidentAuditView: React.FC<IncidentAuditViewProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <IncidentLogs />
      <SnapshotGallery />
    </div>
  );
};

export default IncidentAuditView;
