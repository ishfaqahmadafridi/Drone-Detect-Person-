# Cloud & Autonomous AI Agent Architecture Rules

- Enforce zero public database exposure with VPC private subnet isolation (Aurora/Redis).
- Stateless compute workers with Redis state and Cloudflare R2 / AWS S3 blob evidence storage.
- Agent systems follow Proposal-Execute Human-in-the-Loop patterns with pre-flight checks and deduplication windows.
