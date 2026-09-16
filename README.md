# PromptStrike

PromptStrike is an interactive AI red-team workbench for assessing LLM, RAG, and agentic applications. It combines a repeatable assessment methodology with a detailed attack knowledge base, lab-safe canary payloads, evidence guidance, telemetry requirements, defensive controls, and framework mappings.

> PromptStrike is designed for authorized testing and controlled lab environments. The bundled payloads are intentionally non-destructive and use canary behavior rather than real exfiltration or destructive actions.

## Why this project exists

AI red-team checklists often stop at a payload and a pass/fail result. PromptStrike is built around a deeper question: **what trust boundary failed, what evidence proves it, and where should engineering break the attack chain?**

The UI is a single-page React application that can run locally or as a static GitHub Pages site.

## Current coverage

- Direct prompt injection and instruction hierarchy confusion
- Encoding, Unicode, and obfuscation bypass
- Multi-turn context and memory manipulation
- Indirect injection through documents, HTML, metadata, and multimodal content
- RAG poisoning, vector/embedding weaknesses, and cross-tenant data leakage
- System prompt and sensitive information disclosure
- Agent tool abuse, excessive agency, and SSRF
- Improper output handling including XSS, SQL, command, and template injection
- AI supply-chain, MCP/plugin, and data/model poisoning risks
- Unbounded consumption and denial-of-wallet scenarios
- Misinformation and citation-integrity testing

Mappings include the OWASP Top 10 for LLM Applications 2025 and MITRE ATLAS, with NIST AI RMF, Google SAIF, and CSA agentic AI guidance linked as supporting references.

## What makes PromptStrike different

Each technique contains:

- security objective and why it matters
- prerequisites and attack path
- concrete attack variants
- non-destructive test payloads
- measurable success criteria
- telemetry to collect
- expected secure behavior
- false-positive traps
- defensive controls and breakpoints
- OWASP and MITRE mappings

The methodology tracker persists progress in browser local storage so the site can also act as a lightweight assessment workbook.

## Quick start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
promptstrike/
├── src/
│   ├── App.jsx                 # single-page interactive UI
│   ├── styles.css              # responsive dark UI
│   └── data/
│       └── catalog.json        # techniques, methodology, chains, references
├── docs/
│   └── METHODOLOGY.md          # assessment philosophy and evidence model
├── .github/workflows/
│   ├── ci.yml                  # build validation
│   └── pages.yml               # optional GitHub Pages deployment
├── SECURITY.md
└── package.json
```

## Design principles

1. **Untrusted data stays untrusted.** User input, retrieved documents, web content, metadata, model output, and tool responses do not become trusted because an LLM processed them.
2. **Authorization stays outside the model.** The model can propose actions, but deterministic controls decide whether they run.
3. **Evidence beats refusal wording.** A secure refusal is useful, but the actual question is whether the backend, tool, data, and tenant boundaries hold.
4. **Test attack chains, not only prompts.** Prompt injection becomes materially dangerous when it crosses into retrieval, tools, browsers, databases, code execution, or multi-tenant data.
5. **Make tests regression-ready.** Every confirmed issue should become a repeatable test after remediation.

## Roadmap

- [ ] Import/export assessment results as JSON
- [ ] Provider profiles for OpenAI, Anthropic, Bedrock, Azure OpenAI, and local models
- [ ] Optional execution adapters for Promptfoo, Garak, PyRIT, and custom HTTP targets
- [ ] Attack success rate dashboard and repeated-trial statistics
- [ ] SARIF/JSON findings export for CI/CD
- [ ] User-defined technique packs
- [ ] Evidence attachment support
- [ ] Defensive control coverage matrix

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep public test cases non-destructive and suitable for a controlled lab.

## License

MIT. See [LICENSE](LICENSE).
