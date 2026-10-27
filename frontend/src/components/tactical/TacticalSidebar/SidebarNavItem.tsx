
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
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
          ? TACTICAL_VIEW_STYLES.SidebarNavItem_button_className
          : TACTICAL_VIEW_STYLES.SidebarNavItem_button_className_2
      } ${isCollapsed ? "justify-center px-0" : ""}`}
      title={item.label}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          isActive ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className : TACTICAL_VIEW_STYLES.SidebarNavItem_Icon_className
        }`}
      />

      {!isCollapsed && (
        <span className="truncate flex-1 text-left">{item.label}</span>
      )}

      {/* Threat Alert Badge */}
      {!isCollapsed && item.id === "incidents" && threatLevel !== "CLEAR" && (
        <span className={TACTICAL_VIEW_STYLES.SidebarNavItem_span_className}>
          ALERT
        </span>
      )}

      {!isCollapsed && (
        <ChevronRight
          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
            isActive ? TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className : TACTICAL_VIEW_STYLES.SidebarNavItem_ChevronRight_className
          }`}
        />
      )}
    </button>
  );
};

