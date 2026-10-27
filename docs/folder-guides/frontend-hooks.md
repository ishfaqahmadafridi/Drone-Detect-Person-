# 🪝 Folder Guide: `frontend/src/hooks/`

## 🎯 What this folder does (Simple Words)
This folder holds **custom React hooks** that encapsulate complex state, side-effects, WebSockets, and audio logic.

Instead of writing complicated code inside visual UI components, hooks provide clean, reusable state helpers for things like sound effects, real-time telemetry sockets, video uploading, and URL synchronization.

---

## 🛠️ Technologies & Libraries Used
- **React Hooks (`useState`, `useEffect`, `useCallback`, `useSyncExternalStore`)**: Efficient lifecycle and state management.
- **Web Audio API (`AudioContext`)**: Synthesizes authentic tactical alarm sirens and beep sound effects without external audio files.
- **Next.js Navigation (`useRouter`, `usePathname`)**: Client-side URL route management.

---

## 📄 Files Inside & What They Do

| Hook | What it does |
| :--- | :--- |
| `useDashboardOrchestrator.ts` | Master orchestrator hook coordinating active navigation tabs, URL synchronization, sidebar collapse, and drone views. |
| `useTelemetrySocket.ts` | Connects to `/ws/telemetry` and streams real-time detection boxes, FPS, and avionics into Redux. |
| `useReID.ts` | Polls the Ground-to-Aerial Person Re-Identification status and query matches. |
| `useAudioAlert.ts` | Generates procedural tactical warning sirens when threat level enters `INTRUSION`. |
| `useCameraFleet.ts` | Queries and manages configured tactical cameras from `/api/cameras`. |
| `useCameraWall.ts` | Controls opening, closing, and selecting live camera feeds on the CCTV wall. |
| `useSystemClock.ts` | SSR hydration-safe UTC military clock synced across the entire HUD. |
| `useZoneCanvas.ts` | Interactive canvas drawing logic for dragging and editing polygon geofence vertices. |
| `useVideoUpload.ts` | Handles uploading test `.mp4` video files with progress percentage tracking. |
| `useDroneFlight.ts` | Dispatches flight commands (`takeoff`, `patrol`, `land`) to the backend. |
| `useChannelPanel.ts` | Manages stream revision keys, video replay triggers, and network camera connections. |
