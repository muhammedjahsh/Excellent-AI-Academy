import { Link } from "react-router-dom";
import { AGENTS, TRACKS, moduleCount } from "../data/curriculum";
import { useTitle } from "../hooks/useTitle";
import Mark from "../components/Mark";

export default function Home() {
  useTitle("");
  const modules = moduleCount();

  return (
    <div className="marketing">
      <header className="market-nav">
        <Link to="/" className="brand">
          <Mark />
          <span>
            <strong>Excellent</strong>
            <small>AI Academy</small>
          </span>
        </Link>
        <nav>
          <Link to="/tracks">Courses</Link>
          <Link to="/studio">Developer studio</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/lab">SQL lab</Link>
        </nav>
        <Link to="/signin" className="btn btn-gold btn-small">
          Enter
        </Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <i className="pulse" /> Faculty of agents · {TRACKS.length} learning paths
          </p>
          <h1>
            Study with agents.
            <em> Keep the proof.</em>
          </h1>
          <p className="lede">
            Excellent AI Academy is a course platform where specialist agents teach, drill, and
            interview you across technology, data, design, and business. Grades come from the work
            you submit, and unfinished modules stay marked as mapped.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/tracks">
              Browse courses
            </Link>
            <Link className="btn btn-ghost" to="/agents">
              Open the agent studio
            </Link>
          </div>
          <dl className="stat-row">
            <div>
              <dt>{String(TRACKS.length).padStart(2, "0")}</dt>
              <dd>Courses</dd>
            </div>
            <div>
              <dt>{String(modules).padStart(2, "0")}</dt>
              <dd>Modules listed</dd>
            </div>
            <div>
              <dt>01</dt>
              <dd>Lesson live</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>Graded SQL tasks</dd>
            </div>
          </dl>
        </div>
        <div className="stage" aria-hidden="true">
          <div className="stage-glow" />
          <div className="stage-orb">
            <span />
          </div>
          {AGENTS.map((agent) => (
            <article key={agent.id} className={`float tint-${agent.tint}`}>
              <header>
                <b>{agent.name}</b>
                <span>{agent.role}</span>
              </header>
              <p>{agent.brief}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-head">
          <p className="eyebrow">Catalog</p>
          <h2>{TRACKS.length} paths. One faculty.</h2>
        </div>
        <div className="track-grid">
          {TRACKS.map((track) => (
            <Link key={track.slug} to={`/tracks/${track.slug}`} className="track-card" data-accent={track.accent}>
              <div className="track-top">
                <span>{track.index}</span>
                {track.signature && <em className="badge badge-live">Signature</em>}
              </div>
              <h3>{track.title}</h3>
              <p>{track.summary}</p>
              <footer>
                <span>{track.modules.length} modules</span>
                <span>{track.modules.filter((mod) => mod.status === "live").length} live</span>
              </footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="band split-band">
        <div>
          <p className="eyebrow">How a session works</p>
          <h2>An agent has a job, and the lab has a key.</h2>
          <ol className="steps">
            <li>
              <strong>Atlas</strong> points you at the live lesson instead of a module that is only a title.
            </li>
            <li>
              <strong>Mira</strong> teaches SELECT, JOIN, and GROUP BY from the published SQL lesson.
            </li>
            <li>
              <strong>Quill</strong> hints at your query. The grader compares results, so a lucky sentence cannot pass.
            </li>
            <li>
              <strong>Vega</strong> asks one interview question. <strong>Herald</strong> keeps the completion record closed until the work exists.
            </li>
          </ol>
        </div>
        <aside className="preview panel">
          <p className="kicker">Studio preview · Mira</p>
          <p className="bubble agent">
            WHERE runs before grouping. If you want rows where the total is large, that filter is HAVING, because the total does not exist at WHERE time.
          </p>
          <p className="bubble user">Why did my city count include Delhi?</p>
          <p className="bubble agent">
            COUNT of customers by city keeps every city until HAVING says “more than one”. Delhi has one customer, so it drops.
          </p>
          <Link to="/agents" className="text-btn">
            Talk to the faculty
          </Link>
        </aside>
      </section>

      <section className="band roadmap">
        <div className="section-head">
          <p className="eyebrow">What is open today</p>
          <h2>The map is wide. The classroom is honest.</h2>
        </div>
        <div className="road-grid">
          <article className="panel">
            <span className="badge badge-live">Live</span>
            <h3>SQL fundamentals</h3>
            <p>A full lesson, source links, and three tasks graded against hidden reference results.</p>
          </article>
          <article className="panel">
            <span className="badge badge-soon">In the studio</span>
            <h3>Five faculty agents</h3>
            <p>Tutor, coach, interviewer, planner, and records. They answer from the published curriculum on this device.</p>
          </article>
          <article className="panel">
            <span className="badge badge-soon">Mapped</span>
            <h3>The other modules</h3>
            <p>Titles are in the catalog. Lesson text, quizzes, and projects for those rooms are still in production.</p>
          </article>
        </div>
      </section>

      <footer className="market-foot">
        <Mark size={22} />
        <p>Excellent AI Academy · a course completion record is a school credential, separate from a university degree.</p>
      </footer>
    </div>
  );
}
