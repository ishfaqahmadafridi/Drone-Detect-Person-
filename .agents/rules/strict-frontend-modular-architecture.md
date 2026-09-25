# Strict Frontend Modular Architecture & Clean Code Rules

All AI agents and developers working on the frontend MUST adhere to the following architecture rules without exception:

## 1. Zero Inline Types & Props Interfaces
- **NEVER** declare `interface Props` or component types inline inside `.tsx` files.
- **ALWAYS** declare component prop types in `src/types/components.ts` and re-export them from `src/types/index.ts`.
- **ALWAYS** import prop interfaces via `@/types` (e.g. `import { HeaderProps, SnapshotCardProps } from "@/types"`).

## 2. Zero Direct Side-Effects & Hook Decoupling
- Components must be strictly presentational or high-level orchestrators.
- **NEVER** write long business logic, data fetching routines, or complex state handlers directly in component render bodies.
- **ALWAYS** encapsulate domain state and side effects in dedicated custom hooks under `src/hooks/` (e.g. `useSnapshotGallery`, `useIncidentLogs`, `useTuningForm`, `useTelemetryMetrics`, `useZoneCanvas`).

## 3. Centralized Domain Predicates and Utilities
- **NEVER** repeat inline string checks (e.g., `alert.threat_level === "INTRUSION"`) or inline styling switches across multiple components.
- **ALWAYS** extract threat level logic, badges, and color mappings to `src/utils/threatUtils.ts` and export routines to `src/utils/exportUtils.ts`.

## 4. Directory Hierarchy & Separation of Concerns
Every file must live in its single-responsibility directory:
- `src/components/tactical/<Feature>/`: Atomic subcomponents (`Header`, `Cards`, `Modals`) with clean `index.tsx` orchestrator.
- `src/hooks/`: Reusable custom hooks encapsulating logic, timers, and state.
- `src/services/api/`: Axios HTTP client and request/response interceptors.
- `src/services/queries/`: TanStack Query hooks (`useQuery`, `useMutation`).
- `src/store/`: Redux Toolkit store, typed hooks (`useAppSelector`, `useAppDispatch`), and feature slices.
- `src/context/`: React Context providers for global browser capabilities (e.g. Audio Siren synthesis, WebSocket connection).
- `src/types/`: Comprehensive TypeScript interfaces, payloads, and component props.
- `src/constants/`: Configuration options, design tokens, and tactical constants.
- `src/utils/`: Pure utility functions and formatters.

## 5. Build and Lint Integrity
- All changes must pass `npm run lint` and `npm run build` with **0 errors and 0 warnings**.
- No `setState` inside direct `useEffect` bodies without event subscriptions (React 19 / Next.js 16 compliance).
