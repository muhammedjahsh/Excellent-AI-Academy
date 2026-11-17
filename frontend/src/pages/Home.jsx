import { Link, NavLink, useNavigate } from "react-router-dom";
import CourseChooser from "../components/CourseChooser";
import Icon from "../components/Icon";
import Mark from "../components/Mark";
import { useAcademy } from "../context/AcademyContext";
import { AGENTS, getTrack } from "../data/curriculum";
import { useTitle } from "../hooks/useTitle";

export default function Home() {
  const navigate = useNavigate();
  const { activeCourse, selectCourse, done, seen, enrollments } = useAcademy();
  const track = getTrack(activeCourse);
  useTitle(track?.title || "Choose a course");

  const completed = track
    ? track.modules.filter((_, index) => done[`${track.slug}-${index + 1}`]).length
    : 0;
  const allComplete = Boolean(track && completed === track.modules.length);
  const nextIndex = track
    ? Math.max(0, track.modules.findIndex((_, index) => !done[`${track.slug}-${index + 1}`]))
    : 0;
  const nextModule = track?.modules[nextIndex];
  const chapterCount = track?.modules.reduce((count, module) => count + (module.chapters?.length || 0), 0) || 0;
  const advancedCount = track?.modules.reduce(
    (count, module) => count + (module.chapters?.filter((chapter) => chapter.level === "advanced").length || 0),
    0,
  ) || 0;

  function chooseCourse(course) {
    if (enrollments.includes(course.slug)) selectCourse(course.slug);
    navigate(`/tracks/${course.slug}`);
  }

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
        {track ? (
          <nav>
            <NavLink to={`/tracks/${track.slug}`}>My course</NavLink>
            <NavLink to="/tracks">Switch course</NavLink>
            <NavLink to="/agents">Course AI</NavLink>
            {track.slug === "data-analytics" && <NavLink to="/lab">SQL lab</NavLink>}
          </nav>
        ) : (
          <p className="course-selection-note">Choose one learning path to personalize your academy.</p>
        )}
        <Link to="/signin" className="btn btn-gold btn-small">Account</Link>
      </header>

      <section className="hero course-home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <i className="pulse" />
            {track ? `${track.index} · Your personal learning space` : "Start with one focused learning path"}
          </p>
          <h1>
            {track ? (
              <>
                {track.title}
                <em> learning space.</em>
              </>
            ) : (
              <>
                One course.
                <em> Your focus.</em>
              </>
            )}
          </h1>
          <p className="lede">
            {track
              ? track.summary
              : "Choose the course you want to focus on. The workspace will show its roadmap, progress, and course-specific AI coach. You can switch courses any time."}
          </p>
          <div className="hero-actions">
            {track ? (
              <>
                <Link className="btn btn-gold" to={allComplete ? `/tracks/${track.slug}` : `/learn/${track.slug}/${nextIndex + 1}`}>
                  {allComplete ? "Review my roadmap" : seen[`${track.slug}-${nextIndex + 1}`] ? "Continue learning" : "Start next module"}
                  <Icon name="arrow" size={18} />
                </Link>
                <Link className="btn btn-ghost" to={`/tracks/${track.slug}`}>
                  Open my roadmap
                </Link>
              </>
            ) : (
              <a className="btn btn-gold" href="#choose-course">Choose my course</a>
            )}
          </div>
          {track && (
            <dl className="stat-row course-home-stats">
              <div><dt>{track.modules.length}</dt><dd>Modules</dd></div>
              <div><dt>{chapterCount}</dt><dd>Chapters</dd></div>
              <div><dt>{advancedCount}</dt><dd>Advanced topics</dd></div>
              <div><dt>{completed}/{track.modules.length}</dt><dd>Completed</dd></div>
            </dl>
          )}
        </div>
        <div className="stage course-home-stage" aria-label="Academy faculty">
          <div className="stage-glow" />
          <div className="stage-constellation" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="stage-orb"><span /></div>
          <div className="stage-model" aria-hidden="true">
            <div className="academy-cube">
              <div className="cube-face cube-front">
                <span className="cube-emblem">EA</span>
                <strong>LEARN</strong>
                <small>01 / EXPLORE</small>
              </div>
              <div className="cube-face cube-right">
                <span className="cube-emblem">{"{ }"}</span>
                <strong>BUILD</strong>
                <small>02 / CREATE</small>
              </div>
              <div className="cube-face cube-back">
                <span className="cube-emblem">AI</span>
                <strong>THINK</strong>
                <small>03 / DISCOVER</small>
              </div>
              <div className="cube-face cube-left">
                <span className="cube-emblem">↗</span>
                <strong>GROW</strong>
                <small>04 / ADVANCE</small>
              </div>
              <div className="cube-face cube-top"><i /><i /><i /></div>
              <div className="cube-face cube-bottom" />
            </div>
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

      {track ? (
        <section className="band selected-course-content">
          <div className="selected-course-layout">
            <article className="panel next-step-card">
              <p className="kicker">Recommended next step</p>
              <h2>{allComplete ? "All course modules completed" : nextModule?.title || "Your course roadmap"}</h2>
              <p className="muted">
                {allComplete ? "Review your work or revisit an advanced chapter." : nextModule?.points?.[0] || "Open your roadmap to choose a module and continue your learning."}
              </p>
              <Link className="btn btn-gold" to={allComplete ? `/tracks/${track.slug}` : `/learn/${track.slug}/${nextIndex + 1}`}>
                {allComplete ? "Review my roadmap" : `Open module ${String(nextIndex + 1).padStart(2, "0")}`}
              </Link>
            </article>
            <article className="panel course-progress-card">
              <p className="kicker">Your progress</p>
              <p className="course-progress-count">{completed}<span> / {track.modules.length}</span></p>
              <p className="muted">modules completed in {track.title}</p>
              <div className="bar" role="progressbar" aria-label={`${track.title} completion`} aria-valuenow={completed} aria-valuemin={0} aria-valuemax={track.modules.length}>
                <i style={{ width: `${track.modules.length ? Math.round((completed / track.modules.length) * 100) : 0}%` }} />
              </div>
              <Link to="/dashboard" className="text-btn">View my progress</Link>
            </article>
          </div>
          <div className="course-home-actions">
            <Link to="/agents" className="panel course-home-action">
              <span className="feature-icon"><Icon name="ai" size={21} /></span>
              <span className="kicker">Course-specific AI</span>
              <strong>Ask {track.assistant.name}</strong>
              <span className="muted">{track.assistant.role}</span>
            </Link>
            {track.slug === "data-analytics" && (
              <Link to="/lab" className="panel course-home-action">
                <span className="feature-icon"><Icon name="lab" size={21} /></span>
                <span className="kicker">Hands-on practice</span>
                <strong>Open the SQL lab</strong>
                <span className="muted">Run and submit graded SQL tasks.</span>
              </Link>
            )}
            <Link to="/tracks" className="panel course-home-action switch-course-action">
              <span className="feature-icon"><Icon name="switch" size={21} /></span>
              <span className="kicker">Your choice can change</span>
              <strong>Switch course</strong>
              <span className="muted">Your progress stays saved in this browser.</span>
            </Link>
          </div>
          <footer className="market-foot">
            <Mark size={22} />
            <p>Your selected course and learning progress are saved in this browser.</p>
          </footer>
        </section>
      ) : (
        <section className="band course-onboarding" id="choose-course">
          <div className="section-head">
            <p className="eyebrow">Choose your learning path</p>
            <h2>Pick one course to personalize your workspace.</h2>
            <p className="muted">Only your selected course appears in your learning space. You can switch whenever you want.</p>
          </div>
          <div className="learning-visual-grid" aria-label="A look inside the academy">
            <figure className="learning-visual-tile">
              <img src="/images/collaborative-learning.jpg" alt="Learners collaborating around a laptop" width="960" height="640" loading="lazy" />
              <figcaption>
                <span>01 / LEARN TOGETHER</span>
                <strong>Curiosity grows in good company.</strong>
              </figcaption>
            </figure>
            <figure className="learning-visual-tile">
              <img src="/images/learning-analytics.jpg" alt="An analytics dashboard displaying charts and metrics" width="960" height="640" loading="lazy" />
              <figcaption>
                <span>02 / FIND THE SIGNAL</span>
                <strong>Turn data into clear decisions.</strong>
              </figcaption>
            </figure>
            <figure className="learning-visual-tile">
              <img src="/images/coding-workspace.jpg" alt="Code open on a laptop in a bright workspace" width="960" height="640" loading="lazy" />
              <figcaption>
                <span>03 / MAKE IT REAL</span>
                <strong>Build projects you can show.</strong>
              </figcaption>
            </figure>
          </div>
          <CourseChooser onChoose={chooseCourse} enrolledCourses={enrollments} />
          <p className="course-storage-note">Selection is saved on this browser, not synced to your account or other devices.</p>
        </section>
      )}
    </div>
  );
}
