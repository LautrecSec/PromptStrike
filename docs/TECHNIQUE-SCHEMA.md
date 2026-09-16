# Technique Schema

PromptStrike techniques are stored in `src/data/catalog.json`. Each record is designed to capture enough context to turn a one-off adversarial prompt into a repeatable security test.

| Field | Purpose |
| --- | --- |
| `id` | Stable technique identifier |
| `title` | Human-readable technique name |
| `category` | Attack family used for filtering and grouping |
| `severity` | Contextual starting severity |
| `summary` | Short description of the security problem |
| `whyItMatters` | Impact and trust-boundary rationale |
| `owasp` | OWASP LLM/GenAI mappings |
| `atlas` | MITRE ATLAS mappings |
| `preconditions` | Conditions required before the technique is meaningful |
| `attackPath` | Ordered path from attacker input to security impact |
| `variants` | Common technique variations |
| `safePayloads` | Non-destructive, lab-safe test cases |
| `successCriteria` | Observable conditions that constitute a successful test |
| `telemetry` | Evidence that should be captured during execution |
| `falsePositives` | Conditions that can look vulnerable without proving impact |
| `expectedSecureBehavior` | What a correctly protected system should do |
| `mitigations` | Defensive controls and attack-chain breakpoints |

## Technique quality bar

A new technique should be more than a prompt string. It should explain the security property being tested, how to prove or disprove compromise, and how engineering can break the attack path.

For nondeterministic model behavior, success criteria should favor system-level evidence such as unauthorized tool execution, cross-tenant retrieval, policy bypass, or downstream side effects rather than wording changes alone.
