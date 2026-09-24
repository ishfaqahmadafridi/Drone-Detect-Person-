# AWS ECS Fargate & Cloud Architecture Reference

## Containerized Drone Video Stream Ingestion
- Ingest live drone streams via WebRTC / RTSP gateway running on AWS ECS Fargate.
- Distribute inference tasks asynchronously to workers using AWS SQS + Celery / Redis.
- Store incident snapshots and video recordings into AWS S3 with lifecycle rules transferring to Glacier after 90 days.
