import { Link, Navigate } from "react-router-dom";
import CourseCoach from "../components/CourseCoach";
import { useAcademy } from "../context/AcademyContext";
import { getTrack } from "../data/curriculum";
import { useTitle } from "../hooks/useTitle";

export default function Agents() {
  const { activeCourse } = useAcademy();
  const track = getTrack(activeCourse);
  useTitle(track ? `${track.assistant.name} · Course AI` : "Choose a course");

  if (!track) return <Navigate to="/tracks" replace />;

  return (
    <div className="page agents">
      <p className="crumbs">
        <Link to={`/tracks/${track.slug}`}>{track.title}</Link>
        <span>/</span>
        Course AI
      </p>
      <header className="page-head">
        <p className="eyebrow">{track.assistant.tool}</p>
        <h1>Your course AI coach</h1>
        <p className="lede">
          {track.assistant.name} is configured for your selected {track.title} path. The current coach uses the course roadmap on this device and does not send questions to a hosted AI service.
        </p>
      </header>
      <CourseCoach track={track} />
      <div className="hero-actions">
        <Link to={`/tracks/${track.slug}`} className="btn btn-ghost">Back to my course</Link>
        <Link to="/tracks" className="text-btn">Switch course</Link>
      </div>
    </div>
  );
}
