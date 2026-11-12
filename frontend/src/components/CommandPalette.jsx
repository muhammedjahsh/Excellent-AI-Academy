import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AGENTS, TRACKS } from "../data/curriculum";
import { TASKS } from "../data/lab";

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const items = useMemo(() => {
    const base = [
      { label: "Home", hint: "Academy", to: "/" },
      { label: "Courses", hint: "Catalog", to: "/tracks" },
      { label: "SQL lab", hint: "Practice", to: "/lab" },
      { label: "Developer studio", hint: "Python · source · Actions", to: "/studio" },
      { label: "Agent studio", hint: "Faculty", to: "/agents" },
      { label: "Dashboard", hint: "Progress", to: "/dashboard" },
      { label: "Records", hint: "Certificates", to: "/certificates" },
      { label: "Sign in", hint: "Account", to: "/signin" },
    ];
    TRACKS.forEach((track) => {
      base.push({ label: track.title, hint: "Course", to: `/tracks/${track.slug}` });
    });
    AGENTS.forEach((agent) => {
      base.push({ label: agent.name, hint: agent.role, to: `/agents?agent=${agent.id}` });
    });
    TASKS.forEach((task) => {
      base.push({ label: task.title, hint: "Lab task", to: `/lab?task=${task.id}` });
    });
    const needle = query.trim().toLowerCase();
    return needle ? base.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(needle)) : base;
  }, [query]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function go(to) {
    navigate(to);
    onClose();
  }

  return (
    <div className="palette-back" onClick={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Jump to a course, agent, or lab"
          onKeyDown={(event) => {
            if (event.key === "Enter" && items[0]) go(items[0].to);
          }}
        />
        <ul>
          {items.slice(0, 8).map((item) => (
            <li key={item.to + item.label}>
              <button type="button" onClick={() => go(item.to)}>
                <span>{item.label}</span>
                <em>{item.hint}</em>
              </button>
            </li>
          ))}
          {!items.length && (
            <li className="muted empty-note">Nothing matches that.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
