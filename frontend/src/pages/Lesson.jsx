import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CourseCoach from "../components/CourseCoach";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Lesson() {
  const { slug, module } = useParams();
  const track = getTrack(slug);
  const n = Number(module);
  const mod = track?.modules[n - 1];
  const { activeCourse, see, complete, done } = useAcademy();
  const activeTrack = getTrack(activeCourse);
  const id = `${slug}-${n}`;
  useTitle(track?.slug === activeCourse && mod ? mod.title : activeTrack?.title || "Choose a course");

  useEffect(() => {
    if (mod && slug === activeCourse) see(id);
  }, [activeCourse, id, mod, see, slug]);

  if (!activeCourse) return <Navigate to="/tracks" replace />;

  if (slug !== activeCourse) {
    return (
      <div className="page">
        <p className="eyebrow">Course access</p>
        <h1>This workspace is focused on your selected course.</h1>
        <p className="lede">Switch courses from your learning space before opening another course’s modules.</p>
        <div className="hero-actions">
          <Link className="btn btn-gold" to={`/tracks/${activeCourse}`}>Open my course</Link>
          <Link className="btn btn-ghost" to="/tracks">Switch course</Link>
        </div>
      </div>
    );
  }

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
      {track.assistant && <CourseCoach track={track} currentModule={mod} />}

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
            <Link to="/agents" className="text-btn">
              Ask {track.assistant.name} to reteach it
            </Link>
            {mod.tools?.length > 0 && (
              <>
                <h3>Tools in this module</h3>
                <div className="tool-tags">
                  {mod.tools.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
              </>
            )}
            {mod.chapters?.length > 0 && (
              <details className="chapter-disclosure lesson-chapters">
                <summary>View all {mod.chapters.length} chapter outlines</summary>
                <ol className="chapter-list">
                  {mod.chapters.map((chapter, index) => (
                    <li key={chapter.title} className={chapter.level === "advanced" ? "advanced" : ""}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{chapter.title}</span>
                      {chapter.level === "advanced" && <em>Advanced</em>}
                    </li>
                  ))}
                </ol>
              </details>
            )}
            {mod.project && <p className="project-note"><strong>Applied project:</strong> {mod.project}</p>}
          </aside>
        </div>
      ) : (
        <div className="lesson-grid">
          <article className="panel planned">
            <h2>Module roadmap</h2>
            <p>
              {mod.title} is part of {track.title}. This roadmap includes the tools and chapter sequence; full lesson text, exercises, and graded checks are still in production.
            </p>
            {mod.tools?.length > 0 && (
              <>
                <h3>Tools covered</h3>
                <div className="tool-tags">
                  {mod.tools.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
              </>
            )}
            <ul className="points">
              {mod.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {mod.chapters?.length > 0 && (
              <>
                <h3>Chapter outline</h3>
                <ol className="chapter-list">
                  {mod.chapters.map((chapter, index) => (
                    <li key={chapter.title} className={chapter.level === "advanced" ? "advanced" : ""}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{chapter.title}</span>
                      {chapter.level === "advanced" && <em>Advanced</em>}
                    </li>
                  ))}
                </ol>
              </>
            )}
            {mod.project && <p className="project-note"><strong>Applied project:</strong> {mod.project}</p>}
            {mod.challenge && <p className="project-note"><strong>Skills challenge:</strong> {mod.challenge}</p>}
          </article>
          <aside className="panel lesson-side">
            <p className="kicker">Your next step</p>
            <h2>Continue with your selected course.</h2>
            {mod.hours && <p><strong>Estimated effort:</strong> about {mod.hours} hours</p>}
            <Link to={`/tracks/${track.slug}`} className="btn btn-gold">
              Return to my roadmap
            </Link>
            <Link to="/agents" className="btn btn-ghost">
              Ask {track.assistant.name} for help
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
