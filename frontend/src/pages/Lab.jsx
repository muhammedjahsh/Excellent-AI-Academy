import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import { TABLES, TASKS } from "../data/lab";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";
import * as api from "../lib/api";

async function studio() {
  return import("../lib/grader");
}

export default function Lab() {
  useTitle("SQL lab");
  const { user, addAttempt, online } = useAcademy();
  const [params, setParams] = useSearchParams();
  const taskId = TASKS.some((task) => task.id === params.get("task")) ? params.get("task") : TASKS[0].id;
  const task = TASKS.find((item) => item.id === taskId);
  const [query, setQuery] = useState("SELECT * FROM customers");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);

  const schema = useMemo(() => TABLES, []);

  function selectTask(id) {
    setParams({ task: id });
    setResult(null);
    setPreview(null);
  }

  async function run() {
    const { runQuery } = await studio();
    setPreview(runQuery(query));
    setResult(null);
  }

  async function submit() {
    setPending(true);
    try {
      let graded;
      let source = "Local studio";
      if (user?.token && online) {
        try {
          graded = await api.submitSql(user.token, task.id, query);
          source = "Academy server";
        } catch (error) {
          if (!error.network) {
            setResult({ passed: false, score: 0, feedback: error.message, source: "Academy server" });
            setPreview(runQuery(query));
            return;
          }
          const { gradeQuery } = await studio();
          graded = gradeQuery(task.id, query);
        }
      } else {
        const { gradeQuery } = await studio();
        graded = gradeQuery(task.id, query);
      }
      const record = {
        taskId: task.id,
        title: task.title,
        passed: graded.passed,
        score: graded.score,
        feedback: graded.feedback,
        source,
        at: new Date().toISOString(),
      };
      const { runQuery } = await studio();
      setResult(record);
      setPreview(runQuery(query));
      addAttempt(record);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page lab">
      <header className="page-head">
        <p className="eyebrow">Data Analytics · Module 04</p>
        <h1>SQL lab</h1>
        <p className="lede">
          Run a query to see rows. Submit it to grade. A signed-in session stores the attempt on the academy server when it is live. The browser grader is there so the lab still works on this machine.
        </p>
      </header>

      <div className="lab-layout">
        <section className="panel">
          <div className="task-switch">
            {TASKS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === task.id ? "on" : ""}
                onClick={() => selectTask(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <h2>{task.prompt}</h2>
          <label className="field">
            <span>Query</span>
            <textarea
              value={query}
              spellCheck="false"
              rows={8}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") submit();
              }}
            />
          </label>
          <div className="hero-actions">
            <button type="button" className="btn btn-ghost" onClick={run}>
              Run
            </button>
            <button type="button" className="btn btn-gold" onClick={submit} disabled={pending}>
              {pending ? "Grading…" : "Submit"}
            </button>
            <span className="muted hint-key">Ctrl Enter submits</span>
          </div>
          {preview && (
            <div className="result-block">
              <p className="kicker">Your result</p>
              {preview.ok ? (
                <DataTable columns={preview.columns} rows={preview.rows} />
              ) : (
                <p className="fail-text">{preview.error}</p>
              )}
            </div>
          )}
          {result && (
            <div className={result.passed ? "verdict pass" : "verdict fail"}>
              <strong>{result.passed ? "Passed" : "Not yet"}</strong>
              <span>{result.score} / 100 · {result.source}</span>
              <p>{result.feedback}</p>
            </div>
          )}
        </section>
        <aside className="schema">
          <p className="kicker">Schema you can see</p>
          {Object.entries(schema).map(([name, rows]) => (
            <div key={name} className="panel tight">
              <h3>{name}</h3>
              <DataTable rows={rows} />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
