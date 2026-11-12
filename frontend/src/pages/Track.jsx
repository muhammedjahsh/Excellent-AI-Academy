import { Link, useParams } from "react-router-dom";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Track() {
  const { slug } = useParams();
  const track = getTrack(slug);
  const { done, seen } = useAcademy();
  useTitle(track?.title || "Course");

  if (!track) {
    return (
      <div className="page">
        <h1>That course is not on the map.</h1>
        <Link to="/tracks">Back to courses</Link>
      </div>
    );
  }

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
      <ol className="spine">
        {track.modules.map((mod, index) => {
          const n = index + 1;
          const id = `${track.slug}-${n}`;
          return (
            <li key={id} className={mod.status === "live" ? "live" : ""}>
              <Link to={`/learn/${track.slug}/${n}`}>
                <span className="n">{String(n).padStart(2, "0")}</span>
                <span>
                  <strong>{mod.title}</strong>
                  <small>
                    {mod.status === "live" ? "Lesson and lab are open" : "Title reserved · lesson in production"}
                    {done[id] ? " · complete" : seen[id] ? " · opened" : ""}
                  </small>
                </span>
                <em className={mod.status === "live" ? "badge badge-live" : "badge badge-soon"}>
                  {mod.status === "live" ? "Live" : "Mapped"}
                </em>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
