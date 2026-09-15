# Architecture Decision Records

Short records of significant, hard-to-reverse technical decisions for AbedLive —
why we chose what we chose, what we considered instead, and what it costs us
going forward. Format follows the standard Michael Nygard ADR shape: Status,
Context, Decision, Consequences.

| # | Title | Status |
| --- | --- | --- |
| [0001](0001-separate-compose-files-for-local-vs-coolify.md) | Separate Compose files for local dev vs. Coolify staging/production | Accepted |
| [0002](0002-runtime-generated-seaweedfs-credentials.md) | Generate SeaweedFS S3 credentials at container runtime, not commit them | Accepted |
| [0003](0003-coolify-domain-routing-via-service-fqdn.md) | Coolify domain routing via `expose:` + `SERVICE_FQDN_<ID>_<PORT>`, not `ports:` | Accepted |
| [0004](0004-manual-profile-gated-migrations-on-coolify.md) | Run DB migrations as a manual, profile-gated one-off on Coolify | Superseded by 0006 |
| [0005](0005-structured-sections-over-freeform-page-builder.md) | Admin content stays structured typed sections — no freeform page builder | **Proposed — flagged for decision** |
| [0006](0006-no-one-off-containers-on-coolify.md) | No one-off containers of any kind in the Coolify Compose stack | Accepted |

Add a new ADR whenever a decision would be expensive to reverse or non-obvious
to a future reader from the code alone (a library/pattern choice made *because*
something else failed, a workaround for a third-party bug, a deliberate
trade-off). Number sequentially, never renumber or delete a superseded record —
mark it "Superseded by NNNN" instead.
