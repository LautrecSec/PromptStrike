# PromptStrike

**Interactive AI red-team workbench for testing how trust breaks across LLMs, RAG pipelines, agents, tools, and downstream systems.**

[![License: MIT](https://img.shields.io/badge/License-MIT-2ea44f.svg)](LICENSE)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![AI Security](https://img.shields.io/badge/AI%20Security-Red%20Team-ff4d46)

PromptStrike combines a repeatable assessment methodology with a detailed attack knowledge base, lab-safe canary payloads, attack-chain analysis, evidence guidance, telemetry requirements, defensive controls, and framework mappings.

> **Authorized testing only.** PromptStrike is designed for systems you own or are explicitly authorized to assess. Public payloads are intentionally non-destructive and use canary behavior rather than destructive actions or real data exfiltration.

![PromptStrike Technique Library](docs/images/01-technique-library.png)

## Why PromptStrike exists

AI red-team checklists often stop at a payload and a pass/fail result. PromptStrike is built around a deeper set of questions:

- What security property is actually being tested?
- Which trust boundary failed?
- What evidence proves a real compromise rather than unusual model wording?
- Which telemetry would let defenders detect the attack?
- Where should engineering break the attack chain?
- Can the finding become a deterministic regression test after remediation?

The result is closer to an **AI security assessment workbench** than a jailbreak collection.

## Technique Library

PromptStrike currently includes **23 deep-dive techniques** spanning model behavior, application trust boundaries, retrieval, agentic execution, downstream output handling, multi-tenant isolation, supply chain, and resilience.

Each technique includes:

- security objective and impact
- realistic preconditions
- ordered attack path
- technique variants
- non-destructive lab test cases
- measurable success criteria
- telemetry and evidence requirements
- expected secure behavior
- false-positive traps
- defensive controls and breakpoints
- OWASP and MITRE mappings

### Indirect prompt injection example

The technique view goes beyond a single malicious string. It captures how poisoned external content reaches the model, what a successful compromise would look like, and the defensive controls that should interrupt the chain.

![Indirect Prompt Injection deep dive](docs/images/02-indirect-prompt-injection.png)

## Attack-chain modeling

Prompt injection becomes materially more dangerous when it crosses from untrusted content into trusted execution.

PromptStrike models chained paths such as:

```text
Poisoned document
      |
      v
RAG retrieval
      |
      v
Instruction accepted by model
      |
      v
Privileged tool call
      |
      v
Unauthorized side effect
```

Each chain identifies **defensive breakpoints**, such as content provenance, retrieved-content screening, authorization outside the model, tool allowlists, egress restrictions, tenant boundaries, and human approval for high-impact actions.

![PromptStrike Attack Chains](docs/images/03-attack-chains.png)

## Structured assessment methodology

The methodology tracker turns the knowledge base into a lightweight assessment workbook. Progress is saved in browser local storage and remains on the local device.

The eight phases cover:

1. reconnaissance and threat modeling
2. direct and indirect prompt injection
3. sensitive information disclosure
4. output integrity and downstream handling
5. excessive agency and tool abuse
6. robustness and resource abuse
7. RAG, model, and supply-chain security
8. reporting, remediation, and regression testing

![PromptStrike Methodology](docs/images/04-methodology.png)

## Current security coverage

| Area | Examples |
| --- | --- |
| Prompt injection | direct override, hierarchy confusion, encoding/Unicode, multi-turn manipulation |
| Indirect injection | documents, HTML, metadata, multimodal content, RAG poisoning |
| Information disclosure | system prompts, sensitive data, training-data extraction, cross-tenant retrieval |
| Agent security | excessive agency, tool misuse, authorization bypass, autonomous side effects |
| Output handling | XSS, SQL/command/template injection, SSRF and unsafe downstream interpretation |
| RAG and vector security | poisoning, unauthorized retrieval, embedding/vector weaknesses, tenant isolation |
| Supply chain | model provenance, plugins/MCP, vulnerable dependencies, poisoned training/fine-tuning data |
| Resilience | unbounded consumption, denial-of-wallet, hallucination/citation integrity |
| Governance | evidence model, repeatable success criteria, remediation and regression testing |

Framework alignment includes **OWASP Top 10 for LLM Applications / GenAI**, **MITRE ATLAS**, **NIST AI RMF**, **Google SAIF**, and **CSA agentic AI guidance**.

## Core design principles

1. **Untrusted data stays untrusted.** User input, retrieved documents, web content, metadata, model output, and tool responses do not become trusted because an LLM processed them.
2. **Authorization stays outside the model.** Models may propose actions, but deterministic controls decide whether those actions execute.
3. **Evidence beats refusal wording.** The important question is whether data, tool, tenant, and execution boundaries hold.
4. **Attack chains matter more than isolated prompts.** A prompt injection finding becomes critical when it reaches privileged tools, sensitive data, browsers, databases, or code execution.
5. **Confirmed findings become regression tests.** Security testing should improve engineering controls, not end with a report.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

Validate the project before publishing changes:

```bash
npm run check
```

Production build:

```bash
npm run build
npm run preview
```

## GitHub Pages

The repository includes `.github/workflows/pages.yml` for automatic static deployment from `main`.

After uploading the repository:

1. Open **Settings > Pages** in GitHub.
2. Set the Pages source to **GitHub Actions** if it is not already selected.
3. Push to `main`, or manually run the **Deploy GitHub Pages** workflow.

The Vite build uses a relative base path, so the project can be hosted under a repository URL without changing the source code.

## Project structure

```text
PromptStrike/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── pages.yml
├── docs/
│   ├── images/
│   │   ├── 01-technique-library.png
│   │   ├── 02-indirect-prompt-injection.png
│   │   ├── 03-attack-chains.png
│   │   └── 04-methodology.png
│   ├── ARCHITECTURE.md
│   ├── METHODOLOGY.md
│   └── TECHNIQUE-SCHEMA.md
├── src/
│   ├── data/
│   │   └── catalog.json
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

PromptStrike is intentionally a static client-side application:

```text
catalog.json
    |
    v
React UI
    |
    +--> Technique Library
    +--> Methodology Tracker
    +--> Attack Chains
    +--> Tool / Framework References
    |
    +--> localStorage (assessment progress only)
```

It does **not** execute attacks against remote targets, collect model credentials, or transmit assessment state to a backend. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Roadmap

- [ ] JSON assessment import/export
- [ ] provider profiles for OpenAI, Anthropic, Bedrock, Azure OpenAI, and local models
- [ ] optional execution adapters for Promptfoo, Garak, PyRIT, and custom HTTP targets
- [ ] repeated-trial Attack Success Rate dashboard
- [ ] SARIF and JSON findings export for CI/CD
- [ ] user-defined technique packs
- [ ] evidence attachment support
- [ ] defensive-control coverage matrix

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Technique contributions should explain the security property being tested and use non-destructive canaries suitable for controlled environments.

## Security

See [SECURITY.md](SECURITY.md) for safe-use and vulnerability-reporting guidance.

## Author

Built by [Simon Kudla / LautrecSec](https://github.com/LautrecSec) as a practical AI security and red-team engineering project.

## License

MIT. See [LICENSE](LICENSE).
