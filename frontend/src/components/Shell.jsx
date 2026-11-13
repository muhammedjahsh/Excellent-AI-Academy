import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getTrack } from "../data/curriculum";
import { useAcademy } from "../context/AcademyContext";
import CommandPalette from "./CommandPalette";
import Icon from "./Icon";
import Mark from "./Mark";

export default function Shell() {
  const { user, online, logout, activeCourse } = useAcademy();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const location = useLocation();
  const track = getTrack(activeCourse);
  const links = track
    ? [
        { to: `/tracks/${track.slug}`, label: "My course", icon: "course" },
        { to: "/tracks", label: "Switch course", icon: "switch" },
        ...(track.slug === "data-analytics" ? [{ to: "/lab", label: "SQL lab", icon: "lab" }] : []),
        { to: "/studio", label: "Developer studio", icon: "studio" },
        { to: "/agents", label: "Course AI", icon: "ai" },
        { to: "/dashboard", label: "My progress", icon: "progress" },
        { to: "/certificates", label: "Records", icon: "records" },
        { to: "/checkout", label: "Enroll in courses", icon: "payment" },
      ]
    : user?.token
      ? [
          { to: "/tracks", label: "Browse courses", icon: "course" },
          { to: "/checkout", label: "Enroll in courses", icon: "payment" },
        ]
      : [{ to: "/tracks", label: "Choose a course", icon: "course" }];

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
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
            >
              <Icon name={link.icon} size={18} />
              <span>{link.label}</span>
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
              {track && <p className="side-course-label">Learning: {track.title}</p>}
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
          <button
            type="button"
            className="menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
          <div className="topbar-search">
            <button type="button" className="jump" onClick={() => setPalette(true)}>
              <Icon name="search" size={18} />
              <span>{track ? `Search ${track.title} modules and tools` : "Choose a course to get started"}</span>
              <kbd>Ctrl K</kbd>
            </button>
          </div>
          <NavLink to="/" className="text-btn home-link">
            Home
          </NavLink>
        </header>
        <main className="canvas">
          <Outlet />
        </main>
      </div>
      {palette && <CommandPalette activeCourse={activeCourse} onClose={() => setPalette(false)} />}
    </div>
  );
}
