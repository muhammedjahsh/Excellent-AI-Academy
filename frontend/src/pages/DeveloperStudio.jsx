import { useEffect, useRef, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { reviewSource } from "../lib/sourceReview";
import { reviewWorkflow } from "../lib/workflowReview";

const STORAGE_KEY = "excellent-academy-developer-studio";
const DEFAULTS = {
  python: `# Try changing the values and run this program.\nprices = [12.5, 8.0, 19.5]\ntotal = sum(prices)\nprint(f"Items: {len(prices)}")\nresult = round(total, 2)`,
  source: `def average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)\n\nprint(average([4, 8, 12]))`,
  workflow: `name: Python checks\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\npermissions:\n  contents: read\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \"3.12\"\n      - run: python -m pytest`,
};
const TABS = [
  { id: "python", label: "Python runner" },
  { id: "source", label: "Source review" },
  { id: "workflow", label: "Actions inspector" },
];

function loadDrafts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries(
      Object.keys(DEFAULTS).map((key) => [
        key,
        typeof saved[key] === "string" ? saved[key] : DEFAULTS[key],
      ]),
    );
  } catch {
    return DEFAULTS;
  }
}

function Findings({ items }) {
  if (!items.length) {
    return <p className="studio-empty">No quick-check findings. Keep reviewing changes before shipping.</p>;
  }
  return (
    <ul className="finding-list">
      {items.map((item, index) => (
        <li key={`${item.title}-${item.line || "all"}-${index}`} data-severity={item.severity}>
          <div>
            <strong>{item.title}</strong>
            {item.line && <span className="finding-line">Line {item.line}</span>}
          </div>
          <p>{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}

export default function DeveloperStudio() {
  useTitle("Developer studio");
  const [drafts, setDrafts] = useState(loadDrafts);
  const [active, setActive] = useState("python");
  const [language, setLanguage] = useState("python");
  const [pythonOutput, setPythonOutput] = useState("");
  const [pythonState, setPythonState] = useState("ready");
  const [sourceFindings, setSourceFindings] = useState(null);
  const [workflowFindings, setWorkflowFindings] = useState(null);
  const [notice, setNotice] = useState("");
  const workerRef = useRef(null);
  const requestRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      setNotice("");
    } catch {
      setNotice("Browser storage is unavailable; drafts will not persist after closing this page.");
    }
  }, [drafts]);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
      workerRef.current?.terminate();
    },
    [],
  );

  function updateDraft(key, value) {
    setDrafts((current) => ({ ...current, [key]: value }));
  }

  function startPythonWorker() {
    const worker = new Worker(new URL("../lib/pythonWorker.js", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event) => {
      const message = event.data;
      if (message.id !== requestRef.current) return;
      if (message.type === "ready") {
        setPythonState("running");
        timerRef.current = window.setTimeout(() => {
          worker.terminate();
          workerRef.current = null;
          setPythonState("error");
          setPythonOutput("Execution exceeded 10 seconds. The browser worker was stopped.");
        }, 10_000);
      } else {
        window.clearTimeout(timerRef.current);
        setPythonState(message.type === "error" ? "error" : "ready");
        setPythonOutput(message.type === "error" ? message.message : message.output || "(no output)");
      }
    };
    worker.onerror = (event) => {
      window.clearTimeout(timerRef.current);
      worker.terminate();
      workerRef.current = null;
      setPythonState("error");
      setPythonOutput(`Python worker failed to start: ${event.message || "unknown worker error"}`);
    };
    return worker;
  }

  function runPython() {
    if (!drafts.python.trim()) {
      setPythonState("error");
      setPythonOutput("Write a Python program before running it.");
      return;
    }
    if (drafts.python.length > 20_000) {
      setPythonState("error");
      setPythonOutput("This playground accepts programs up to 20,000 characters.");
      return;
    }
    window.clearTimeout(timerRef.current);
    const id = requestRef.current + 1;
    requestRef.current = id;
    setPythonState("loading");
    setPythonOutput("Starting the browser-based Python runtime…");
    const worker = workerRef.current || startPythonWorker();
    timerRef.current = window.setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setPythonState("error");
      setPythonOutput("The runtime took too long to start. Check your connection and try again.");
    }, 60_000);
    worker.postMessage({ id, source: drafts.python });
  }

  function resetActive() {
    updateDraft(active, DEFAULTS[active]);
    if (active === "python") {
      setPythonOutput("");
      setPythonState("ready");
    } else if (active === "source") {
      setSourceFindings(null);
    } else {
      setWorkflowFindings(null);
    }
  }

  function runSourceReview() {
    if (drafts.source.length > 50_000) {
      setSourceFindings([{
        severity: "high",
        title: "Source is too large",
        detail: "Review snippets up to 50,000 characters.",
      }]);
      return;
    }
    setSourceFindings(reviewSource(drafts.source, language));
  }

  function runWorkflowReview() {
    if (drafts.workflow.length > 50_000) {
      setWorkflowFindings([{
        severity: "high",
        title: "Workflow is too large",
        detail: "Inspect workflow snippets up to 50,000 characters.",
      }]);
      return;
    }
    setWorkflowFindings(reviewWorkflow(drafts.workflow));
  }

  return (
    <div className="page developer-page">
      <header className="page-head">
        <p className="eyebrow">Build · inspect · improve</p>
        <h1>Developer studio</h1>
        <p className="lede">
          Practice Python, get quick source feedback, and inspect GitHub Actions workflows—all in your browser.
        </p>
      </header>

      <div className="studio-notice">
        <strong>Browser-only workspace</strong>
        <span>
          Code runs in a temporary Web Worker, never on the academy server. The Python runtime loads from jsDelivr;
          use this for trusted learning snippets, not as a security sandbox.
        </span>
      </div>
      {notice && <p className="studio-storage-note" role="status">{notice}</p>}

      <div className="studio-tabs" role="tablist" aria-label="Developer tools">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={active === tab.id ? "on" : ""}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="btn btn-ghost btn-small studio-reset" onClick={resetActive}>
          Reset example
        </button>
      </div>

      {active === "python" && (
        <section className="studio-workbench" role="tabpanel" id="panel-python" aria-labelledby="tab-python">
          <div className="studio-editor panel">
            <div className="studio-editor-head">
              <div>
                <p className="kicker">Python · Pyodide {pythonState === "loading" ? "· loading" : ""}</p>
                <p className="muted">Print output or assign a value to <code>result</code>.</p>
              </div>
              <button type="button" className="btn btn-gold btn-small" onClick={runPython} disabled={pythonState === "loading" || pythonState === "running"}>
                {pythonState === "loading" ? "Loading…" : pythonState === "running" ? "Running…" : "Run Python"}
              </button>
            </div>
            <label className="sr-only" htmlFor="python-source">Python code</label>
            <textarea
              id="python-source"
              className="code-editor"
              value={drafts.python}
              spellCheck="false"
              onChange={(event) => updateDraft("python", event.target.value)}
            />
            <div className="console-panel">
              <div className="console-heading"><span>Console output</span><span>{pythonState}</span></div>
              <pre aria-live="polite">{pythonOutput || "Run your code to see output here."}</pre>
            </div>
          </div>
          <aside className="panel studio-guide">
            <p className="kicker">Good next steps</p>
            <h2>Make it yours</h2>
            <ul className="points">
              <li>Write a function and test it with a few inputs.</li>
              <li>Explore lists, dictionaries, and comprehensions.</li>
              <li>Use <code>print()</code> or assign a final <code>result</code>.</li>
            </ul>
            <p className="muted">Drafts autosave in this browser. Each run is stopped after 10 seconds.</p>
          </aside>
        </section>
      )}

      {active === "source" && (
        <section className="studio-workbench" role="tabpanel" id="panel-source" aria-labelledby="tab-source">
          <div className="studio-editor panel">
            <div className="studio-editor-head">
              <div>
                <p className="kicker">Quick source review</p>
                <p className="muted">Small, local heuristics for common cleanup opportunities.</p>
              </div>
              <label className="field studio-language">
                <span>Language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </label>
            </div>
            <label className="sr-only" htmlFor="source-review-input">Source code to review</label>
            <textarea
              id="source-review-input"
              className="code-editor"
              value={drafts.source}
              spellCheck="false"
              onChange={(event) => updateDraft("source", event.target.value)}
            />
            <div className="hero-actions">
              <button type="button" className="btn btn-gold btn-small" onClick={runSourceReview}>
                Review source
              </button>
              <span className="muted hint-key">Up to 50,000 characters</span>
            </div>
            {sourceFindings && <Findings items={sourceFindings} />}
          </div>
          <aside className="panel studio-guide">
            <p className="kicker">What it checks</p>
            <h2>Fast feedback, not a verdict</h2>
            <p className="muted">Looks for long lines, debug statements, TODOs, possible hard-coded credentials, and a few language-specific patterns.</p>
            <p className="muted">This is not a compiler, linter, or complete security review. Verify findings in your normal toolchain.</p>
          </aside>
        </section>
      )}

      {active === "workflow" && (
        <section className="studio-workbench" role="tabpanel" id="panel-workflow" aria-labelledby="tab-workflow">
          <div className="studio-editor panel">
            <div className="studio-editor-head">
              <div>
                <p className="kicker">GitHub Actions workflow inspector</p>
                <p className="muted">Paste a workflow or start with the checked-in example.</p>
              </div>
              <button type="button" className="btn btn-gold btn-small" onClick={runWorkflowReview}>
                Inspect workflow
              </button>
            </div>
            <label className="sr-only" htmlFor="workflow-input">GitHub Actions YAML workflow</label>
            <textarea
              id="workflow-input"
              className="code-editor"
              value={drafts.workflow}
              spellCheck="false"
              onChange={(event) => updateDraft("workflow", event.target.value)}
            />
            {workflowFindings && <Findings items={workflowFindings} />}
          </div>
          <aside className="panel studio-guide">
            <p className="kicker">CI/CD checklist</p>
            <h2>Ship with care</h2>
            <ul className="points">
              <li>Declare minimum token permissions.</li>
              <li>Pin third-party actions to a reviewed commit SHA.</li>
              <li>Never expose secrets to untrusted pull-request code.</li>
              <li>Run your real YAML and CI checks before merging.</li>
            </ul>
            <p className="muted">This inspector never connects to GitHub or reads repository secrets.</p>
          </aside>
        </section>
      )}
    </div>
  );
}
