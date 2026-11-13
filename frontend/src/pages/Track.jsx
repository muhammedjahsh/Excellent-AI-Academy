import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CourseCoach from "../components/CourseCoach";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Track() {
  const { slug } = useParams();
  const track = getTrack(slug);
  const { activeCourse, done, seen } = useAcademy();
  const activeTrack = getTrack(activeCourse);
  const [query, setQuery] = useState("");
  useTitle(track?.slug === activeCourse ? track.title : activeTrack?.title || "Choose a course");

  const modules = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (track?.modules || [])
      .map((mod, index) => ({ ...mod, n: index + 1 }))
      .filter((mod) => {
        const searchable = [
          mod.title,
          ...(mod.tools || []),
          ...(mod.chapters || []).map((chapter) => chapter.title),
          mod.project,
          mod.challenge,
        ].join(" ").toLowerCase();
        return !needle || searchable.includes(needle);
      });
  }, [query, track]);

  if (!activeCourse) return <Navigate to="/tracks" replace />;

  if (!track) {
    return (
      <div className="page">
        <h1>That course is not on the map.</h1>
        <Link to="/tracks">Back to courses</Link>
      </div>
    );
  }

  if (track.slug !== activeCourse) {
    return (
      <div className="page">
        <p className="eyebrow">Course access</p>
        <h1>This workspace is focused on your selected course.</h1>
        <p className="lede">To keep your learning space focused, open your selected course or switch courses first.</p>
        <div className="hero-actions">
          <Link className="btn btn-gold" to={`/tracks/${activeCourse}`}>Open my course</Link>
          <Link className="btn btn-ghost" to="/tracks">Switch course</Link>
        </div>
      </div>
    );
  }

  const completed = track.modules.filter((_, index) => done[`${track.slug}-${index + 1}`]).length;
  const chapterCount = track.modules.reduce((count, mod) => count + (mod.chapters?.length || 0), 0);
  const advancedCount = track.modules.reduce(
    (count, mod) => count + (mod.chapters?.filter((chapter) => chapter.level === "advanced").length || 0),
    0,
  );

  return (
    <div className="page">
      <p className="crumbs">
        <Link to="/tracks">Courses</Link>
        <span>/</span>
        {track.title}
      </p>
      <header className="page-head">
        <p className="eyebrow">{track.index} · {track.path}</p>
        <h1>{track.title}</h1>
        <p className="lede">{track.summary}</p>
      </header>
      <section className="roadmap-summary" aria-label="Course roadmap summary">
        <div><strong>{track.modules.length}</strong><span>tool-based modules</span></div>
        <div><strong>{chapterCount}</strong><span>chapter outlines</span></div>
        <div><strong>{advancedCount}</strong><span>advanced chapters</span></div>
        <div><strong>{completed}/{track.modules.length}</strong><span>modules completed</span></div>
      </section>
      <CourseCoach track={track} />
      {track.project && (
        <section className="panel capstone-card">
          <p className="kicker">Course capstone</p>
          <h2>Put the full path together</h2>
          <p>{track.project}</p>
          <p className="muted"><strong>Stretch challenge:</strong> {track.challenge}</p>
        </section>
      )}
      <label className="field roadmap-search">
        <span>Find a module, tool, or chapter</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try Excel, window functions, or Airflow"
        />
      </label>
      <ol className="spine roadmap">
        {modules.map((mod) => {
          const n = mod.n;
          const id = `${track.slug}-${n}`;
          return (
            <li key={id} className={`roadmap-module${mod.status === "live" ? " live" : ""}`}>
              <Link to={`/learn/${track.slug}/${n}`} className="module-link">
                <span className="n">{String(n).padStart(2, "0")}</span>
                <span className="module-link-copy">
                  <strong>{mod.title}</strong>
                  <small>
                    {mod.status === "live" ? "SQL fundamentals lesson and lab are open" : "Chapter roadmap · lesson content in production"}
                    {done[id] ? " · complete" : seen[id] ? " · opened" : ""}
                  </small>
                </span>
                <em className={mod.status === "live" ? "badge badge-live" : "badge badge-soon"}>
                  {mod.status === "live" ? "SQL live" : "Roadmap"}
                </em>
              </Link>
              {mod.tools?.length > 0 && (
                <div className="tool-tags" aria-label="Tools covered">
                  {mod.tools.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
              )}
              {mod.chapters?.length > 0 && (
                <details className="chapter-disclosure" open={Boolean(query)}>
                  <summary>
                    {mod.chapters.length} chapters · {mod.chapters.filter((chapter) => chapter.level === "advanced").length} advanced
                  </summary>
                  <ol className="chapter-list">
                    {mod.chapters.map((chapter, chapterIndex) => (
                      <li key={chapter.title} className={chapter.level === "advanced" ? "advanced" : ""}>
                        <span>{String(chapterIndex + 1).padStart(2, "0")}</span>
                        <span>{chapter.title}</span>
                        {chapter.level === "advanced" && <em>Advanced</em>}
                      </li>
                    ))}
                  </ol>
                  <div className="project-preview">
                    <p><strong>Applied project:</strong> {mod.project}</p>
                    <p><strong>Challenge:</strong> {mod.challenge}</p>
                  </div>
                </details>
              )}
            </li>
          );
        })}
      </ol>
      {!modules.length && (
        <div className="panel empty-catalog">
          <h2>No matching modules</h2>
          <p className="muted">Try another tool or chapter name.</p>
        </div>
      )}
    </div>
  );
}
