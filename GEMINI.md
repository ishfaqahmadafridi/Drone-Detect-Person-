# Gemini & AI Assistant Rules for Drone-Detect-Person

## System Directives
- **Aerial Vision Backend (`backend/`)**: Prioritize low-latency inference, multi-person gathering alerts (>= 2 persons), restricted zone polygon intrusion triggers, and WebSocket telemetry broadcasts.
- **Tactical Frontend (`frontend/`)**: Implement Next.js App Router, TypeScript, Tailwind CSS, and shadcn-style atomic design tokens for real-time monitoring HUDs and interactive zone editors.
- **Zero Inline Types Rule**: Component prop interfaces must never be defined inline in `.tsx` files; they must reside in `src/types/components.ts` and be imported via `@/types`.
- **Custom Hook Encapsulation**: All queries, mutations, modals, and reactive metric state must be abstracted into dedicated hooks in `src/hooks/`.
- **Centralized Threat Utilities**: Threat comparisons (`isThreatDanger`, `isThreatWarning`, `getThreatBadgeStyle`) must reside in `src/utils/threatUtils.ts`.
- **Cloud Readiness**: Implement stateless container patterns compatible with AWS ECS Fargate, Cloudflare Edge, and S3/R2 storage.
