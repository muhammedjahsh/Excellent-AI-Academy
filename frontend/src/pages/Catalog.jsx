import { Link, useNavigate } from "react-router-dom";
import CourseChooser from "../components/CourseChooser";
import { useAcademy } from "../context/AcademyContext";
import { getTrack } from "../data/curriculum";
import { useTitle } from "../hooks/useTitle";

export default function Catalog() {
  const navigate = useNavigate();
  const { activeCourse, selectCourse, clearCourseSelection, done } = useAcademy();
  const track = getTrack(activeCourse);
  useTitle(track ? "Switch course" : "Choose a course");

  function chooseCourse(course) {
    selectCourse(course.slug);
    navigate(`/tracks/${course.slug}`);
  }

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">{track ? "Personal learning space" : "Get started"}</p>
        <h1>{track ? "Switch your course" : "Choose your course"}</h1>
        <p className="lede">
          {track
            ? `Your workspace currently shows ${track.title}. Choose another path to change your course focus. Your progress on each course is kept in this browser.`
            : "Choose one course to personalize your workspace. Only its roadmap, progress, and course coach will be shown after selection."}
        </p>
      </header>
      {track && (
        <section className="panel current-course-card">
          <div>
            <p className="kicker">Currently selected</p>
            <h2>{track.title}</h2>
            <p className="muted">
              {track.modules.filter((_, index) => done[`${track.slug}-${index + 1}`]).length} of {track.modules.length} modules completed
            </p>
          </div>
          <div className="hero-actions current-course-actions">
            <Link className="btn btn-gold" to={`/tracks/${track.slug}`}>Return to my course</Link>
            <button type="button" className="text-btn" onClick={clearCourseSelection}>Clear selection</button>
          </div>
        </section>
      )}
      <section className="course-switcher-section">
        <div className="section-head">
          <p className="eyebrow">{track ? "Available choices" : "Learning paths"}</p>
          <h2>{track ? "Change your focus when you’re ready." : "Select one path to get started."}</h2>
        </div>
        <CourseChooser onChoose={chooseCourse} excludeSlug={track?.slug} />
      </section>
      <p className="course-storage-note">Course selection and progress are stored on this browser and are not synced across devices.</p>
    </div>
  );
}
