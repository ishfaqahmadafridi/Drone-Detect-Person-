
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import React from "react";
import { cn } from "@/lib/utils";
import { MetricTileProps } from "@/types";
import { ChevronRight } from "lucide-react";

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  icon,
  value,
  subValue,
  progressPercent,
  progressBarColor = TACTICAL_VIEW_STYLES.MetricTile_color,
  isAlertActive = false,
  alertBorderColor = TACTICAL_VIEW_STYLES.MetricTile_color_2,
  className,
  onClick,
  actionHint,
  isClickable,
  showProgressLine = progressPercent !== undefined,
}) => {
  const clickable = isClickable || Boolean(onClick);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "glass-panel p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all duration-150 select-none",
        isAlertActive ? alertBorderColor : TACTICAL_VIEW_STYLES.MetricTile_div_className,
        clickable && TACTICAL_VIEW_STYLES.MetricTile_div_className_2,
        className
      )}
    >
      <div>
        <div className={TACTICAL_VIEW_STYLES.MetricTile_div_className_3}>
          <span className={TACTICAL_VIEW_STYLES.MetricTile_span_className}>{title}</span>
          <span className={TACTICAL_VIEW_STYLES.MetricTile_span_className_2}>{icon}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={TACTICAL_VIEW_STYLES.MetricTile_span_className_3}>{value}</span>
          <span className={TACTICAL_VIEW_STYLES.MetricTile_span_className_4}>{subValue}</span>
        </div>
      </div>

      {/* Clean Enterprise Progress Indicator */}
      {showProgressLine && progressPercent !== undefined && (
        <div className={TACTICAL_VIEW_STYLES.MetricTile_div_className_4}>
          <div
            className={cn("h-full transition-all duration-200", progressBarColor)}
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}

      {/* Sub-action hint */}
      {actionHint && (
        <div className={TACTICAL_VIEW_STYLES.MetricTile_div_className_5}>
          <span className="font-normal">{actionHint}</span>
          <ChevronRight className={TACTICAL_VIEW_STYLES.MetricTile_ChevronRight_className} />
        </div>
      )}
    </div>
  );
};

export default MetricTile;
