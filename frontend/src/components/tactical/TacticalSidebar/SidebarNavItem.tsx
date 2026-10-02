import React from "react";
import { SidebarNavItemProps } from "@/types";
import { ChevronRight } from "lucide-react";

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  threatLevel,
  onSelect,
}) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] ${
        isActive
          ? "bg-blue-600/20 text-white border border-blue-500/50 shadow-sm font-semibold"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent hover:border-slate-800/80"
      } ${isCollapsed ? "justify-center px-0" : ""}`}
      title={item.label}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
        }`}
      />

      {!isCollapsed && (
        <span className="truncate flex-1 text-left">{item.label}</span>
      )}

      {/* Threat Alert Badge */}
      {!isCollapsed && item.id === "incidents" && threatLevel !== "CLEAR" && (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse">
          ALERT
        </span>
      )}

      {!isCollapsed && (
        <ChevronRight
          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
            isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"
          }`}
        />
      )}
    </button>
  );
};

