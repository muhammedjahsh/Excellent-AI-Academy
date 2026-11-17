const iconShapes = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  course: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 6h13M8 3v3" /></>,
  switch: <><path d="M4 7h15l-3-3M20 17H5l3 3" /><path d="M19 7v4M5 17v-4" /></>,
  lab: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 15h8" /></>,
  studio: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
  ai: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z" /></>,
  bot: <><circle cx="12" cy="3.5" r="1.25" /><path d="M12 4.75V7M5 11H3.5v4H5m14-4h1.5v4H19" /><rect x="5" y="7" width="14" height="13" rx="4" /><path d="M9 12h.01M15 12h.01M9.5 16h5" /></>,
  progress: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
  records: <><path d="M6 3h12v18l-6-3-6 3z" /><path d="m9 10 2 2 4-4" /></>,
  payment: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  shield: <><path d="M12 3 20 6v5c0 5-3.2 8-8 10-4.8-2-8-5-8-10V6z" /><path d="m8.5 12 2.3 2.3 4.7-4.8" /></>,
  analytics: <><path d="M4 20V4M4 20h17" /><path d="M8 16v-4h3v4M14 16V8h3v8" /></>,
  science: <><circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="9" ry="4" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" /></>,
  engineering: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 7.5 11 16M17 7.5 13 16M7 6h10" /></>,
  sparkle: <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3z" /></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
  phone: <><rect x="6" y="2.5" width="12" height="19" rx="2" /><path d="M10 18.5h4" /></>,
  business: <><path d="M3 20h18M5 17V9h4v8M10 17V4h4v13M15 17v-6h4v6" /></>,
  cloud: <><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 8.5 4.8 4.8 0 0 0 7 18Z" /><path d="m9 14 2 2 4-4" /></>,
  design: <><path d="m4 16 11-11 5 5L9 21H4z" /><path d="m13 7 5 5M4 21l5-1" /></>,
  security: <><path d="M12 3 20 6v5c0 5-3.2 8-8 10-4.8-2-8-5-8-10V6z" /><path d="M9 12h6M12 9v6" /></>,
};

export function courseIcon(slug) {
  return ({
    "data-analytics": "analytics",
    "data-science": "science",
    "data-engineering": "engineering",
    "ai-engineering": "sparkle",
    "mern-stack": "code",
    "flutter-development": "phone",
    "business-analyst": "business",
    "cloud-devops": "cloud",
    "ui-ux-design": "design",
    cybersecurity: "security",
  })[slug] || "course";
}

export default function Icon({ name = "course", size = 20, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconShapes[name] || iconShapes.course}
    </svg>
  );
}
