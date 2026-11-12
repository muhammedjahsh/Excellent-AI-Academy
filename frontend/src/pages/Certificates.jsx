import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TRACKS } from "../data/curriculum";
import { TASKS } from "../data/lab";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";
import * as api from "../lib/api";

export default function Certificates() {
  useTitle("Records");
  const { done, attempts, online } = useAcademy();
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const passed = new Set(attempts.filter((item) => item.passed).map((item) => item.taskId));

  const summary = useMemo(() => {
    return TRACKS.map((track) => {
      const waiting = track.modules.filter((mod) => mod.status !== "live").length;
      const liveDone = track.modules.every((mod, index) => mod.status !== "live" || done[`${track.slug}-${index + 1}`]);
      return { track, waiting, liveDone };
    });
  }, [done]);

  async function verify(event) {
    event.preventDefault();
    setError("");
    setLookup(null);
    setPending(true);
    try {
      const record = await api.verifyCertificate(code.trim());
      setLookup(record);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Records</p>
        <h1>Completion stays closed until the work exists.</h1>
        <p className="lede">
          A certificate from this academy is a course completion record. It is a school credential, separate from a university degree or an outside certification.
        </p>
      </header>

      <div className="cert-grid">
        <section className="stack">
          {summary.map(({ track, waiting, liveDone }) => (
            <article key={track.slug} className="panel" data-accent={track.accent}>
              <div className="track-block-head">
                <h2>{track.title}</h2>
                <span className="badge badge-soon">Not eligible</span>
              </div>
              <ul className="check-list">
                <li className={liveDone ? "yes" : ""}>
                  {track.slug === "data-analytics"
                    ? "SQL fundamentals marked complete"
                    : "No live assessment on this track yet"}
                </li>
                {track.slug === "data-analytics" && (
                  <li className={passed.size === TASKS.length ? "yes" : ""}>
                    Lab tasks passed ({passed.size}/{TASKS.length})
                  </li>
                )}
                <li>{waiting} modules still in production</li>
                <li>Capstone, final interview, and final assessment are mapped</li>
              </ul>
            </article>
          ))}
        </section>
        <aside className="panel verify">
          <p className="kicker">Public verify</p>
          <h2>Look up a record</h2>
          <p className="muted">
            {online
              ? "The academy server can confirm an issued id."
              : "Start the academy server to verify an issued id."}
          </p>
          <form onSubmit={verify} className="stack-form">
            <label className="field">
              <span>Certificate id</span>
              <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="DV-…" />
            </label>
            <button className="btn btn-gold" type="submit" disabled={pending || !code.trim()}>
              {pending ? "Checking…" : "Verify"}
            </button>
          </form>
          {error && <p className="fail-text">{error}</p>}
          {lookup && (
            <div className="record">
              <p className="kicker">Confirmed</p>
              <h3>{lookup.name}</h3>
              <p>{lookup.track}</p>
              <p className="muted">{lookup.certificate_id}</p>
              <p>{lookup.type}</p>
            </div>
          )}
          <Link to="/agents?agent=herald" className="text-btn">
            Ask Herald what is still open
          </Link>
        </aside>
      </div>
    </div>
  );
}
