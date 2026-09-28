"use client";

import { SidebarNavListProps } from "@/types";

import { NAV_ITEMS } from "@/constants";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  threatLevel,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1.5 p-2.5 overflow-y-auto">
      <div
        className={`px-2 py-1 text-[10px] font-mono-code tracking-wider text-slate-400 uppercase ${
          isCollapsed ? "text-center" : ""
        }`}
      >
        {isCollapsed ? "NAV" : "TACTICAL MODES"}
      </div>

      {NAV_ITEMS.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={activeTab === item.id}
          isCollapsed={isCollapsed}
          threatLevel={threatLevel}
          onSelect={onTabChange}
        />
      ))}
    </div>


  );
};

export default SidebarNavList;
