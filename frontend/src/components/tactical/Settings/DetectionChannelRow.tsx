"use client";
import React from "react";
import { SETTINGS_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useDetectionSettings } from "@/hooks/useDetectionSettings";
import type { DetectionChannelRowProps } from "@/types";

export const DetectionChannelRow: React.FC<DetectionChannelRowProps> = ({ channel, label }) => {
  const {
    model, isLoading, confidence, setConfidence, isDirty, zonePoints, saving, saved, error,
    saveConfidence, applyCentreZone, clearZone, saveOnAlert, cooldownSeconds, setSaveOnAlert, setCooldown,
  } = useDetectionSettings(channel);
  const sliderId = `confidence-${channel}`;

  return (
    <div className={SETTINGS_UI.channelClass}>
      <div className={SETTINGS_UI.channelHeaderClass}>
        <h3 className={SETTINGS_UI.channelTitleClass}>{label}</h3>
        <span className={SETTINGS_UI.channelMetaClass}>Model: {isLoading ? "Loading…" : model || "—"}</span>
      </div>

      <div className={SETTINGS_UI.sliderRowClass}>
        <label htmlFor={sliderId} className={SETTINGS_UI.sliderLabelClass}>Minimum confidence</label>
        <input
          id={sliderId}
          type="range"
          min={SETTINGS_UI.confidence.min}
          max={SETTINGS_UI.confidence.max}
          step={SETTINGS_UI.confidence.step}
          value={confidence}
          onChange={event => setConfidence(Number(event.target.value))}
          className={SETTINGS_UI.sliderClass}
        />
        <span className={SETTINGS_UI.sliderValueClass} aria-live="polite">{Math.round(confidence * 100)}%</span>
        <button type="button" onClick={saveConfidence} disabled={!isDirty || saving} className={VIDEO_TOOLS.primaryButtonClass}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className={SETTINGS_UI.zoneRowClass}>
        <span className={SETTINGS_UI.channelMetaClass}>
          Restricted zone: {zonePoints >= 3 ? `On (${zonePoints} corners) — people inside raise an intrusion alert` : "Off — no intrusion alerts"}
        </span>
        <div className={VIDEO_TOOLS.actionsClass}>
          {zonePoints >= 3 ? (
            <button type="button" onClick={clearZone} disabled={saving} className={VIDEO_TOOLS.secondaryButtonClass}>Clear zone</button>
          ) : (
            <button type="button" onClick={applyCentreZone} disabled={saving} className={VIDEO_TOOLS.secondaryButtonClass}>Use centre zone</button>
          )}
        </div>
      </div>

      <div className={SETTINGS_UI.zoneRowClass}>
        <div className={SETTINGS_UI.settingTextClass}>
          <p id={`capture-${channel}`} className={SETTINGS_UI.channelTitleClass}>Save a frame on intrusion</p>
          <p className={SETTINGS_UI.channelMetaClass}>Evidence frames appear in Incident Logs.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={saveOnAlert}
          aria-labelledby={`capture-${channel}`}
          disabled={saving}
          onClick={() => setSaveOnAlert(!saveOnAlert)}
          className={VIDEO_TOOLS.switchTrackClass[saveOnAlert ? "on" : "off"]}
        >
          <span aria-hidden="true" className={VIDEO_TOOLS.switchThumbClass[saveOnAlert ? "on" : "off"]} />
        </button>
      </div>
      {saveOnAlert && (
        <div className={SETTINGS_UI.sliderRowClass}>
          <label htmlFor={`cooldown-${channel}`} className={SETTINGS_UI.sliderLabelClass}>At most one frame every</label>
          <select
            id={`cooldown-${channel}`}
            value={cooldownSeconds}
            disabled={saving}
            onChange={event => setCooldown(Number(event.target.value))}
            className={SETTINGS_UI.selectClass}
          >
            {SETTINGS_UI.cooldownOptions.map(option => <option key={option.seconds} value={option.seconds}>{option.label}</option>)}
          </select>
        </div>
      )}

      {saved && <p role="status" className={VIDEO_TOOLS.statusClass}>{saved}</p>}
      {error && <p role="alert" className={VIDEO_TOOLS.errorClass}>{error}</p>}
    </div>
  );
};

export default DetectionChannelRow;
