import { useMemo, useState } from "react";
import { TRACKS } from "../data/curriculum";
import CourseArtwork from "./CourseArtwork";

export default function CourseChooser({ onChoose, excludeSlug, enrolledCourses = [] }) {
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TRACKS.filter((track) => {
      if (track.slug === excludeSlug) return false;
      return !needle || `${track.title} ${track.summary} ${track.path}`.toLowerCase().includes(needle);
    });
  }, [excludeSlug, query]);

  return (
    <>
      <label className="field course-choice-search">
        <span>Find a course</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search course names or areas"
        />
      </label>
      {options.length ? (
        <div className="course-choice-grid">
          {options.map((track) => (
            <article className="panel course-choice-card" key={track.slug} data-accent={track.accent}>
              <div className="course-choice-top">
                <span className="badge badge-soon">{track.path.split(" · ")[0]}</span>
                <span className="course-choice-index">{track.index}</span>
              </div>
              <div className="course-art"><CourseArtwork slug={track.slug} /></div>
              <h2>{track.title}</h2>
              <p className="muted">{track.summary}</p>
              <div className="course-choice-meta">
                <span>{track.modules.length} modules</span>
                <span>{track.assistant.name} · course coach</span>
              </div>
              <button type="button" className="btn btn-ghost" onClick={() => onChoose(track)}>
                {enrolledCourses.includes(track.slug) ? "Open this course" : "View syllabus"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel empty-catalog">
          <h2>No courses match</h2>
          <p className="muted">Try another search term.</p>
        </div>
      )}
    </>
  );
}
