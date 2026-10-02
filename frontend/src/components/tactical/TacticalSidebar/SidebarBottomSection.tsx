import React from "react";
import { SidebarBottomSectionProps } from "@/types";
import { SidebarSystemHealth } from "./SidebarSystemHealth";

export const SidebarBottomSection: React.FC<SidebarBottomSectionProps> = ({
  isCollapsed,
}) => {
  return (
    <div className="flex flex-col min-w-0">
      <SidebarSystemHealth isCollapsed={isCollapsed} />
    </div>
  );
};

export default SidebarBottomSection;
