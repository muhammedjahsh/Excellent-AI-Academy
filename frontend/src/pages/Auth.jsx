import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Auth() {
  useTitle("Sign in");
  const { register, login, continueAsGuest, busy, online } = useAcademy();
  const navigate = useNavigate();
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError("Use an email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    if (mode === "register" && form.name.trim().length < 2) {
      setError("Add the name that should appear on a record.");
      return;
    }
    try {
      if (mode === "register") {
        await register(form);
        navigate("/checkout");
      } else {
        const { courses } = await login(form);
        navigate(courses.length ? "/" : "/checkout");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-topline">
        <Link to="/" className="auth-home-link">← Back to academy</Link>
        <span className={online ? "auth-server-status is-online" : "auth-server-status"}>
          <i />
          {online ? "Account service available" : "Account service offline"}
        </span>
      </div>
      <div className="auth-layout">
        <section className="auth-intro">
          <p className="eyebrow">Excellent AI Academy</p>
          <h1>{mode === "register" ? <>Make room for <em>what’s next.</em></> : <>Good to have <em>you back.</em></>}</h1>
          <p className="lede">
            {mode === "register"
              ? "Build practical skills with a focused course, hands-on projects, and learning support designed around your path."
              : "Pick up where you left off and get back to your learning path."}
          </p>
          <ul className="auth-benefits">
            <li><span><Icon name="course" size={19} /></span><div><strong>One focused course</strong><small>Keep your learning space centered on your goals.</small></div></li>
            <li><span><Icon name="lab" size={19} /></span><div><strong>Learn by doing</strong><small>Practice with projects, labs, and advanced topics.</small></div></li>
            <li><span><Icon name="shield" size={19} /></span><div><strong>Your choice, always</strong><small>Browse every course, then enroll in the ones you choose.</small></div></li>
          </ul>
          <div className="auth-orbit" aria-hidden="true"><i /><i /><i /><span /></div>
        </section>
        <section className="auth-card panel">
          <div className="auth-card-heading">
            <p className="kicker">{mode === "register" ? "Get started" : "Your learning space"}</p>
            <h2>{mode === "register" ? "Create your account" : "Sign in to continue"}</h2>
            <p className="muted">{mode === "register" ? "It only takes a moment to set up." : "Enter your account details below."}</p>
          </div>
          <div className="task-switch" role="group" aria-label="Account action">
            <button type="button" aria-pressed={mode === "register"} className={mode === "register" ? "on" : ""} onClick={() => changeMode("register")}>
              Create account
            </button>
            <button type="button" aria-pressed={mode === "login"} className={mode === "login" ? "on" : ""} onClick={() => changeMode("login")}>
              Sign in
            </button>
          </div>
          <form onSubmit={submit} className="stack-form">
            {mode === "register" && (
              <label className="field" htmlFor="auth-name">
                <span>Name</span>
                <input id="auth-name" name="name" value={form.name} onChange={update} placeholder="How should we address you?" autoComplete="name" required />
              </label>
            )}
            <label className="field" htmlFor="auth-email">
              <span>Email address</span>
              <input id="auth-email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <div className="field">
              <label htmlFor="auth-password">Password</label>
              <div className="auth-password">
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update}
                  placeholder="At least 8 characters"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <small className="auth-field-hint">Use at least 8 characters.</small>
            </div>
            {!online && (
              <p className="auth-offline-note" role="status">
                Account access needs the academy server. You can still browse the course catalog.
              </p>
            )}
            {error && <p className="fail-text" role="alert">{error}</p>}
            <button className="btn btn-gold auth-submit" type="submit" disabled={busy || !online}>
              {busy ? "Working…" : mode === "register" ? "Create my account" : "Sign in"}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <button
            type="button"
            className="btn btn-ghost auth-guest"
            onClick={() => {
              continueAsGuest();
              navigate("/tracks");
            }}
          >
            Browse courses as a guest
          </button>
          <p className="auth-card-foot">Course modules unlock after enrollment and payment.</p>
        </section>
      </div>
    </div>
  );
}
