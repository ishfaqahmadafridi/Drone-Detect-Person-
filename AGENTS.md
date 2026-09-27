# Agent Guidelines for Drone-Detect-Person (AERO-GUARD)

This repository is powered by specialized agent skills, guidelines, and modular microservice architecture:

## Directory Structure
- `backend/`: FastAPI Computer Vision & Aerial Detection Engine (YOLOv8 + ByteTrack + WebSockets + MJPEG stream).
- `frontend/`: Next.js 16 + TypeScript + Tailwind CSS Tactical HUD (interactive canvas zone editor, Web Audio siren, telemetry tiles).

## Available Skills & Guidelines
- `expert-cloud-agent-architecture`: Multi-cloud topology (AWS ECS Fargate / GCP Cloud Run), containerization, Terraform IaC, FinOps, and stateless agent orchestration.
- `expert-ui-ux-design`: Pro Max UI/UX design tokens, atomic components, WCAG 2.2 AAA accessibility, and glassmorphism.
- `strict-frontend-modular-architecture`: Zero inline types in `.tsx` files, centralized `src/types/components.ts`, dedicated custom hooks under `src/hooks/`, and centralized domain logic in `src/utils/`.

## Architectural Directives
1. **Modular Decoupling**: Keep computer vision detection, zone monitoring, and alert dispatchers decoupled in `backend/`.
2. **Strict Component Purity**: All component prop interfaces must be defined in `src/types/components.ts` and imported via `@/types`. Never declare `interface Props` inline inside `.tsx` files.
3. **Logic & State Encapsulation**: Extract all business logic, side-effects, timers, and data-fetching into dedicated custom hooks in `src/hooks/`.
4. **Domain Utilities Centralization**: All threat predicates and styling maps must live in `src/utils/threatUtils.ts`.
5. **UI/UX Pro Max Standards**: Apply tactical HUD aesthetics, glassmorphic dark-theme tokens, fluid typography, and responsive grid layouts in `frontend/`.
6. **Stateless Compute**: Ensure container workloads are stateless and scale-ready for cloud deployments.
7. **Interactive Security Controls**: Support dynamic runtime parameter updates and interactive polygon zone editing via REST APIs and WebSockets.
