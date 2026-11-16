const diagrams = {
  "data-analytics": {
    title: "ANALYTICS WORKFLOW",
    stages: [["SOURCES", "Sheets · SQL"], ["ANALYZE", "Python · Models"], ["INSIGHTS", "BI · Decisions"]],
    accent: "#56e1ff",
    glyphs: ["pipeline", "chart", "chart"],
  },
  "data-science": {
    title: "MODEL DEVELOPMENT",
    stages: [["DATA", "Explore · Clean"], ["TRAIN", "Features · Models"], ["EVALUATE", "Metrics · Deploy"]],
    accent: "#80f0d7",
    glyphs: ["chart", "model", "chart"],
  },
  "data-engineering": {
    title: "DATA PLATFORM",
    stages: [["INGEST", "Batch · Streams"], ["TRANSFORM", "dbt · Spark"], ["WAREHOUSE", "Model · Serve"]],
    accent: "#82c5ff",
    glyphs: ["pipeline", "pipeline", "pipeline"],
  },
  "ai-engineering": {
    title: "AI APPLICATION",
    stages: [["CONTEXT", "Sources · Data"], ["RETRIEVE", "RAG · Tools"], ["GENERATE", "LLM · Evaluate"]],
    accent: "#b9a7ff",
    glyphs: ["pipeline", "network", "model"],
  },
  "mern-stack": {
    title: "FULL-STACK REQUEST",
    stages: [["REACT UI", "Views · State"], ["NODE API", "Routes · Logic"], ["DATABASE", "Mongo · Data"]],
    accent: "#72e8d2",
    glyphs: ["code", "network", "pipeline"],
  },
  "flutter-development": {
    title: "MOBILE APP FLOW",
    stages: [["SCREENS", "Flutter · UI"], ["APP STATE", "Dart · Logic"], ["DEVICE", "Build · Ship"]],
    accent: "#77ceff",
    glyphs: ["mobile", "code", "mobile"],
  },
  "business-analyst": {
    title: "DISCOVERY TO VALUE",
    stages: [["DISCOVER", "People · Needs"], ["DEFINE", "Process · Scope"], ["DELIVER", "Outcomes · Value"]],
    accent: "#ffc27d",
    glyphs: ["brief", "chart", "brief"],
  },
  "cloud-devops": {
    title: "CLOUD DELIVERY",
    stages: [["SOURCE", "Git · Review"], ["PIPELINE", "Build · Test"], ["CLOUD", "Deploy · Observe"]],
    accent: "#ff9dc3",
    glyphs: ["code", "pipeline", "cloud"],
  },
  "ui-ux-design": {
    title: "DESIGN PROCESS",
    stages: [["RESEARCH", "Users · Needs"], ["PROTOTYPE", "Flows · Frames"], ["VALIDATE", "Test · Refine"]],
    accent: "#f0aaff",
    glyphs: ["brief", "design", "chart"],
  },
  cybersecurity: {
    title: "DEFENSIVE SECURITY",
    stages: [["ASSETS", "Systems · Risk"], ["PROTECT", "Controls · Access"], ["DETECT", "Monitor · Respond"]],
    accent: "#ff9b9b",
    glyphs: ["network", "shield", "shield"],
  },
};

function StageGlyph({ type, x, y, color }) {
  if (type === "chart") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12V2M1 12h16M4 10V7h3v3M10 10V4h3v6" /></g>;
  }
  if (type === "model") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2"><path d="M2 3h4v4H2zM12 1h4v4h-4zM7 11h4v4H7z" /><path d="m6 5 6-2M5 7l4 4m3-4-3 4" /></g>;
  }
  if (type === "pipeline") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"><rect x="1" y="2" width="5" height="4" rx="1" /><rect x="11" y="2" width="5" height="4" rx="1" /><rect x="6" y="11" width="5" height="4" rx="1" /><path d="M6 4h5M13 6v3H8v2" /></g>;
  }
  if (type === "network") {
    return <g transform={`translate(${x} ${y})`} fill={color}><circle cx="2" cy="8" r="2" /><circle cx="9" cy="2" r="2" /><circle cx="16" cy="8" r="2" /><circle cx="9" cy="14" r="2" /><path d="m3.5 6.7 4-3.3m3 0 4 3.3m0 2.6-4 3.3m-3 0-4-3.3" stroke={color} strokeWidth="1" fill="none" /></g>;
  }
  if (type === "code") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 2-5 5 5 5m6-10 5 5-5 5m-2-9-2 8" /></g>;
  }
  if (type === "mobile") {
    return <g transform={`translate(${x + 3} ${y - 1})`} fill="none" stroke={color} strokeWidth="1.2"><rect x="2" y="1" width="11" height="17" rx="2" /><path d="M5 4h5M6 15h3" /></g>;
  }
  if (type === "brief") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"><rect x="1" y="4" width="16" height="11" rx="2" /><path d="M6 4V2h6v2M1 8h16M7 8v2h4V8" /></g>;
  }
  if (type === "cloud") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h11a3 3 0 0 0 .4-6A5 5 0 0 0 6 5.5 3.4 3.4 0 0 0 4 12Z" /><path d="m8 9 2 2 4-4" /></g>;
  }
  if (type === "design") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 12 9-9 5 5-9 9H2zM8 6l5 5M2 17l5-1" /></g>;
  }
  if (type === "check") {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7" /><path d="m5.5 9 2.3 2.3 4.7-4.7" /></g>;
  }
  return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1 16 4v5c0 4.5-2.8 7.4-7 9-4.2-1.6-7-4.5-7-9V4z" /><path d="m5.5 9 2.3 2.3 4.7-4.7" /></g>;
}

export default function CourseArtwork({ slug }) {
  const diagram = diagrams[slug] || diagrams["data-analytics"];
  const xPositions = [14, 108, 202];

  return (
    <svg
      className="course-art-diagram"
      viewBox="0 0 290 142"
      role="img"
      aria-label={`${diagram.title}: ${diagram.stages.map(([label, detail]) => `${label}, ${detail}`).join("; ")}`}
      style={{ "--diagram-accent": diagram.accent }}
    >
      <defs>
        <linearGradient id={`art-wash-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={diagram.accent} stopOpacity="0.13" />
          <stop offset="1" stopColor="#061326" stopOpacity="0" />
        </linearGradient>
        <filter id={`art-glow-${slug}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="290" height="142" rx="18" fill={`url(#art-wash-${slug})`} />
      <g className="course-art-grid" stroke="white" strokeOpacity="0.055" strokeWidth="0.6">
        <path d="M0 28.5h290M0 56.5h290M0 84.5h290M0 112.5h290" />
        <path d="M29.5 0v142M58.5 0v142M87.5 0v142M116.5 0v142M145.5 0v142M174.5 0v142M203.5 0v142M232.5 0v142M261.5 0v142" />
      </g>
      <text x="14" y="21" className="course-art-title">{diagram.title}</text>
      <g className="course-art-connections" fill="none" stroke={diagram.accent} strokeOpacity="0.72" strokeWidth="1.15">
        <path d="M85 76h20m74 0h20" />
        <path d="m101 72 4 4-4 4m74-8 4 4-4 4" />
      </g>
      {[0, 1, 2].map((index) => {
        const [label, detail] = diagram.stages[index];
        const x = xPositions[index];
        return (
          <g key={label}>
            <rect className="course-art-node" x={x} y="49" width="74" height="55" rx="10" />
            <circle
              className="course-art-node-light"
              cx={x + 12}
              cy="62"
              r="2.3"
              fill={diagram.accent}
              filter={`url(#art-glow-${slug})`}
              style={{ "--art-delay": `${index * 220}ms` }}
            />
            <StageGlyph type={diagram.glyphs[index]} x={x + 48} y={55} color={diagram.accent} />
            <text x={x + 9} y="78" className="course-art-stage">{label}</text>
            <text x={x + 9} y="92" className="course-art-detail">{detail}</text>
          </g>
        );
      })}
      <text x="14" y="126" className="course-art-footnote">01  /  LEARN · BUILD · APPLY</text>
      <circle cx="270" cy="124" r="2.5" fill={diagram.accent} />
    </svg>
  );
}
