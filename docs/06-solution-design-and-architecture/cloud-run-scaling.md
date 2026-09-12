# Cloud Run — Container Lifecycle and Growth

Status: PROPOSED companion to the [long-term architecture](long-term-architecture.md).
These are design principles, not verified live configuration.

## What the container contains

A Docker image packages the Python application, runtime and pinned dependencies for repeatable deployment.
Cloud Run starts instances of that image to serve requests; an instance behaves like a small application server.
The image contains neither the browser application deployment nor the GPT model weights.
Building in the cloud can avoid requiring Docker Desktop on a developer's computer.
Never bake API keys or private configuration into image layers; inject authorized secrets at runtime.

## Idle and active behavior

With minimum instances set to zero, Cloud Run can terminate idle instances.
A later request starts an instance; this cold start can add latency.
Active instances can serve subsequent requests, and each can handle multiple requests concurrently.
Keeping a minimum instance warm reduces cold starts but incurs idle cost and does not guarantee that instance survives.
Restart, replacement and deployment can lose all process memory; local disk is not durable application storage.
The static Firebase-hosted website remains separate from the Python service lifecycle.

## How scaling works

Cloud Run adds and removes instances based on request concurrency and CPU utilization.
It distributes requests across available instances; registered user count is not the scaling metric.
Configure minimum instances, maximum instances and maximum concurrent requests per instance.
Maximum instances constrains capacity; it is not a guaranteed hard spending cap.
Bursts can cause startup delays, queued requests or rejected requests when capacity is exhausted.
CPU, memory allocation, regional quotas and downstream capacity also constrain achievable throughput.
See [autoscaling](https://docs.cloud.google.com/run/docs/about-instance-autoscaling) and [concurrency](https://docs.cloud.google.com/run/docs/about-concurrency).

## LifeBuckets prerequisites for multiple instances

The Sprint 004 hosted proposal uses one worker and at most one instance because chat state is process-local.
Move conversation/task state into shared durable storage before relying on interchangeable instances.
Move rate limits and active-operation tracking into shared coordination, with atomic updates and expiry.
Preserve owner isolation and make retries safe; never depend on the next request reaching the same instance.
Load-test streaming, slow model responses, restarts and concurrent access before increasing capacity.
More Python instances do not increase the OpenAI project's model quota or remove its rate limits.
Bound model usage, retries, queue depth and agent steps; monitor latency, failures and spending together.

## Longer-running work

Persist work before returning success to the caller; do not rely on a detached background thread surviving.
Use queued requests for bounded work, or evaluate Cloud Run Jobs for finite work outside request lifetimes.
The browser can follow durable task progress and retrieve a result after reconnecting.
Select timeouts against the complete request path, including any Firebase Hosting proxy limit.
See [Cloud Tasks integration](https://docs.cloud.google.com/run/docs/triggering/using-tasks) and [Cloud Run Jobs](https://cloud.google.com/run/docs/create-jobs).
