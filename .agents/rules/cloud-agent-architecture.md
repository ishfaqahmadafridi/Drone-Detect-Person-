# Cloud & Agent Architecture Rules

## Core Principles
1. **Zero Public DB Exposure**: Multi-cloud deployments must isolate Aurora / PostgreSQL and Redis clusters inside private VPC subnets.
2. **Stateless Compute**: Drone video processors, WebSockets, and inference tasks must remain stateless compute workers with distributed state in Redis and blob assets in Cloudflare R2 / AWS S3.
3. **Autonomous Agent Guardrails**: AI agents follow Proposal-Execute patterns with pre-flight checks, state isolation, and deduplication windows.
4. **FinOps & Resource Scaling**: Auto-scale compute dynamically with traffic and enforce zero-downtime health check rollbacks.
