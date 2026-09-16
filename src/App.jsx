import { useMemo, useState } from 'react';
import catalog from './data/catalog.json';

const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };

function Section({ title, children }) {
  return (
    <section className="detail-section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function List({ items }) {
  return <ul className="detail-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function TechniqueCard({ technique }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');

  async function copy(text, id) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(''), 1300);
  }

  return (
    <article className={`technique-card ${open ? 'open' : ''}`}>
      <button className="technique-summary" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div>
          <div className="eyebrow">{technique.category}</div>
          <h3>{technique.title}</h3>
          <p>{technique.summary}</p>
        </div>
        <div className="technique-meta">
          <span className={`severity ${technique.severity.toLowerCase()}`}>{technique.severity}</span>
          <span className="expand">{open ? '−' : '+'}</span>
        </div>
      </button>

      {open && (
        <div className="technique-details">
          <div className="mapping-row">
            {technique.owasp.map((x) => <span className="pill" key={x}>{x}</span>)}
            {technique.atlas.map((x) => <span className="pill muted" key={x}>{x}</span>)}
          </div>

          <div className="detail-grid two-col">
            <Section title="Why it matters"><p>{technique.whyItMatters}</p></Section>
            <Section title="Expected secure behavior"><p>{technique.expectedSecureBehavior}</p></Section>
          </div>

          <div className="detail-grid two-col">
            <Section title="Preconditions"><List items={technique.preconditions} /></Section>
            <Section title="Attack path"><ol className="detail-list ordered">{technique.attackPath.map((x) => <li key={x}>{x}</li>)}</ol></Section>
          </div>

          <Section title="Variants">
            <div className="chip-row">{technique.variants.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
          </Section>

          <Section title="Lab-safe test cases">
            <div className="payload-grid">
              {technique.safePayloads.map((item, i) => {
                const id = `${technique.id}-${i}`;
                return (
                  <div className="payload-card" key={id}>
                    <div className="payload-head">
                      <strong>{item.name}</strong>
                      <button onClick={() => copy(item.payload, id)}>{copied === id ? 'Copied' : 'Copy'}</button>
                    </div>
                    <pre>{item.payload}</pre>
                    <p>{item.objective}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          <div className="detail-grid three-col">
            <Section title="Success criteria"><List items={technique.successCriteria} /></Section>
            <Section title="Telemetry to capture"><List items={technique.telemetry} /></Section>
            <Section title="False-positive traps"><List items={technique.falsePositives} /></Section>
          </div>

          <Section title="Defensive controls"><List items={technique.mitigations} /></Section>
        </div>
      )}
    </article>
  );
}

function Methodology() {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('promptstrike-progress') || '{}'); }
    catch { return {}; }
  });

  function toggle(key) {
    const next = { ...progress, [key]: !progress[key] };
    setProgress(next);
    localStorage.setItem('promptstrike-progress', JSON.stringify(next));
  }

  const total = catalog.phases.reduce((n, p) => n + p.checks.length, 0);
  const complete = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((complete / total) * 100);

  return (
    <div>
      <div className="progress-panel">
        <div><span className="eyebrow">Assessment progress</span><strong>{pct}%</strong></div>
        <div className="progress-track"><div style={{ width: `${pct}%` }} /></div>
        <span>{complete}/{total} checks complete. State is saved locally in your browser.</span>
      </div>
      <div className="phase-grid">
        {catalog.phases.map((phase) => (
          <article className="phase-card" key={phase.id}>
            <span className="phase-number">PHASE {phase.number}</span>
            <h3>{phase.title}</h3>
            <p>{phase.description}</p>
            <div className="check-list">
              {phase.checks.map((check, i) => {
                const key = `${phase.id}-${i}`;
                return (
                  <label key={key} className={progress[key] ? 'checked' : ''}>
                    <input type="checkbox" checked={Boolean(progress[key])} onChange={() => toggle(key)} />
                    <span>{check}</span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TechniqueLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');
  const categories = ['All', ...new Set(catalog.techniques.map((x) => x.category))];

  const filtered = useMemo(() => catalog.techniques
    .filter((x) => category === 'All' || x.category === category)
    .filter((x) => severity === 'All' || x.severity === severity)
    .filter((x) => {
      const haystack = JSON.stringify(x).toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]), [query, category, severity]);

  return (
    <div>
      <div className="filters">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search technique, OWASP mapping, mitigation, telemetry..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>{['All', 'Critical', 'High', 'Medium', 'Low'].map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="result-count">{filtered.length} techniques</div>
      <div className="technique-list">{filtered.map((x) => <TechniqueCard technique={x} key={x.id} />)}</div>
    </div>
  );
}

function AttackChains() {
  return (
    <div className="chain-grid">
      {catalog.attackChains.map((chain) => (
        <article className="chain-card" key={chain.name}>
          <div className="eyebrow">Attack chain</div>
          <h3>{chain.name}</h3>
          <ol className="chain-steps">{chain.steps.map((x) => <li key={x}>{x}</li>)}</ol>
          <div className="breakpoints">
            <h4>Defensive breakpoints</h4>
            <List items={chain.breakpoints} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Tools() {
  return (
    <div className="framework-grid">
      {catalog.tools.map((tool) => (
        <a href={tool.url} target="_blank" rel="noreferrer" className="framework-card" key={tool.name}>
          <span className="eyebrow">Tool</span>
          <h3>{tool.name}</h3>
          <p><strong>Best for:</strong> {tool.bestFor}</p>
          <p><strong>PromptStrike fit:</strong> {tool.howPromptStrikeUsesIt}</p>
          <span className="link-label">Open project ↗</span>
        </a>
      ))}
    </div>
  );
}

function Frameworks() {
  return (
    <div className="framework-grid">
      {catalog.frameworks.map((fw) => (
        <a href={fw.url} target="_blank" rel="noreferrer" className="framework-card" key={fw.name}>
          <span className="eyebrow">Reference</span>
          <h3>{fw.name}</h3>
          <p>{fw.note}</p>
          <span className="link-label">Open source ↗</span>
        </a>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('techniques');
  const critical = catalog.techniques.filter((x) => x.severity === 'Critical').length;
  const tabs = [
    ['techniques', 'Technique Library'],
    ['methodology', 'Methodology'],
    ['chains', 'Attack Chains'],
    ['tools', 'Tools'],
    ['frameworks', 'Frameworks'],
  ];

  return (
    <main>
      <header className="hero">
        <div className="hero-copy">
          <div className="brand-line"><span className="brand-mark">PS</span><span>PromptStrike</span><span className="version">v2.0</span></div>
          <h1>AI red team workbench for testing how trust breaks.</h1>
          <p>Interactive methodology, attack knowledge base, lab-safe payloads, evidence guidance, telemetry, and defensive controls mapped to modern AI security frameworks.</p>
          <div className="hero-note">For authorized security testing and controlled lab environments. Payloads are intentionally non-destructive canaries.</div>
        </div>
        <div className="stats">
          <div><strong>{catalog.techniques.length}</strong><span>techniques</span></div>
          <div><strong>{critical}</strong><span>critical paths</span></div>
          <div><strong>10/10</strong><span>OWASP LLM coverage</span></div>
          <div><strong>{catalog.phases.length}</strong><span>assessment phases</span></div>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(([key, label]) => <button key={key} onClick={() => setView(key)} className={view === key ? 'active' : ''}>{label}</button>)}
      </nav>

      <section className="content">
        {view === 'techniques' && <TechniqueLibrary />}
        {view === 'methodology' && <Methodology />}
        {view === 'chains' && <AttackChains />}
        {view === 'tools' && <Tools />}
        {view === 'frameworks' && <Frameworks />}
      </section>

      <footer>
        <strong>PromptStrike</strong>
        <span>Built as a practical AI red-team methodology, not a one-click exploitation framework.</span>
        <a href="https://github.com/LautrecSec" target="_blank" rel="noreferrer">Simon Kudla / LautrecSec ↗</a>
      </footer>
    </main>
  );
}
