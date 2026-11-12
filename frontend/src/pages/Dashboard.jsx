import { Link } from "react-router-dom";
import { TRACKS, liveLessons } from "../data/curriculum";
import { TASKS } from "../data/lab";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Dashboard() {
  useTitle("Dashboard");
  const { user, seen, done, attempts } = useAcademy();
  const live = liveLessons()[0];
  const passed = new Set(attempts.filter((item) => item.passed).map((item) => item.taskId));
  const name = user?.name || "Learner";

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Progress</p>
        <h1>{name}&rsquo;s desk</h1>
        <p className="lede">
          Opened modules, the live lesson, and lab passes stay on this device
          {user?.token ? ", and signed-in submissions also reach the academy server." : "."}
        </p>
      </header>

      <section className="dash-grid">
        <article className="panel focus">
          <p className="kicker">Continue</p>
          <h2>{done[`${live.track.slug}-${live.n}`] ? "SQL lab" : live.mod.title}</h2>
          <p className="muted">
            {done[`${live.track.slug}-${live.n}`]
              ? `${passed.size} of ${TASKS.length} lab tasks passed.`
              : "The only published lesson. Mark it complete after the three checks make sense."}
          </p>
          <Link
            className="btn btn-gold"
            to={done[`${live.track.slug}-${live.n}`] ? "/lab" : `/learn/${live.track.slug}/${live.n}`}
          >
            {done[`${live.track.slug}-${live.n}`] ? "Return to the lab" : "Resume the lesson"}
          </Link>
        </article>
        <article className="panel score">
          <p className="kicker">Lab</p>
          <p className="big-num">
            {passed.size}
            <small>/{TASKS.length}</small>
          </p>
          <ul className="check-list">
            {TASKS.map((task) => (
              <li key={task.id} className={passed.has(task.id) ? "yes" : ""}>
                {task.title}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="track-meters">
        {TRACKS.map((track) => {
          const opened = track.modules.filter((_, index) => seen[`${track.slug}-${index + 1}`]).length;
          const width = Math.round((opened / track.modules.length) * 100);
          return (
            <Link key={track.slug} to={`/tracks/${track.slug}`} className="meter" data-accent={track.accent}>
              <div>
                <strong>{track.title}</strong>
                <span>
                  {opened} / {track.modules.length} opened
                </span>
              </div>
              <div className="bar">
                <i style={{ width: `${width}%` }} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="panel">
        <p className="kicker">Recent submissions</p>
        {attempts.length ? (
          <ul className="attempt-list">
            {attempts.slice(0, 6).map((attempt, index) => (
              <li key={attempt.at + index}>
                <strong>{attempt.title}</strong>
                <span className={attempt.passed ? "badge badge-live" : "badge badge-soon"}>
                  {attempt.passed ? "Passed" : "Retry"}
                </span>
                <em>{attempt.source}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            No submissions yet. <Link to="/lab">The lab is open.</Link>
          </p>
        )}
      </section>
    </div>
  );
}
