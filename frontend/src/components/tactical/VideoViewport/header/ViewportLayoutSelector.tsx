import { VIEWPORT_CONTROLS } from "@/constants/tactical";
import { availableViewportLayouts } from "@/utils/gridUtils";
import type { ViewportLayoutSelectorProps } from "@/types";

export function ViewportLayoutSelector({ layoutMode, onLayoutChange, connectedCameraCount }: ViewportLayoutSelectorProps) {
  const options = availableViewportLayouts(connectedCameraCount);
  if (options.length < 2) return null;
  return (
    <div role="group" aria-label="Camera layout" className={VIEWPORT_CONTROLS.layoutGroupClass}>
      {options.map(({ mode, label, tooltip, icon: Icon }) => (
        <button key={mode} type="button" aria-pressed={layoutMode === mode} title={tooltip}
          className={`${VIEWPORT_CONTROLS.layoutButtonClass} ${layoutMode === mode ? VIEWPORT_CONTROLS.activeLayoutClass : VIEWPORT_CONTROLS.inactiveLayoutClass}`}
          onClick={() => onLayoutChange(mode)}>
          <Icon aria-hidden="true" className={VIEWPORT_CONTROLS.iconClass} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ViewportLayoutSelector;
