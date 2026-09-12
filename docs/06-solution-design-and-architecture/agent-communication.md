# Agent Communication — APIs, Pub/Sub and Kafka

Status: PROPOSED companion to the [long-term architecture](long-term-architecture.md).
No message broker or multi-agent subsystem is selected for immediate Sprint 004 implementation.

## Communication patterns

Use authenticated HTTPS for a bounded request whose result the caller needs immediately.
Call a Cloud Run service URL, not an individual container; each service can scale independently.
Use runtime service identities, identity tokens and narrowly granted invocation permissions.
Avoid downloaded service-account keys; validate the user/task context as well as the calling service.
See [service-to-service authentication](https://docs.cloud.google.com/run/docs/authenticating/service-to-service).

Use Cloud Tasks for an explicit instruction to a particular worker, with controlled dispatch and retries.
Use Pub/Sub for an event that independent subscribers may each need to process.
For example, “generate weekly review” is a task; “weekly review completed” is an event.
Give planning and notification agents separate subscriptions when both need every completion event.
Worker replicas on the same subscription share delivery work rather than each receiving every event.
See [Cloud Tasks](https://docs.cloud.google.com/run/docs/triggering/using-tasks) and [Pub/Sub with Cloud Run](https://docs.cloud.google.com/run/docs/tutorials/pubsub).

## Pub/Sub compared with Kafka

| Concern | Google Pub/Sub | Apache Kafka |
|---|---|---|
| Core model | Topics and acknowledged subscription deliveries | Partitioned event logs and consumer offsets |
| Operations | Google manages infrastructure and scaling | Self-managed cluster or managed Kafka provider |
| Scaling | No user-managed partitions | Partition and deployment capacity affect parallelism |
| Ordering | Optional ordering keys, with regional requirements | Order within a partition |
| Replay | Retained messages via seek/snapshots | Retained records reread by offset |
| Portability | Google Cloud service | Open-source ecosystem across clouds and on-premises |

Both support high-volume events and replay; neither is automatically the cheaper or faster choice.
Managed Kafka reduces infrastructure work but retains Kafka's data model and configuration considerations.
Prefer Pub/Sub initially for Google Cloud event collaboration; consider Kafka for a concrete need for its ecosystem, stream processing or portability.
Large user counts alone do not require Kafka. Benchmark the actual workload before a later platform decision.
Sources: [Google comparison](https://docs.cloud.google.com/pubsub/docs/migrating-from-kafka-to-pubsub), [Kafka design](https://kafka.apache.org/41/design/design/), [Pub/Sub replay](https://docs.cloud.google.com/pubsub/docs/replay-overview).

## Shared state and safe collaboration

Proposed message fields: schema version, event/task ID, user ID, conversation ID, correlation ID, deadline and scoped input references.
Transmit only necessary context; a user ID in a message is not proof of permission.
Store task status, outputs and conversation history durably; containers do not share RAM.
Handle duplicate delivery using task IDs and atomic claims; make external effects idempotent where possible.
Broker delivery guarantees do not guarantee exactly-once GPT calls, notifications or database effects.
Bound retries, agent handoffs, elapsed time and model spending; record failures for recovery and cancellation.
Trace a request across agents using correlation IDs without logging secrets or unnecessary personal content.
Persist results before acknowledging work; let the coordinator deliver results when the user reconnects.
Future interface contracts must define ownership, authorization, errors, retention and retry behavior before coding.
