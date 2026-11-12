import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Lesson() {
  const { slug, module } = useParams();
  const track = getTrack(slug);
  const n = Number(module);
  const mod = track?.modules[n - 1];
  const { see, complete, done } = useAcademy();
  const id = `${slug}-${n}`;
  useTitle(mod ? mod.title : "Lesson");

  useEffect(() => {
    if (mod) see(id);
  }, [id, mod, see]);

  if (!track || !mod) {
    return (
      <div className="page">
        <h1>This lesson is not on the map.</h1>
        <Link to="/tracks">Back to tracks</Link>
      </div>
    );
  }

  const lesson = mod.lesson;

  return (
    <div className="page lesson">
      <p className="crumbs">
        <Link to="/tracks">Tracks</Link>
        <span>/</span>
        <Link to={`/tracks/${track.slug}`}>{track.title}</Link>
        <span>/</span>
        Module {n}
      </p>
      <header className="page-head">
        <p className="eyebrow">Module {String(n).padStart(2, "0")}</p>
        <h1>{lesson?.title || mod.title}</h1>
        <p>
          <span className={mod.status === "live" ? "badge badge-live" : "badge badge-soon"}>
            {mod.status === "live" ? "Live lesson" : "Mapped"}
          </span>
        </p>
      </header>

      {lesson ? (
        <div className="lesson-grid">
          <article className="reading">
            {lesson.sections.map((section) => (
              <section key={section.h}>
                <h2>{section.h}</h2>
                <p>{section.t}</p>
              </section>
            ))}
            <h2>Sources</h2>
            <ul className="sources">
              {lesson.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>
          <aside className="panel lesson-side">
            <p className="kicker">Practice</p>
            <h2>Three graded tasks use this lesson.</h2>
            <p className="muted">The lab shows the customers and orders tables. Quill will hint. The grader checks rows.</p>
            <Link to="/lab" className="btn btn-gold">
              Open the SQL lab
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => complete(id)}
              disabled={Boolean(done[id])}
            >
              {done[id] ? "Lesson marked complete" : "Mark lesson complete"}
            </button>
            <Link to="/agents?agent=mira" className="text-btn">
              Ask Mira to reteach it
            </Link>
          </aside>
        </div>
      ) : (
        <div className="lesson-grid">
          <article className="panel planned">
            <h2>This room is reserved.</h2>
            <p>
              {mod.title} is part of {track.title}. The outline is set so you can see the shape of the path. The lesson text, exercises, and checks are still in production.
            </p>
            <ul className="points">
              {mod.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
          <aside className="panel lesson-side">
            <p className="kicker">Meanwhile</p>
            <h2>The live classroom is SQL fundamentals.</h2>
            <Link to="/learn/data-analytics/4" className="btn btn-gold">
              Go to the live lesson
            </Link>
            <Link to="/agents?agent=atlas" className="btn btn-ghost">
              Ask Atlas for a path
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
