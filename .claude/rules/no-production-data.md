## No Production Data or Secrets in Repo

**Rule:** Production data and secrets must never appear in the project's working tree, regardless of whether they would be committed or gitignored. This applies to source files, docs, plans, scratchpads, generated artefacts, and anything an agent writes.

### What counts as production data

- **Personally identifiable information (PII):** real names, email addresses, phone numbers, postal addresses, dates of birth
- **Person / customer identifiers:** national identifiers, member numbers, account numbers, customer IDs, record IDs
- **Organisation identifiers:** real organisation names, provider/registry codes, vendor identifiers, decentralised identifiers (DIDs)
- **Internal infrastructure values:** cluster URLs, internal hostnames, pod names, IP addresses (private ranges included), Kubernetes namespace names that reveal environment specifics, Keycloak realm/user IDs, refresh-token IDs, session IDs
- **Internal service / code identifiers:** specific microservice names, internal code module paths, internal data-stream prefixes — when they're discovered via probes against production rather than already-public documentation
- **Production volume metrics:** specific record counts, bucket counts, unique user counts that reveal scale

### What counts as a secret

- API keys, tokens, refresh tokens, passwords, client secrets
- Signing keys, encryption keys, JWT secrets
- API key **identifiers** when the system uses them as routable handles (e.g. Elasticsearch API key IDs that appear in audit logs)
- Webhook URLs with embedded tokens
- Connection strings that contain credentials

### What to do instead

- **Use placeholders.** Inline: `<region-name>`, `<organisation-id>`, `<api-key>`, `<service-name>`. For counts: `N` or descriptive text like "the dominant value".
- **Store real values out of the working tree.** `.env` (gitignored) for secrets and project-specific values. The agent's persistent memory (outside the repo) for working notes that include real values temporarily.
- **Redact at the boundary.** Tools that capture data from production sources (probes, log scrapers, response captures) must redact before writing to disk — not after the fact.
- **Treat tool output critically.** When a tool (`Read`, MCP search, shell command) returns data that contains production values, do not paste it verbatim into committed or working-tree files. Summarise structurally; cite values only via placeholder.

### Verification before completion

Before claiming a task complete, grep the working tree for the markers most relevant to the project:

- Real organisation / practitioner / patient names
- Email-domain patterns from the production environment
- API key fragments
- Real cluster / pod / IP patterns
- Service names that come from probes, not from public docs

The hook [.claude/hooks/block-hardcoded-secrets.md](../hooks/block-hardcoded-secrets.md) catches some of this at write time; this rule covers the rest (PII and infra values that aren't classic "secrets" but still shouldn't leak).

### When in doubt

If you're unsure whether a value qualifies as production data, treat it as such and use a placeholder. The cost of an unnecessary placeholder is near zero; the cost of a leak is high. Ask the user explicitly when the line is genuinely ambiguous.
