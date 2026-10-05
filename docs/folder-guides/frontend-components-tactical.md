# 🖥️ Folder Guide: `frontend/src/components/tactical/`

## 🎯 What this folder does (Simple Words)
This folder holds all the **visual UI components and tactical HUD widgets**.

It contains the video viewport screens, interactive polygon canvas editors, flight control decks, multi-camera split grids, audio siren alerts, and evidence review modals.

---

## 🛠️ Technologies & Libraries Used
- **React 19 & TypeScript**: Strongly typed reusable UI components.
- **Tailwind CSS**: Modern tactical design system with glassmorphism and animations.
- **Lucide React (`lucide-react`)**: Clean tactical icons for cameras, drones, batteries, and alerts.
- **HTML5 Canvas API**: Interactive polygon drawing for geofence restricted zones.

---

## 📄 Subcomponents Inside & What They Do

| Component / Folder | What it does |
| :--- | :--- |
| `VideoViewport/` | Core video screen rendering the live MJPEG stream, split layouts (1-UP, 2-UP, 4-UP), suspect portrait cards, and upload controls. |
| `Header/` | Tactical top command bar displaying threat ribbon, UTC system clock, and AI model status. |
| `TacticalSidebar/` | Collapsible left navigation bar with routing links to Airspace, Cameras, Incidents, Recordings, and Settings. |
| `FlightControlDeck/` | Drone flight directives (Takeoff, Patrol, RTL, Land) and mission status monitors. |
| `PerimeterSecurityDeck/` | Ground CCTV controls (Lock Gate, Patrol 360, IR Filter, Reset PTZ). |
| `DroneAvionicsCard/` | Telemetry HUD showing 6S LiPo battery voltage, RTK GPS fix, altitude, and heading. |
| `CameraWallModal/` | Full-screen multi-camera surveillance wall for monitoring multiple live camera feeds simultaneously. |
| `ReIDPanel/` | Suspect matching gallery displaying query crops and top candidate matches from aerial drone footage. |
| `TuningPanel/` | Live sliders for adjusting AI confidence thresholds and restricted zone polygons. |
| `RecordingsView/` | Filterable evidence archive with video playback and photo preview modals. |
| `IncidentLogs/` | Real-time audit log of intrusion alarms, timestamps, and severity levels. |
| `dashboard/DroneDashboard.tsx` | Master dashboard layout combining the header, sidebar, command viewport, and overlays. |
