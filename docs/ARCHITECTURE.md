# PromptStrike Architecture

PromptStrike is intentionally implemented as a static, client-side security workbench. It does not execute attacks against remote systems and does not require a backend service.

## Component model

```text
catalog.json
    |
    v
React UI
    |
    +--> Technique Library
    +--> Methodology Tracker
    +--> Attack Chains
    +--> Tools / Framework References
    |
    +--> browser localStorage (assessment progress only)
```

## Trust model

The public application treats payloads as **reference test data**, not executable commands. Copy-to-clipboard is the only payload action in the UI.

- No remote target execution is performed.
- No model provider credentials are collected.
- No assessment data is transmitted to a backend.
- Methodology progress is stored only in browser local storage.
- Public payload examples should remain non-destructive canaries.

This architecture keeps the public project safe to host while preserving the technique depth needed for authorized red-team planning.

## Data model

The main security content lives in `src/data/catalog.json`. Separating content from rendering keeps techniques reviewable and makes future import/export, schema validation, and provider adapters easier to add.

A technique can describe:

- category and severity
- OWASP and MITRE mappings
- security objective and impact
- preconditions
- attack path
- variants
- lab-safe payloads
- measurable success criteria
- telemetry requirements
- false-positive conditions
- expected secure behavior
- defensive controls

See [TECHNIQUE-SCHEMA.md](TECHNIQUE-SCHEMA.md) for the field model.

## Deployment model

The project builds with Vite into static assets under `dist/`. The included GitHub Actions workflow deploys that directory to GitHub Pages. `vite.config.js` uses a relative base path so the site can be hosted under a repository path rather than requiring a root domain.
