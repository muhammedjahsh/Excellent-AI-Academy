import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";

export default function Auth() {
  useTitle("Sign in");
  const { register, login, continueAsGuest, busy, online } = useAcademy();
  const navigate = useNavigate();
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

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
      if (mode === "register") await register(form);
      else await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page auth-page">
      <header className="page-head">
        <p className="eyebrow">{online ? "Academy server live" : "Server offline"}</p>
        <h1>{mode === "register" ? "Create your desk." : "Welcome back."}</h1>
        <p className="lede">
          Accounts live on the academy server. The catalog, the on-device studio, and the local SQL grader stay available either way.
        </p>
      </header>
      <div className="auth-card panel">
        <div className="task-switch">
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>
            Register
          </button>
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
            Sign in
          </button>
        </div>
        <form onSubmit={submit} className="stack-form">
          {mode === "register" && (
            <label className="field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={update} placeholder="Asha Nair" />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input name="email" value={form.email} onChange={update} placeholder="you@academy.dev" autoComplete="username" />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              placeholder="8 or more characters"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </label>
          {error && <p className="fail-text">{error}</p>}
          <button className="btn btn-gold" type="submit" disabled={busy || !online}>
            {busy ? "Working…" : mode === "register" ? "Create account" : "Sign in"}
          </button>
        </form>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            continueAsGuest();
            navigate("/dashboard");
          }}
        >
          Continue as a guest
        </button>
        <p className="muted">
          Guest progress stays in this browser. <Link to="/tracks">Browse without an account.</Link>
        </p>
      </div>
    </div>
  );
}
