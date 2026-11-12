import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TRACKS } from "../data/curriculum";
import { useTitle } from "../hooks/useTitle";

export default function Catalog() {
  useTitle("Courses");
  const [query, setQuery] = useState("");
  const [onlyLive, setOnlyLive] = useState(false);

  const tracks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TRACKS.map((track) => ({
      ...track,
      modules: track.modules
        .map((mod, index) => ({ ...mod, n: index + 1 }))
        .filter((mod) => {
          const matches = !needle || `${track.title} ${mod.title}`.toLowerCase().includes(needle);
          return matches && (!onlyLive || mod.status === "live");
        }),
    })).filter((track) => track.modules.length);
  }, [query, onlyLive]);

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Catalog</p>
        <h1>Courses</h1>
        <p className="lede">
          Explore career paths across software, mobile, data, design, business, and AI. Live means the lesson and check exist; mapped means the course outline is ready while lessons are in production.
        </p>
      </header>
      <div className="filters">
        <label className="field grow">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="MERN, Flutter, business analysis…"
          />
        </label>
        <button
          type="button"
          className={onlyLive ? "btn btn-gold btn-small" : "btn btn-ghost btn-small"}
          onClick={() => setOnlyLive((value) => !value)}
        >
          {onlyLive ? "Showing live modules" : "Live modules only"}
        </button>
      </div>
      <div className="stack">
        {tracks.map((track) => (
          <section key={track.slug} className="panel track-block" data-accent={track.accent}>
            <div className="track-block-head">
              <div>
                <p className="kicker">{track.index} · {track.kicker}</p>
                <h2>{track.title}</h2>
                <p className="muted">{track.summary}</p>
              </div>
              <Link to={`/tracks/${track.slug}`} className="btn btn-ghost btn-small">
                Open track
              </Link>
            </div>
            <ul className="module-pills">
              {track.modules.map((mod) => (
                <li key={mod.n}>
                  <Link to={`/learn/${track.slug}/${mod.n}`}>
                    <span>{String(mod.n).padStart(2, "0")}</span>
                    {mod.title}
                    <em className={mod.status === "live" ? "badge badge-live" : "badge badge-soon"}>
                      {mod.status === "live" ? "Live" : "Mapped"}
                    </em>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!tracks.length && <p className="muted">No module matches that filter.</p>}
      </div>
    </div>
  );
}
