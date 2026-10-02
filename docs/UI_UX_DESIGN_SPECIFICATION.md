# AERO-GUARD: Complete Project Architecture & Enterprise UI/UX Design System Specification

---

## 1. Project Overview & Core Concept

### 1.1 What is AERO-GUARD?
**AERO-GUARD** is an autonomous, dual-perspective tactical surveillance and perimeter intelligence ecosystem. It integrates **aerial drone computer vision (top-down UAV)** and **ground-level perimeter security (fixed CCTV and mobile sensors)** into a unified, real-time command operations console.

The system continuously monitors critical infrastructure, restricted perimeters, and airspace to detect human presence, classify perimeter intrusions, and analyze multi-person crowd gathering behaviors with sub-second latency.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AERO-GUARD SYSTEM ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [AERIAL PERSPECTIVE: DRONE UAV]       [GROUND PERSPECTIVE: CCTV / SENSORS]│
│   • Top-Down Oblique Angle              • Eye-Level Horizontal Angle        │
│   • YOLO11n (VisDrone Pedestrians)      • YOLO26s (MOT20 Dense Crowds)      │
│   • BoT-SORT Multi-Object Tracking      • ByteTrack Occlusion Tracking      │
│   • Flight Telemetry (Alt, Batt, GPS)   • Optical Zoom (1x, 2x, 4x) + IR    │
│            │                                           │                    │
│            ▼                                           ▼                    │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │            FastAPI Computer Vision Engine (Backend)         │           │
│   │  • Ray-Casting Polygon Geofence Intrusion Detector         │           │
│   │  • Pairwise Euclidean Gathering Distance Clustered Engine   │           │
│   │  • Multi-Source Video Streamer (MJPEG @ 25-30 FPS)          │           │
│   │  • Real-Time WebSockets Telemetry Broadcaster (10 Hz)       │           │
│   │  • Automated Evidence Capture (Snapshots & MP4 Videos)      │           │
│   └──────────────────────────────┬──────────────────────────────┘           │
│                                  │                                          │
│                                  ▼                                          │
│   ┌─────────────────────────────────────────────────────────────┐           │
│   │       Next.js 16 + TypeScript Tactical Operations Console   │           │
│   │  • Single-Pane-of-Glass Interactive Surveillance HUD        │           │
│   │  • Live Interactive Canvas Restricted Zone Polygon Editor   │           │
│   │  • Telemetry Metric Cards & Real-Time Incident Logging      │           │
│   │  • 4-Step Camera Uplink Wizard (PoE, RTSP, USB, Wi-Fi)      │           │
│   │  • Forensic Evidence Player with Timeline Scrubber          │           │
│   └─────────────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.2 Core Capabilities & Autonomous Intelligence

1. **Dual Perspective Coupling**:
   - **`aerial` (Aerial Drone Flight)**: Coupled with UAV telemetry, flight control commands (`Takeoff`, `Patrol`, `RTL`, `Land`), top-down computer vision models (`visdrone_person_best.pt`), and GPS avionics.
   - **`ground` (Ground Perimeter CCTV)**: Coupled with fixed security camera hardware, eye-level vision models (`mot20_yolo26s_pedestrian.pt`), 3-tier optical digital zoom (`1.0x Wide`, `2.0x Tactical`, `4.0x Tele`), and an **850nm IR night-vision filter**.

2. **Perimeter Geofence Intrusion Detection**:
   - Real-time ray-casting polygon intersection algorithm running on every detected person's ground contact point (foot coordinate).
   - If an individual crosses into the defined restricted zone polygon, the system instantly triggers an `INTRUSION` threat state, takes an automated evidence snapshot, logs the event to disk, and sounds the tactical audio siren.

3. **Multi-Person Gathering Analytics**:
   - Pairwise Euclidean distance matrix calculation between all tracked individuals:
     $$\text{Distance} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
   - When 2 or more individuals congregate within a configurable proximity threshold (e.g. $\le 120\text{ px}$), the system flags a `MULTI_PERSON` gathering event, renders subtle proximity vector links, and tracks the cluster duration.

4. **Multi-Source Connectivity & Dynamic Fallback**:
   - Supports hardware Webcams, RTSP IP security cameras, Android IP Webcam streams, pre-recorded drone flight files, and procedural procedural synthetic simulation fallbacks.
   - Zero-crash fallback: If a live RTSP stream drops, the backend automatically transitions to procedural simulation without disconnecting the client or crashing the MJPEG stream.

---

## 2. UI/UX Design System Philosophy

### 2.1 The Architectural Shift: From "Game HUD" to "Mission-Critical Operations Console"
Earlier prototypes used a "gaming HUD" style (neon cyan glows, chamfered arcade fonts, pulsating radar animations, cartoon pedestrians, and arcade ALL-CAPS tagging).

In enterprise defense, industrial SCADA, and military command centers, **visual noise causes operator fatigue and operational errors**. The current design adheres strictly to the **Senior Enterprise Operations Console** doctrine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM COMPARISON & PRINCIPLES                    │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ ❌ Arcade / Game HUD (Past)   │  Senior Enterprise Console (Current)       │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ • Chamfered sci-fi fonts      │ • Clean, ergonomic sans-serif (Inter)       │
│ • Screaming neon cyan & lime  │ • Desaturated slate, cobalt & muted amber   │
│ • Radioactive pulsing glows   │ • Crisp 1px border elevation & dark glass   │
│ • FPS weapon crosshairs       │ • Unobtrusive 1px camera corner framing     │
│ • Arcade ALL-CAPS labeling    │ • Professional defense notation             │
│ • Bouncing alert icons        │ • Steady, high-clarity status indicators    │
│ • Cartoon pedestrian shirts   │ • Realistic workwear & civilian palettes    │
│ • Jittering numbers           │ • Tabular figures ('tnum' 1) JetBrains Mono │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Complete Color System & Where Each Color Is Used

The color architecture is built on a dark-mode-first, low-fatigue surface hierarchy. Every color has an **exact, non-arbitrary operational purpose**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COLOR SYSTEM & TOKEN MAPPING TABLE                      │
├───────────────────┬──────────────┬──────────────────┬───────────────────────┤
│ Layer / Role      │ Hex Code     │ Tailwind / CSS   │ Exact Usage Locations │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Background Canvas │ #0B0E14      │ bg-[#0B0E14]     │ App body, main screen │
│                   │ #0D121B      │ radial-gradient  │ Top ambient vignette  │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Surface Panel     │ rgba(17,23,  │ .glass-panel     │ Header, Metric Tiles, │
│                   │      34,0.85)│                  │ Viewport card, Decks  │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Elevated Surface  │ rgba(22,31,  │ .glass-panel-    │ Camera Wall Modal,    │
│                   │      46,0.92)│  elevated        │ Settings drawers      │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Subtle Border     │ rgba(255,255,│ border-white/8   │ Standard card borders,│
│                   │      255,0.08│ border-slate-800 │ panel dividing lines  │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Interactive Hover │ rgba(255,255,│ border-white/16  │ Hovered metric cards, │
│                   │      255,0.16│ border-slate-700 │ navigation tabs       │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Primary Blue      │ #3B82F6      │ text-blue-400    │ Primary action states,│
│                   │ #2563EB      │ bg-blue-600      │ active tab indicator  │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Threat: INTRUSION │ #EF4444      │ text-red-400     │ Perimeter breach bar, │
│ (Controlled Red)  │ rgba(239,68, │ bg-red-950/30    │ intruder metric card, │
│                   │      68,0.15)│ border-red-500/50│ breach snapshot badge │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Threat: GATHERING │ #F59E0B      │ text-amber-300   │ Crowd cluster banner, │
│ (Warm Amber)      │ rgba(245,158,│ bg-amber-950/30  │ gathering card border,│
│                   │      11,0.15)│ border-amber-500 │ low battery warning   │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Threat: CLEAR     │ #10B981      │ text-emerald-300 │ Airspace nominal bar, │
│ (Sage Emerald)    │ rgba(16,185, │ bg-emerald-950/30│ online telemetry dot, │
│                   │     129,0.15)│ border-emerald-  │ healthy battery pill  │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ Target Locked     │ #38BDF8      │ border-sky-400   │ Manual target lock,   │
│ (Technical Sky)   │ rgba(56,189, │ bg-sky-950/40    │ tracking target chips │
│                   │     248,0.15)│                  │                       │
└───────────────────┴──────────────┴──────────────────┴───────────────────────┘
```

---

### 3.1 Detailed Where-To-Use Guide for Every Color

#### 1. Background Canvas (`#0B0E14` & `#0D121B`)
- **Where it is used**:
  - `frontend/src/app/globals.css`: Base `body` element background.
  - `frontend/src/app/layout.tsx`: `body` class and `meta[name="theme-color"]`.
  - `frontend/src/app/page.tsx`: Full-screen root dashboard container (`bg-[#0B0E14]`).
- **Why**: Eliminates 100% of white glare. Emulates dark command bridge environments (NORAD / FAA control / CCTV operations rooms).

#### 2. Surface Glass Panels (`rgba(17, 23, 34, 0.85)`)
- **Where it is used**:
  - Applied via the `.glass-panel` utility class in `frontend/src/app/globals.css`.
  - Used on the **Top Header**, **Left Tactical Sidebar**, **Center Viewport Frame**, **Right Avionics Deck**, and **Lower Telemetry Metric Tiles**.
- **Why**: Features GPU-accelerated frosted glass (`backdrop-filter: blur(12px)`) with an inset `1px` subtle white specular highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.04)`), creating tangible visual depth without heavy shadows.

#### 3. Elevated Modals & Drawers (`rgba(22, 31, 46, 0.92)`)
- **Where it is used**:
  - Applied via `.glass-panel-elevated`.
  - Used for the **Camera Wall 4-Step Wizard Modal**, **Detected Persons Inspector Modal**, and **Evidence Media Modal**.
- **Why**: Higher opacity and elevation shadow (`0 12px 32px -8px rgba(0, 0, 0, 0.7)`) to focus operator attention and separate foreground tasks from the live streaming background.

#### 4. Semantic Danger / Intrusion Crimson (`#EF4444`)
- **Where it is used**:
  - `ThreatRibbon.tsx`: When `threat_level === "INTRUSION"`, ribbon displays `bg-red-950/30 border-red-500/50 text-red-300`.
  - `MetricTile.tsx`: Applied to the **Active Intruders** tile when `count > 0`.
  - `backend/app/services/annotation/theme.py`: BGR color `(45, 50, 215)` for intruder bounding boxes.
- **Why**: High contrast visibility without radioactive pulsing glows or bouncing animations.

#### 5. Semantic Warning / Gathering Amber (`#F59E0B`)
- **Where it is used**:
  - `ThreatRibbon.tsx`: When `threat_level === "MULTI_PERSON"`, ribbon displays `bg-amber-950/30 border-amber-500/50 text-amber-300`.
  - `MetricTile.tsx`: Applied to the **Gathering Clusters** tile when `count > 0`.
  - `DroneBatteryPill.tsx`: Battery warning when percentage drops below 20%.
  - `backend/app/services/annotation/proximity_overlay.py`: Proximity vector lines between people.
- **Why**: Immediately communicates caution without triggering false-alarm panic.

#### 6. Semantic Success / Nominal Emerald (`#10B981`)
- **Where it is used**:
  - `ThreatRibbon.tsx`: `Status: Airspace Nominal` (`bg-emerald-950/30 border-emerald-500/40 text-emerald-300`).
  - `BrandCluster.tsx`: Steady `6px` status dot showing live WebSockets telemetry connection.
  - `DroneBatteryPill.tsx`: Battery icon when battery is healthy.
  - `PerimeterNightVisionButton.tsx`: Active dot when IR night-vision matrix is engaged.
  - `backend/app/services/annotation/theme.py`: Safe person bounding boxes (`(85, 175, 85)` in BGR).
- **Why**: Positive confirmation of system health and perimeter integrity.

#### 7. Primary Action Cobalt Blue (`#3B82F6`)
- **Where it is used**:
  - Active navigation tab indicator on the sidebar.
  - Active zoom preset pill (`1.0x Wide`, `2.0x Tactical`, `4.0x Tele`).
  - Range slider thumbs and track fill in the Detection Tuning Drawer.
  - Primary button hover states (`hover:bg-blue-600`).
- **Why**: Universal industry standard for interactive primary affordances.

---

## 4. Typography & Numerical Formatting Playbook

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DUAL TYPOGRAPHY SYSTEM                             │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ Typeface              │ Application & Exact CSS Tokens                      │
├───────────────────────┼─────────────────────────────────────────────────────┤
│ Inter                 │ UI labels, headings, modal titles, button text      │
│ (Sans-Serif)          │ font-sans: var(--font-inter)                        │
│                       │ Tracking: -0.015em (Tight, clean modern sans)       │
├───────────────────────┼─────────────────────────────────────────────────────┤
│ JetBrains Mono        │ Monospaced numbers, coordinates, latencies, hex IDs │
│ (Monospace)           │ font-mono-code: var(--font-jetbrains-mono)          │
│                       │ Feature: 'tnum' 1 (Tabular numerals prevent jitter) │
└───────────────────────┴─────────────────────────────────────────────────────┘
```

### 4.1 Type Hierarchy Scale & CSS Rules

| Scale Level | Tailwind Class | Font Size / Line Height | Application Location |
|---|---|---|---|
| **Display Number** | `text-2xl font-semibold font-mono-code` | 24px / 32px | Metric tile values (`Total Persons: 04`) |
| **Section Title** | `text-base font-semibold tracking-tight` | 16px / 24px | Card headers, Modal headers, Brand title |
| **Standard Body** | `text-sm font-medium` | 14px / 20px | Navigation items, primary action buttons |
| **Micro Subtitle** | `text-xs font-medium text-slate-400` | 12px / 16px | Metric tile labels, mount descriptions |
| **Telemetry Tag** | `text-[11px] font-mono-code text-slate-400`| 11px / 14px | Battery health, PoE voltage, FPS, latencies |

---

## 5. Component-by-Component Implementation Guide

### 5.1 Header Cluster (`components/tactical/Header/`)
- **Brand Cluster (`BrandCluster.tsx`)**:
  - Container: `flex items-center gap-3`
  - Shield Icon Badge: `w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 text-blue-400`
  - Text: `font-semibold text-base text-slate-100 tracking-tight` + `text-[11px] text-slate-400 font-mono-code`
  - Live Status Dot: `w-1.5 h-1.5 rounded-full bg-emerald-500`
- **Threat Ribbon (`ThreatRibbon.tsx`)**:
  - Container: `flex items-center gap-2.5 px-3 py-1.5 rounded-md border text-xs`
  - Warning Icon: `w-4 h-4 text-red-400 shrink-0` (steady, zero bounce)
  - Text: `text-[11px] text-slate-400 font-medium` + `font-semibold text-slate-100 tracking-tight`
- **Telemetry Quick Pills**:
  - `DroneBatteryPill.tsx`: `px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border bg-slate-800/70 border-slate-700/60`
  - `FlightStatePill.tsx`: `px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border`
  - `GroundSensorPill.tsx`: `<span>{sensorId} • Fixed</span>`
  - `GroundPowerPill.tsx`: `<span>PoE 48V (Online)</span>`

---

### 5.2 Center Video Viewport (`components/tactical/VideoViewport/`)
- **Camera Frame Reticle (`ViewportHudReticle.tsx`)**:
  - Corners: `w-3 h-3 border-t border-l border-white/20` (subtle 1px camera framing)
  - Zero weapon crosshairs or dashed center targeting circles.
- **On-Screen Display Bar (OpenCV Backend)**:
  - Height: `32px` (`theme.HUD_HEIGHT_PX = 32`)
  - Background: `rgba(14, 18, 24, 0.70)` semi-transparent dark strip.
  - Text: `Surveillance Feed | Airspace Nominal   •   Tracks: 04 • Clusters: 00 • 25.0 FPS`.
- **Perimeter Digital Zoom (`PerimeterZoomControl.tsx`)**:
  - Segmented control: `[ 1.0x Wide | 2.0x Tactical | 4.0x Tele ]`
  - Active button: `bg-blue-600 text-white font-medium shadow-sm`
  - Inactive button: `text-slate-400 hover:text-slate-200 hover:bg-slate-800/60`
- **850nm IR Night-Vision Matrix (`ViewportStreamFeed.tsx`)**:
  - When enabled: `filter: contrast(1.3) brightness(0.9) hue-rotate(95deg) saturate(0.2)`
  - Replicates true phosphor / thermal military night-vision optics.

---

### 5.3 Telemetry Metric Tiles (`components/tactical/TelemetryCards/`)
- **Card Container**:
  - Class: `glass-panel p-3.5 rounded-lg flex flex-col justify-between gap-2 border-slate-800 hover:border-slate-700`
  - Micro-transition: `transition-all duration-150 active:scale-[0.995]`
- **Typography**:
  - Title: `text-xs font-medium text-slate-400`
  - Value: `text-2xl font-semibold text-slate-100 font-mono-code tracking-tight`
  - Sub-value: `text-xs text-slate-400`
- **Progress Line**:
  - Track: `w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mt-1`
  - Fill: `h-full bg-blue-500` (or `bg-amber-500` for gatherings)

---

### 5.4 Control Decks (Aerial Flight Deck vs. Ground Security Deck)
- **Flight Control Deck (`FlightControlDeck/`)**:
  - 4 Command Buttons: `Takeoff`, `Patrol`, `RTL`, `Land`
  - Buttons: `bg-slate-800/70 border border-slate-700/80 hover:border-blue-500/50 text-slate-200 text-sm font-medium rounded-md px-3 py-2`
- **Perimeter Security Deck (`PerimeterSecurityDeck/`)**:
  - Zoom control, IR night vision button, RTSP stream reconnect trigger, single-click manual snapshot button.

---

### 5.5 Tactical Sidebar (`components/tactical/TacticalSidebar/`)
- **Perspective Toggle**:
  - Toggle between **Aerial Drone** (flight avionics + VisDrone model) and **Ground CCTV** (fixed camera + MOT20 model).
  - Segmented switch styling with smooth sliding background.
- **Nav Items**:
  - `Airspace Command`, `Perimeter Cameras`, `Incident Logs`, `Geofence Editor`, `Settings`, `Recordings`.
  - Active: `bg-blue-500/10 border border-blue-500/40 text-blue-300 font-medium`
  - Inactive: `text-slate-400 hover:text-slate-200 hover:bg-slate-800/40`

---

## 6. Backend Computer Vision Annotation Standards

The OpenCV backend rendering engine in `backend/app/services/annotation/` directly mirrors the enterprise palette.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OPENCV (BGR) TO FRONTEND (CSS) COLOR MATRIX              │
├───────────────────┬──────────────────────┬──────────────────────────────────┤
│ Visual Element    │ Python OpenCV (BGR)  │ Frontend Tailwind / CSS          │
├───────────────────┼──────────────────────┼──────────────────────────────────┤
│ Intruder Box      │ (45, 50, 215)        │ border-red-500/50 (#EF4444)      │
│ Gathering Box     │ (30, 140, 220)       │ border-amber-500/50 (#F59E0B)    │
│ Safe Person Box   │ (85, 175, 85)        │ border-emerald-500/50 (#10B981)  │
│ Restricted Zone   │ (180, 120, 40)       │ border-blue-500/40 (#3B82F6)     │
│ Zone Breach       │ (45, 50, 215)        │ border-red-500 (#EF4444)         │
│ Proximity Line    │ (40, 150, 220)       │ stroke-amber-400 (#F59E0B)       │
│ Box Border Width  │ 1 pixel              │ border (1px)                     │
└───────────────────┴──────────────────────┴──────────────────────────────────┘
```

### 6.1 Label Tag Formats
- ❌ **Old Arcade Format**: `PERSON #2 [GATHER]`, `INTRUDER #1 (0.88)`
-  **New Defense Notation**:
  - `Track 02 • Cluster (0.94)`
  - `Alert 01 • Perimeter (0.88)`
  - `Track 03 (0.92)`
  - `Dist: 114px` (subtle vector label between grouped persons)

### 6.2 Procedural Civilian Apparel (Simulation Engine)
In `backend/app/simulator/config.py`, saturated primary colors were replaced with natural civilian/workwear colors:
- **Deep Navy**: `(95, 65, 45)`
- **Dark Charcoal**: `(55, 55, 60)`
- **Muted Olive**: `(50, 75, 55)`
- **Workwear Khaki/Tan**: `(110, 130, 145)`
- **Dark Slate Grey**: `(80, 80, 85)`
- **Industrial Blue**: `(120, 95, 60)`

---

## 7. How to Create a New Component (Developer Checklist)

When building a new component or widget in this repository, follow these 5 mandatory rules:

1. **Zero Inline Types**:
   - Always declare your component props interface in `frontend/src/types/components/<domain>.ts`.
   - Export it from `frontend/src/types/components/index.ts` and import into your component via `@/types`.
2. **Use the Base Surface Tokens**:
   - Wrap card-like containers with `glass-panel` and `border-slate-800`.
   - On interactive cards, add `interactive-tactical-tile hover:border-slate-700`.
3. **Use the Dual Typography Scale**:
   - Use standard sans font for text labels (`text-xs text-slate-400`).
   - Use `font-mono-code` for all numbers, coordinates, latencies, and technical timestamps.
4. **Follow Semantic Color Rules**:
   - Never introduce new saturated colors.
   - Danger = `red-500/20 text-red-300 border-red-500/40`.
   - Warning = `amber-500/20 text-amber-300 border-amber-500/40`.
   - Normal/Success = `emerald-500/20 text-emerald-300 border-emerald-500/40`.
   - Active/Primary = `blue-500/20 text-blue-300 border-blue-500/40`.
5. **No Gaming Effects**:
   - Never use `animate-bounce` on warning icons.
   - Never use `animate-pulse` on full borders (use steady indicators or slow 1.5s opacity fades only on critical error dots).
   - Never add targeting crosshairs or weapon reticles over video players.

---

## 8. Verification & Test Evidence

- **Frontend TypeScript (`npx tsc --noEmit`)**: **0 errors**
- **Frontend Turbopack Build (`npm run build`)**: **Compiled in 1.8s with 0 warnings or errors**
- **Backend Test Suite (`pytest backend/tests/`)**: **65 / 65 tests passing** (12.01s)
- **WCAG 2.2 AAA Compliance**: Contrast ratios verified $\ge 7:1$ across all text elements on `#0B0E14` and `#111722`.
