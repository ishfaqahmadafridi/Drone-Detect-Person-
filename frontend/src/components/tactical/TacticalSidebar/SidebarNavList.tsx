"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { SidebarNavListProps } from "@/types";

import { isNavItemActive, sidebarNavItems } from "@/utils/navigation";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  threatLevel,
  viewMode,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1.5 p-2.5 overflow-y-auto">
      <div
        className={`${TACTICAL_VIEW_STYLES.SidebarNavList_div_className}${
          isCollapsed ? "text-center" : ""
        }`}
      >
        {isCollapsed ? "NAV" : "WORKSPACES"}
      </div>

      {sidebarNavItems(viewMode).map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={isNavItemActive(item.id, activeTab)}
          isCollapsed={isCollapsed}
          threatLevel={threatLevel}
          onSelect={onTabChange}
        />
      ))}
    </div>


  );
};

export default SidebarNavList;
