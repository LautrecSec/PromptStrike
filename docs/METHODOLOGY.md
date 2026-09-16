# PromptStrike Methodology

PromptStrike separates an AI security assessment into four layers:

1. **Model behavior**: Can adversarial input change model behavior?
2. **Application trust boundaries**: Does untrusted content cross into trusted context, memory, retrieval, or structured output?
3. **Execution boundaries**: Can model output cause an unauthorized tool, network, database, browser, or code action?
4. **Impact controls**: Do tenant isolation, authorization, egress restrictions, quotas, and monitoring limit blast radius?

## Evidence model

A useful finding should capture:

- test case identifier and exact input
- target application, model, model version, and relevant configuration
- retrieved content IDs and provenance when RAG is involved
- tool calls, arguments, authorization decisions, and side effects
- raw and normalized guardrail decisions
- expected secure behavior
- actual result
- repeated-trial result when model nondeterminism matters
- root cause at the application/control layer
- a regression test that can be run after remediation

## Measuring attack success

Attack Success Rate (ASR) is useful only when the success rubric is narrow and reproducible. A stylistic change or a model mentioning a canary is not necessarily a compromise.

Prefer security-property assertions such as:

- unauthorized tool execution occurred
- cross-tenant data was returned
- active script executed in the browser
- untrusted retrieved content changed an authorization decision
- request exceeded the deterministic execution budget

For nondeterministic tests, run multiple trials and record model/provider/version and sampling configuration.

## Severity model

Severity is contextual. PromptStrike's labels are starting points, not universal scores.

- **Critical**: reliable path to unauthorized privileged action, code execution, secrets, or cross-tenant data
- **High**: strong security-boundary bypass with material downstream impact or broad exploitability
- **Medium**: model/policy weakness requiring additional conditions or producing limited direct impact
- **Low**: hardening or observability gap with little direct exploitability

## Rules of engagement

Only test systems you own or are authorized to assess. Prefer synthetic tenant data, non-destructive canaries, isolated accounts, and explicit request/cost budgets. Do not use production secrets as test markers.
