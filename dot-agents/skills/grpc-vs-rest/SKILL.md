---
name: grpc-vs-rest
description: "Choose REST or gRPC deliberately. Use before API design, service boundaries, generated clients, or internal integration work."
license: MIT
---

# gRPC vs REST

REST is default. Use gRPC only with a concrete reason.

## Choose REST When

- Public/product API.
- Browser or broad client access.
- Simple CRUD/resources.
- Human-debuggable HTTP matters.
- Existing system is REST.
- A read-model update can be eventually consistent and a materialized-view refresh or outbox/event propagation would be simpler than synchronous service coupling.

## Choose gRPC When

- Internal service-to-service API.
- Strong typed contract and generated clients matter.
- Streaming is required.
- Low latency/high throughput is measured need.
- Both sides can support protobuf lifecycle.
- A read-model service requires synchronous internal confirmation and the business accepts command availability coupling.

## Required Considerations

- Auth and mTLS.
- Gateway/ingress compatibility.
- Versioning and backwards compatibility.
- Test tooling.
- Observability and error mapping.

## Output

```md
Choice:
Reason:
Rejected alternative:
Contract format:
Client generation:
Test strategy:
Risks:
```
