import { Link, Navigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useAcademy } from "../context/AcademyContext";
import { getTrack } from "../data/curriculum";
import { TASKS } from "../data/lab";
import { useTitle } from "../hooks/useTitle";

export default function Dashboard() {
  const { activeCourse, user, seen, done, attempts } = useAcademy();
  const track = getTrack(activeCourse);
  useTitle(track ? `${track.title} progress` : "Choose a course");

  if (!track) return <Navigate to="/tracks" replace />;

  const completed = track.modules.filter((_, index) => done[`${track.slug}-${index + 1}`]).length;
  const opened = track.modules.filter((_, index) => seen[`${track.slug}-${index + 1}`]).length;
  const unfinishedIndex = track.modules.findIndex((_, index) => !done[`${track.slug}-${index + 1}`]);
  const nextIndex = unfinishedIndex < 0 ? track.modules.length - 1 : unfinishedIndex;
  const nextModule = track.modules[nextIndex];
  const nextIsLiveAndDone = nextModule?.status === "live" && done[`${track.slug}-${nextIndex + 1}`];
  const passed = new Set(attempts.filter((item) => item.passed).map((item) => item.taskId));
  const name = user?.name || "Learner";

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">{track.title} · Personal progress</p>
        <h1>{name}&rsquo;s learning desk</h1>
        <p className="lede">
          This dashboard shows progress for your selected course only. Your progress is saved in this browser.
        </p>
      </header>

      <section className="dash-grid">
        <article className="panel focus">
          <p className="kicker"><Icon name="course" size={16} />{completed === track.modules.length ? "Course roadmap" : "Recommended next"}</p>
          <h2>{nextIsLiveAndDone ? "SQL practice lab" : nextModule?.title || track.title}</h2>
          <p className="muted">
            {completed === track.modules.length
              ? "You have marked every module complete. Review your roadmap or keep practicing."
              : nextModule?.points?.[0] || `Continue your ${track.title} roadmap.`}
          </p>
          <Link
            className="btn btn-gold"
            to={completed === track.modules.length ? `/tracks/${track.slug}` : nextIsLiveAndDone ? "/lab" : `/learn/${track.slug}/${nextIndex + 1}`}
          >
            {completed === track.modules.length ? "Review my roadmap" : nextIsLiveAndDone ? "Return to SQL lab" : "Continue learning"}
          </Link>
        </article>
        <article className="panel score">
          <p className="kicker"><Icon name="progress" size={16} />Course completion</p>
          <p className="big-num">{completed}<small>/{track.modules.length}</small></p>
          <p className="muted">{opened} modules opened</p>
          <div className="bar" role="progressbar" aria-label={`${track.title} completion`} aria-valuenow={completed} aria-valuemin={0} aria-valuemax={track.modules.length}>
            <i style={{ width: `${track.modules.length ? Math.round((completed / track.modules.length) * 100) : 0}%` }} />
          </div>
        </article>
      </section>

      {track.slug === "data-analytics" && (
        <section className="panel dashboard-course-tools">
          <p className="kicker"><Icon name="lab" size={16} />SQL lab · this course</p>
          <h2>{passed.size} of {TASKS.length} tasks passed</h2>
          <ul className="check-list">
            {TASKS.map((task) => (
              <li key={task.id} className={passed.has(task.id) ? "yes" : ""}>{task.title}</li>
            ))}
          </ul>
          <Link to="/lab" className="text-btn">Open the SQL lab</Link>
        </section>
      )}

      <section className="track-meters">
        <Link to={`/tracks/${track.slug}`} className="meter" data-accent={track.accent}>
          <div><strong>{track.title} roadmap</strong><span>{opened} / {track.modules.length} opened</span></div>
          <div className="bar"><i style={{ width: `${track.modules.length ? Math.round((opened / track.modules.length) * 100) : 0}%` }} /></div>
        </Link>
      </section>

      {track.slug === "data-analytics" && (
        <section className="panel">
          <p className="kicker">Recent SQL submissions</p>
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
            <p className="muted">No submissions yet. <Link to="/lab">Try your first SQL task.</Link></p>
          )}
        </section>
      )}
      <div className="dashboard-switch">
        <span className="muted">Want to focus on a different path?</span>
        <Link to="/tracks" className="text-btn">Switch course</Link>
      </div>
    </div>
  );
}
