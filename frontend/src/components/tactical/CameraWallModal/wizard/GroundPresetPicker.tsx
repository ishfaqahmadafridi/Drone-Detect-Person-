import { GROUND_SENSOR_PRESETS, GROUND_PRESET_STYLES } from "@/constants/tactical";
import type { GroundPresetPickerProps } from "@/types";

export function GroundPresetPicker({ config, onApplyPreset }: GroundPresetPickerProps) {
  const group = config.deviceCategory === "mobile_phone" ? "phone" : config.connectionType;
  return (
    <div className={GROUND_PRESET_STYLES.panel}>
      <span className={GROUND_PRESET_STYLES.title}>QUICK CHANNEL PRESETS:</span>
      <div className={GROUND_PRESET_STYLES.grid}>
        {GROUND_SENSOR_PRESETS.filter(preset => preset.group === group).map(preset => (
          <button key={preset.label} type="button" onClick={() => onApplyPreset(preset.config)}
            className={`${GROUND_PRESET_STYLES.button} ${config.host === preset.config.host ? GROUND_PRESET_STYLES.selected : GROUND_PRESET_STYLES.idle}`}>
            <span className={GROUND_PRESET_STYLES.label}>{preset.label}</span>
            <span className={GROUND_PRESET_STYLES.description}>{preset.config.host}:{preset.config.port}{preset.config.streamPath}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
