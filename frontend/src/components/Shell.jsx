import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import CommandPalette from "./CommandPalette";
import Mark from "./Mark";

const LINKS = [
  { to: "/tracks", label: "Courses" },
  { to: "/lab", label: "SQL lab" },
  { to: "/studio", label: "Developer studio" },
  { to: "/agents", label: "Agent studio" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/certificates", label: "Records" },
];

export default function Shell() {
  const { user, online, logout } = useAcademy();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    document.querySelector(".canvas")?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function onKey(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((value) => !value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <aside className={open ? "side open" : "side"}>
        <NavLink to="/" className="brand">
          <Mark />
          <span>
            <strong>Excellent</strong>
            <small>AI Academy</small>
          </span>
        </NavLink>
        <nav>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <p className={online ? "status on" : "status"}>
            <i />
            {online ? "Academy server live" : "Local studio"}
          </p>
          {user ? (
            <>
              <p className="who">{user.name}</p>
              <button type="button" className="text-btn" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/signin" className="btn btn-gold btn-small">
              Sign in
            </NavLink>
          )}
        </div>
      </aside>
      {open && <button className="scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button type="button" className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <span />
            <span />
          </button>
          <button type="button" className="jump" onClick={() => setPalette(true)}>
            Search the academy
            <kbd>Ctrl K</kbd>
          </button>
          <NavLink to="/" className="text-btn home-link">
            Home
          </NavLink>
        </header>
        <main className="canvas">
          <Outlet />
        </main>
      </div>
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
