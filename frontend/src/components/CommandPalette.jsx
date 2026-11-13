import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrack } from "../data/curriculum";
import { TASKS } from "../data/lab";

export default function CommandPalette({ activeCourse, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const track = getTrack(activeCourse);

  const items = useMemo(() => {
    const base = [
      { label: "Home", hint: "Academy", to: "/" },
      { label: track ? "Switch course" : "Choose a course", hint: "Course selection", to: "/tracks" },
      { label: "Sign in", hint: "Account", to: "/signin" },
    ];
    if (track) {
      base.push(
        { label: track.title, hint: "My selected course", to: `/tracks/${track.slug}` },
        { label: "My progress", hint: track.title, to: "/dashboard" },
        { label: `${track.assistant.name} · Course AI`, hint: track.assistant.role, to: "/agents" },
        { label: "Developer studio", hint: "Python · source · Actions", to: "/studio" },
      );
      if (track.slug === "data-analytics") {
        base.push({ label: "SQL lab", hint: "Practice", to: "/lab" });
        TASKS.forEach((task) => {
          base.push({ label: task.title, hint: "SQL lab task", to: `/lab?task=${task.id}` });
        });
      }
      base.push({ label: "Records", hint: track.title, to: "/certificates" });
      track.modules.forEach((module, index) => {
        const hint = module.tools?.slice(0, 3).join(" · ") || track.title;
        base.push({
          label: module.title,
          hint: `Module ${index + 1} · ${hint}`,
          to: `/learn/${track.slug}/${index + 1}`,
        });
      });
    }
    const needle = query.trim().toLowerCase();
    return needle ? base.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(needle)) : base;
  }, [query, track]);

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
          placeholder={track ? `Jump to a ${track.title} module or tool` : "Choose your course"}
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
