/** Only modules with published lessons are marked live; the rest are mapped. */

const planned = (title, points) => ({
  title,
  status: "planned",
  points,
});

export const TRACKS = [
  {
    slug: "data-analytics",
    index: "01",
    title: "Data Analytics",
    accent: "gold",
    kicker: "Decisions from tables",
    summary:
      "Go from spreadsheets to SQL, visual stories, and an analytics portfolio. The SQL lab is the first live classroom.",
    path: "Mapped as a foundation path",
    modules: [
      planned("Intro & careers", ["How analytics teams work", "The questions this track trains", "A portfolio that reads as proof"]),
      planned("Excel fundamentals", ["Clean ranges", "Lookups", "A first dashboard instinct"]),
      planned("Advanced Excel & dashboards", ["Pivot tables", "Controls", "A story a manager can scan"]),
      {
        title: "SQL fundamentals",
        status: "live",
        points: ["SELECT and WHERE", "Joins", "GROUP BY and HAVING"],
        lesson: {
          title: "SQL Fundamentals: SELECT, WHERE, JOIN, GROUP BY",
          sections: [
            {
              h: "Simple idea",
              t: "A table is a spreadsheet with rules. SELECT picks columns, WHERE keeps rows, and ORDER BY sorts what remains.",
            },
            {
              h: "Joins",
              t: "JOIN combines rows from two tables where a key matches. orders.customer_id = customers.id attaches each order to the person who placed it.",
            },
            {
              h: "Aggregation",
              t: "GROUP BY collapses rows into groups. SUM, COUNT, and AVG summarise each group. HAVING filters groups after the summary exists.",
            },
            {
              h: "Check yourself",
              t: "Why does WHERE not work on SUM(amount)? WHERE runs before grouping. Filter the summary with HAVING.",
            },
          ],
          sources: [
            { title: "SQLite SELECT documentation", url: "https://www.sqlite.org/lang_select.html" },
            { title: "PostgreSQL SELECT documentation", url: "https://www.postgresql.org/docs/current/sql-select.html" },
          ],
        },
      },
      planned("Advanced SQL", ["Window functions", "CTEs", "Reading a query plan in plain language"]),
      planned("Python fundamentals", ["Syntax you will actually reuse", "Functions", "Reading errors"]),
      planned("NumPy & Pandas, EDA", ["Frames", "Missing data", "The first questions to ask a table"]),
      planned("Statistics for analytics", ["Distributions", "Uncertainty", "Claims you can defend"]),
      planned("Visualization", ["Matplotlib, Seaborn, Plotly", "Scales", "Charts that answer one question"]),
      planned("Power BI", ["Model", "Measures", "A page someone can filter"]),
      planned("Tableau", ["Marks", "Level of detail", "A narrative dashboard"]),
      planned("BI, KPIs & storytelling", ["A metric with a definition", "A decision the chart changes"]),
      planned("AI-assisted analytics", ["Where an agent helps", "Where you still check the number"]),
      planned("Portfolio & interview prep", ["Three projects", "A walkthrough you can say out loud"]),
    ],
  },
  {
    slug: "data-science",
    index: "02",
    title: "Data Science",
    accent: "mint",
    kicker: "Models with a question",
    summary:
      "Formulate a problem, build a model, and explain what it is allowed to decide. From inference through a small deployment.",
    path: "Mapped as a practitioner path",
    modules: [
      "Foundations & problem formulation",
      "Python for DS",
      "NumPy, Pandas, EDA",
      "Probability & inference",
      "Linear algebra & calculus",
      "Visualization & storytelling",
      "Feature engineering",
      "Supervised learning",
      "Unsupervised learning",
      "Model evaluation",
      "Tuning, pipelines, leakage",
      "Time series",
      "NLP",
      "Deep learning",
      "Explainability & fairness",
      "Deployment (FastAPI/Flask)",
      "MLOps",
      "Research methods & interviews",
    ].map((title) =>
      planned(title, ["Concept", "A worked example", "A check you can grade yourself on"]),
    ),
  },
  {
    slug: "data-engineering",
    index: "03",
    title: "Data Engineering",
    accent: "blue",
    kicker: "Pipelines that keep their promises",
    summary:
      "Move data from sources into warehouses and streams, with quality checks and a deploy path you can explain.",
    path: "Mapped as a systems path",
    modules: [
      "Fundamentals & architecture",
      "Python for pipelines",
      "SQL & relational design",
      "PostgreSQL, MySQL, NoSQL",
      "Linux, Git, workflows",
      "Data formats",
      "ETL/ELT",
      "REST API ingestion",
      "Warehousing & dimensional modeling",
      "Lakes & lakehouses",
      "Spark/PySpark",
      "Airflow",
      "Streaming & Kafka",
      "Cloud data engineering",
      "Data quality & observability",
      "Docker & CI/CD",
      "Security & governance",
      "Optimization & interviews",
    ].map((title) =>
      planned(title, ["The shape of the system", "One concrete pattern", "A failure mode to watch"]),
    ),
  },
  {
    slug: "ai-engineering",
    index: "04",
    title: "AI & Generative AI Engineering",
    accent: "rose",
    kicker: "Agents, with the guardrails visible",
    summary:
      "Build with models, retrieval, and tool-calling agents. The signature stretch is agentic AI: planning, tools, and evaluation.",
    path: "Mapped as the agent path",
    signature: true,
    modules: [
      "AI/ML/DL/GenAI foundations",
      "Python for AI",
      "NumPy, Pandas, data prep",
      "ML & DL fundamentals",
      "Transformers & attention",
      "LLM concepts",
      "Prompting & tool calling",
      "Model APIs & open models",
      "Hugging Face",
      "Embeddings & vector DBs",
      "RAG",
      "Multimodal AI",
      "LLM evaluation",
      "Fine-tuning (LoRA/QLoRA)",
      "App development",
      "Agentic AI",
      "AI security",
      "LLMOps",
      "Deployment",
      "Portfolio & interviews",
    ].map((title) =>
      planned(
        title,
        title === "Agentic AI"
          ? ["A loop that can stop", "Tools with narrow permissions", "A trace you can audit"]
          : ["The idea in one paragraph", "A build step", "How you would test it"],
      ),
    ),
  },
  {
    slug: "mern-stack",
    index: "05",
    title: "MERN Stack Development",
    accent: "violet",
    kicker: "Full-stack products, end to end",
    summary:
      "Build and ship web apps with MongoDB, Express, React, and Node.js, from API design to deployment.",
    path: "Mapped as a full-stack development path",
    modules: [
      "Web foundations: HTML, CSS & JavaScript",
      "Modern JavaScript & TypeScript",
      "React fundamentals",
      "Components, state & hooks",
      "Routing, forms & accessibility",
      "Node.js fundamentals",
      "Express APIs & middleware",
      "MongoDB & data modeling",
      "Authentication & authorization",
      "Testing full-stack applications",
      "Deployment, CI/CD & monitoring",
      "Portfolio project & interview prep",
    ].map((title) =>
      planned(title, ["A practical concept", "A build step", "A way to test your work"]),
    ),
  },
  {
    slug: "flutter-development",
    index: "06",
    title: "Flutter App Development",
    accent: "blue",
    kicker: "One codebase, thoughtful interfaces",
    summary:
      "Learn Dart and Flutter to create responsive mobile apps, connect services, and prepare a release.",
    path: "Mapped as a mobile development path",
    modules: [
      "Dart language foundations",
      "Flutter widgets & layouts",
      "Responsive UI & theming",
      "Navigation, forms & validation",
      "State management",
      "Networking & REST APIs",
      "Local storage & persistence",
      "Firebase services",
      "Testing & debugging",
      "Accessibility & performance",
      "App publishing & release",
      "Portfolio app & interview prep",
    ].map((title) =>
      planned(title, ["A mobile app pattern", "A guided implementation", "A quality check"]),
    ),
  },
  {
    slug: "business-analyst",
    index: "07",
    title: "Business Analyst",
    accent: "mint",
    kicker: "Turn ambiguous asks into clear outcomes",
    summary:
      "Practice stakeholder discovery, process mapping, requirements, data-informed decisions, and delivery.",
    path: "Mapped as a business analysis path",
    modules: [
      "Business analysis foundations",
      "Stakeholders & discovery",
      "Requirements elicitation",
      "User stories & acceptance criteria",
      "Process mapping & improvement",
      "SQL & spreadsheet analysis",
      "Dashboards, KPIs & reporting",
      "Agile delivery & backlog management",
      "Wireframes & prototyping",
      "UAT, risks & traceability",
      "Business case & recommendations",
      "Portfolio & interview preparation",
    ].map((title) =>
      planned(title, ["A workplace scenario", "A useful artifact", "A review checklist"]),
    ),
  },
  {
    slug: "cloud-devops",
    index: "08",
    title: "Cloud & DevOps",
    accent: "rose",
    kicker: "Reliable software from commit to cloud",
    summary:
      "Build practical foundations in Linux, containers, cloud services, delivery pipelines, and observability.",
    path: "Mapped as a cloud operations path",
    modules: [
      "Cloud & DevOps foundations",
      "Linux, shell & networking",
      "Git collaboration workflows",
      "Containers with Docker",
      "Cloud concepts & architecture",
      "Infrastructure as code",
      "CI/CD pipelines",
      "Kubernetes fundamentals",
      "Configuration & secrets management",
      "Monitoring & observability",
      "Reliability, cost & security basics",
      "Portfolio deployment & interview prep",
    ].map((title) =>
      planned(title, ["A system concept", "A hands-on workflow", "A reliability check"]),
    ),
  },
  {
    slug: "ui-ux-design",
    index: "09",
    title: "UI/UX Design",
    accent: "coral",
    kicker: "Design experiences around real people",
    summary:
      "Move from user research and information architecture to prototyping, usability testing, and handoff.",
    path: "Mapped as a product design path",
    modules: [
      "Design foundations & visual language",
      "User research & interview practice",
      "Personas, journeys & problem framing",
      "Information architecture",
      "Wireframing & interaction design",
      "Visual design & design systems",
      "Prototyping in Figma",
      "Usability testing & iteration",
      "Responsive & accessible design",
      "Developer handoff & collaboration",
      "Case study storytelling",
      "Portfolio & interview preparation",
    ].map((title) =>
      planned(title, ["A user-centered principle", "A design artifact", "A feedback loop"]),
    ),
  },
  {
    slug: "cybersecurity",
    index: "10",
    title: "Cybersecurity Foundations",
    accent: "gold",
    kicker: "Build safer systems by design",
    summary:
      "Explore security principles, risk, defensive operations, identity, and incident response through safe practice.",
    path: "Mapped as a defensive security path",
    modules: [
      "Security principles & risk",
      "Networking concepts for defenders",
      "Operating system security",
      "Identity & access management",
      "Secure configuration & hardening",
      "Threat modeling & secure design",
      "Security monitoring foundations",
      "Vulnerability management",
      "Incident response & recovery",
      "Cloud security fundamentals",
      "Governance, privacy & compliance",
      "Defensive portfolio & interview prep",
    ].map((title) =>
      planned(title, ["A defensive concept", "A safe scenario", "A mitigation to explain"]),
    ),
  },
];

export const AGENTS = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Curriculum agent",
    tint: "gold",
    brief: "Reads your progress and points at the next honest step.",
  },
  {
    id: "mira",
    name: "Mira",
    role: "Tutor agent",
    tint: "mint",
    brief: "Explains the live lesson in plain language, then asks you to try it.",
  },
  {
    id: "quill",
    name: "Quill",
    role: "Lab coach",
    tint: "blue",
    brief: "Looks at your SQL, gives a hint, and will not hand you the query.",
  },
  {
    id: "vega",
    name: "Vega",
    role: "Interviewer",
    tint: "rose",
    brief: "Asks one question at a time, the way a hiring loop actually feels.",
  },
  {
    id: "herald",
    name: "Herald",
    role: "Records agent",
    tint: "gold",
    brief: "Explains what still stands between you and a completion record.",
  },
];

export function getTrack(slug) {
  return TRACKS.find((track) => track.slug === slug);
}

export function moduleCount() {
  return TRACKS.reduce((sum, track) => sum + track.modules.length, 0);
}

export function liveLessons() {
  const list = [];
  for (const track of TRACKS) {
    track.modules.forEach((mod, index) => {
      if (mod.status === "live") {
        list.push({ track, mod, n: index + 1 });
      }
    });
  }
  return list;
}
