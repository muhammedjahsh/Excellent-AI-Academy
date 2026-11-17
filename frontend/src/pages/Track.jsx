import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CourseCoach from "../components/CourseCoach";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Track() {
  const { slug } = useParams();
  const track = getTrack(slug);
  const { activeCourse, done, seen, enrollments, selectCourse, user } = useAcademy();
  const activeTrack = getTrack(activeCourse);
  const enrolled = enrollments.includes(track?.slug);
  const selected = activeCourse === track?.slug;
  const lessonsAvailable = enrolled && selected;
  const [query, setQuery] = useState("");
  useTitle(track?.title || activeTrack?.title || "Choose a course");

  const modules = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (track?.modules || [])
      .map((mod, index) => ({ ...mod, n: index + 1 }))
      .filter((mod) => {
        const searchable = [
          mod.title,
          ...(mod.tools || []),
          ...(mod.chapters || []).map((chapter) => chapter.title),
          ...(mod.projects || []).flatMap((project) => [project.title, project.brief]),
          mod.project,
          mod.challenge,
        ].join(" ").toLowerCase();
        return !needle || searchable.includes(needle);
      });
  }, [query, track]);

  if (!track) {
    return (
      <div className="page">
        <h1>That course is not on the map.</h1>
        <Link to="/tracks">Back to courses</Link>
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
        {!enrolled ? (
          <div className="hero-actions">
            <Link className="btn btn-gold" to={user?.token ? "/checkout" : "/signin"}>
              {user?.token ? "Enroll to unlock lessons" : "Sign in to enroll"}
            </Link>
            <span className="muted">Syllabus preview · lessons and course tools require enrollment.</span>
          </div>
        ) : !selected ? (
          <div className="hero-actions">
            <button type="button" className="btn btn-gold" onClick={() => selectCourse(track.slug)}>
              Make this my active course
            </button>
            <span className="muted">You are enrolled; select this course to start its lessons.</span>
          </div>
        ) : null}
      </header>
      <section className="roadmap-summary" aria-label="Course roadmap summary">
        <div><strong>{track.modules.length}</strong><span>tool-based modules</span></div>
        <div><strong>{chapterCount}</strong><span>chapter outlines</span></div>
        <div><strong>{advancedCount}</strong><span>advanced chapters</span></div>
        <div><strong>{completed}/{track.modules.length}</strong><span>modules completed</span></div>
      </section>
      <CourseCoach track={track} />
      {track.majorProject && (
        <section className="panel capstone-card">
          <p className="kicker">Major project · integrates all {track.majorProject.modules.length} modules</p>
          <h2>{track.majorProject.title}</h2>
          <p>{track.majorProject.brief}</p>
          <h3>Portfolio deliverables</h3>
          <ul className="project-deliverables">
            {track.majorProject.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
          </ul>
          <details className="capstone-modules">
            <summary>Show the modules this project brings together</summary>
            <ol>
              {track.majorProject.modules.map((module, index) => <li key={module}>{String(index + 1).padStart(2, "0")} · {module}</li>)}
            </ol>
          </details>
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
            <li id={id} key={id} className={`roadmap-module${mod.status === "live" ? " live" : ""}`}>
              {lessonsAvailable ? (
                <Link to={`/learn/${track.slug}/${n}`} className="module-link">
                  <ModuleHeading mod={mod} id={id} done={done} seen={seen} lessonsAvailable />
                </Link>
              ) : (
                <div className="module-link module-link-preview">
                  <ModuleHeading mod={mod} id={id} done={done} seen={seen} />
                </div>
              )}
              {!lessonsAvailable && (
                <em className="badge badge-soon module-preview-badge">
                  {enrolled ? "Select course to learn" : "Syllabus preview"}
                </em>
              )}
              {mod.tools?.length > 0 && (
                <div className="tool-tags" aria-label="Tools covered">
                  {mod.tools.map((tool) => <span key={tool}>{tool}</span>)}
                </div>
              )}
              {mod.chapters?.length > 0 && (
                <details className="chapter-disclosure" open={Boolean(query)}>
                  <summary>
                    {mod.chapters.length} chapters · {mod.chapters.filter((chapter) => chapter.level === "advanced").length} advanced · {mod.projects?.length || 0} project briefs
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
                  {mod.projects?.length === 5 && (
                    <section className="module-project-ideas" aria-label={`${mod.title} project ideas`}>
                      <h3>5 distinctive project briefs</h3>
                      <ol>
                        {mod.projects.map((project) => (
                          <li key={project.title}>
                            <strong>{project.title}</strong>
                            <p>{project.brief}</p>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
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

function ModuleHeading({ mod, id, done, seen, lessonsAvailable = false }) {
  const n = mod.n;
  return (
    <>
      <span className="n">{String(n).padStart(2, "0")}</span>
      <span className="module-link-copy">
        <strong>{mod.title}</strong>
        <small>
          {mod.status === "live" && lessonsAvailable ? "SQL fundamentals lesson and lab are open" : "Syllabus outline and project briefs"}
          {done[id] ? " · complete" : seen[id] ? " · opened" : ""}
        </small>
      </span>
      <em className={mod.status === "live" && lessonsAvailable ? "badge badge-live" : "badge badge-soon"}>
        {mod.status === "live" && lessonsAvailable ? "SQL live" : "Roadmap"}
      </em>
    </>
  );
}
