# Roadmap

`git-mailmap` 1.0 provides the stable string-based `parse`, `resolve`, and
`serialize` API.

## 1.x priorities

- Expand differential and conformance testing against Git.
- Benchmark parsing and resolution with large real-world mailmaps.
- Verify browser runtimes and publish a tested browser support matrix.
- Track future Git mailmap behavior without adding runtime dependencies.

## Deferred integrations

File I/O, Git configuration and blob lookup, CLI tooling, mailmap generation,
and Git-library integrations remain outside the core package. They may be
provided as separate packages if there is demand.

Priorities are ordered by compatibility and user feedback; no dates are
promised.
