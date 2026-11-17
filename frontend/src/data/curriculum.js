/** Only modules with published lessons are marked live; the rest are mapped. */

const planned = (title, points) => ({
  title,
  status: "planned",
  points,
});

const analyticsModule = ({ title, tools, chapters, points, hours, project, challenge }) => ({
  ...planned(title, points),
  tools,
  chapters: chapters.map((chapter) =>
    typeof chapter === "string" ? { title: chapter, level: "core" } : chapter,
  ),
  hours,
  project,
  challenge,
});

const COURSE_TRACKS = [
  {
    slug: "data-analytics",
    index: "01",
    title: "Data Analytics",
    accent: "gold",
    kicker: "Decisions from tables",
    summary:
      "Build an end-to-end analytics toolkit across spreadsheets, databases, programming, BI, cloud warehouses, data engineering, and AI-assisted analysis.",
    path: "Seven tool-based modules · beginner to advanced",
    modules: [
      analyticsModule({
        title: "Spreadsheets",
        tools: ["Microsoft Excel", "Google Sheets"],
        chapters: [
          "Workbook structure, tables, and data types",
          "Sorting, filtering, and data validation",
          "Core formulas and relative vs. absolute references",
          "Conditional logic with IF, IFS, AND, and OR",
          "Lookups with XLOOKUP, INDEX/MATCH, and Sheets lookup functions",
          "Text, date, and array formulas",
          "Cleaning messy data and handling duplicates",
          "PivotTables, pivot charts, and slicers",
          "Charts, conditional formatting, and dashboard layout",
          { title: "Power Query and repeatable data preparation", level: "advanced" },
          { title: "Advanced dynamic arrays, LAMBDA, and named functions", level: "advanced" },
          { title: "Spreadsheet performance, auditability, and error checks", level: "advanced" },
          { title: "Automating workflows with Office Scripts and Apps Script", level: "advanced" },
        ],
        points: ["Clean and transform business data", "Build formulas and pivot analyses", "Publish a decision-ready spreadsheet dashboard"],
        hours: 18,
        project: "Create a sales performance workbook with a refreshable data model, KPI dashboard, and audit checks.",
        challenge: "Reconcile two inconsistent monthly sales exports and explain every transformation.",
      }),
      {
        ...analyticsModule({
          title: "Query and databases",
          tools: ["PostgreSQL", "MySQL", "SQL Server"],
          chapters: [
            "Relational database concepts, tables, keys, and relationships",
            "SELECT, aliases, expressions, and DISTINCT",
            "Filtering, NULL handling, sorting, and pagination",
            "Joins: inner, outer, self, and many-to-many",
            "Aggregation, GROUP BY, and HAVING",
            "CASE expressions and conditional aggregation",
            "Subqueries and correlated queries",
            "Common table expressions and readable query structure",
            "Window functions, ranking, and rolling calculations",
            { title: "Set operations, recursive CTEs, and advanced query patterns", level: "advanced" },
            { title: "Indexes, query plans, and performance tuning", level: "advanced" },
            { title: "Transactions, isolation, and safe analytical workflows", level: "advanced" },
            { title: "PostgreSQL, MySQL, and SQL Server dialect differences", level: "advanced" },
          ],
          points: ["Query relational data with SQL", "Combine and summarize multiple tables", "Write portable, efficient analytical queries"],
          hours: 24,
          project: "Build a customer and revenue analysis using joins, CTEs, and window functions.",
          challenge: "Find the drivers of a revenue drop and support your conclusion with reproducible SQL.",
        }),
        status: "live",
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
      analyticsModule({
        title: "Programming",
        tools: ["Python", "R"],
        chapters: [
          "Analytics notebooks and reproducible workflows",
          "Python and R language essentials for analysts",
          "Importing CSV, Excel, JSON, and database data",
          "Data frames with pandas and dplyr",
          "Filtering, reshaping, joining, and aggregating data",
          "Missing values, outliers, and data quality checks",
          "Exploratory analysis and descriptive statistics",
          "Functions, reusable scripts, and package basics",
          { title: "Vectorization, efficient transformations, and profiling", level: "advanced" },
          { title: "Statistical analysis with SciPy/statsmodels and R modeling tools", level: "advanced" },
          { title: "Testing analytical code and structuring maintainable projects", level: "advanced" },
          { title: "Working with APIs, larger-than-memory data, and scheduled reports", level: "advanced" },
        ],
        points: ["Analyze data with Python and R", "Automate cleaning and repeatable analysis", "Communicate findings with reproducible notebooks"],
        hours: 26,
        project: "Deliver a reproducible notebook that cleans, analyzes, and explains a public dataset.",
        challenge: "Recreate a key finding in both Python and R and compare the results.",
      }),
      analyticsModule({
        title: "BI and visualization",
        tools: ["Power BI", "Tableau", "Looker", "Zoho Analytics", "Qlik", "Metabase", "Apache Superset"],
        chapters: [
          "Choosing charts and designing for the question",
          "Visual perception, color, accessibility, and annotation",
          "KPI definitions, semantic models, and dimensional modeling",
          "Power BI: Power Query, relationships, and report design",
          "Power BI: DAX measures, filter context, and time intelligence",
          "Tableau: worksheets, marks, filters, and dashboard actions",
          "Tableau: calculations, parameters, and level of detail",
          "Looker explores, LookML concepts, and governed metrics",
          "Zoho Analytics, Qlik, Metabase, and Superset workflows",
          "Dashboard navigation, interaction, and mobile layouts",
          { title: "Advanced DAX, calculation groups, and model optimization", level: "advanced" },
          { title: "Advanced Tableau LOD, performance, and dashboard storytelling", level: "advanced" },
          { title: "Embedded analytics, row-level security, and governed self-service BI", level: "advanced" },
        ],
        points: ["Choose clear visual encodings", "Model and publish interactive BI reports", "Define consistent KPIs and tell a decision-focused story"],
        hours: 28,
        project: "Create an executive dashboard with a documented metric layer and role-aware views.",
        challenge: "Turn an ambiguous stakeholder request into a measurable question and a dashboard that answers it.",
      }),
      analyticsModule({
        title: "Cloud data warehouses",
        tools: ["Snowflake", "BigQuery", "Amazon Redshift", "Databricks", "Microsoft Fabric"],
        chapters: [
          "Warehouse, lake, and lakehouse architecture",
          "Cloud storage, compute, and separation of concerns",
          "Loading data and warehouse table formats",
          "Snowflake databases, warehouses, stages, and streams",
          "BigQuery datasets, partitioning, and cost-aware SQL",
          "Redshift clusters, distribution, and sort keys",
          "Databricks lakehouse, Delta tables, and SQL analytics",
          "Microsoft Fabric OneLake, Warehouse, and Lakehouse",
          "Access control, roles, and sensitive data handling",
          { title: "Incremental models, change data capture, and streaming ingestion", level: "advanced" },
          { title: "Partitioning, clustering, caching, and workload optimization", level: "advanced" },
          { title: "FinOps: cost monitoring, quotas, and workload governance", level: "advanced" },
          { title: "Cross-cloud architecture and warehouse migration planning", level: "advanced" },
        ],
        points: ["Understand modern warehouse architecture", "Query and organize cloud datasets", "Balance performance, governance, and cost"],
        hours: 22,
        project: "Design a cloud analytics warehouse and publish a cost-aware reporting dataset.",
        challenge: "Choose an appropriate platform and table layout for a growing, multi-year dataset.",
      }),
      analyticsModule({
        title: "Data engineering",
        tools: ["dbt", "Apache Airflow", "Apache Spark", "Fivetran", "Airbyte", "Git"],
        chapters: [
          "Analytics engineering and reliable data pipelines",
          "ELT patterns, source systems, and ingestion concepts",
          "Git basics: branches, commits, reviews, and collaboration",
          "dbt models, sources, tests, and documentation",
          "Transformations, snapshots, seeds, and incremental models",
          "Airflow DAGs, tasks, dependencies, and schedules",
          "Fivetran and Airbyte connectors and sync strategies",
          "Spark concepts and distributed data processing",
          "Data contracts, freshness, and quality monitoring",
          { title: "Advanced dbt macros, packages, and deployment environments", level: "advanced" },
          { title: "Airflow backfills, retries, sensors, and production operations", level: "advanced" },
          { title: "Spark partitioning, shuffles, and performance tuning", level: "advanced" },
          { title: "CI/CD, lineage, observability, and incident response", level: "advanced" },
        ],
        points: ["Build and version analytical transformations", "Orchestrate and monitor data workflows", "Validate data quality from source to dashboard"],
        hours: 24,
        project: "Build a version-controlled ELT pipeline with dbt tests, orchestration, and freshness checks.",
        challenge: "Recover a failed pipeline run without duplicating or silently dropping records.",
      }),
      analyticsModule({
        title: "AI-assisted analytics",
        tools: ["Copilot in Excel and Power BI", "Tableau AI", "Gemini in Looker", "Zia in Zoho Analytics"],
        chapters: [
          "Where AI assistants fit in an analytics workflow",
          "Writing prompts with context, constraints, and verifiable outputs",
          "Copilot in Excel: formula help, summaries, and analysis",
          "Copilot in Power BI: report questions and DAX assistance",
          "Tableau AI and natural-language analytics",
          "Gemini in Looker and conversational data exploration",
          "Zia in Zoho Analytics: queries, forecasts, and insights",
          "Using AI to draft SQL, Python, and documentation",
          "Fact-checking generated formulas, queries, and chart interpretations",
          { title: "Grounding, semantic context, and permission-aware AI analytics", level: "advanced" },
          { title: "Bias, privacy, prompt injection, and sensitive-data safeguards", level: "advanced" },
          { title: "Evaluating AI-generated analysis and measuring failure rates", level: "advanced" },
          { title: "Human review, audit trails, and responsible AI adoption", level: "advanced" },
        ],
        points: ["Use analytics copilots productively", "Verify AI-generated results before sharing", "Apply privacy, governance, and human-review safeguards"],
        hours: 16,
        project: "Create an AI-assisted analysis with a prompt log, independently verified results, and a risk review.",
        challenge: "Audit an AI-generated business insight and identify unsupported claims before it reaches a stakeholder.",
      }),
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

const COURSE_PROFILES = {
  "data-analytics": {
    assistant: {
      name: "Insight",
      tool: "Analytics Copilot",
      role: "Data analysis and BI tutor",
      prompts: ["Help me plan this course", "Explain the SQL module", "Suggest a portfolio project"],
    },
  },
  "data-science": {
    tools: [
      ["Python", "JupyterLab", "uv", "Polars", "DuckDB"],
      ["scikit-learn", "XGBoost", "LightGBM", "Optuna"],
      ["PyTorch", "Hugging Face Transformers", "PEFT"],
      ["MLflow", "Weights & Biases", "DVC", "Evidently AI"],
      ["SHAP", "Captum", "Fairlearn", "InterpretML"],
      ["FastAPI", "BentoML", "Docker", "Kubernetes"],
      ["Ray", "Feast", "Spark", "vLLM"],
    ],
    advanced: ["causal inference and experiment design", "foundation models and transfer learning", "reproducible, tracked experiments", "model calibration, uncertainty, and drift", "responsible AI, bias evaluation, and explainability"],
    aiModule: "AI-assisted data science",
    aiTools: ["Jupyter AI", "GitHub Copilot", "Hugging Face"],
    project: "Train, evaluate, explain, and serve a model with a reproducible experiment record.",
    challenge: "Compare a simple baseline with a tuned model and defend the trade-offs without data leakage.",
    assistant: { name: "Vector", tool: "Data Science Copilot", role: "Modeling, statistics, and experiment tutor", prompts: ["Help me plan this course", "Explain model evaluation", "Suggest a portfolio project"] },
  },
  "data-engineering": {
    tools: [
      ["Python", "SQL", "Git", "Docker"],
      ["dbt", "Dagster", "Apache Airflow", "dlt"],
      ["Apache Spark", "Kafka", "Flink", "Debezium"],
      ["Apache Iceberg", "Delta Lake", "Apache Hudi", "Trino"],
      ["Snowflake", "BigQuery", "Databricks", "Amazon Redshift"],
      ["Great Expectations", "Soda", "OpenLineage", "OpenTelemetry"],
      ["Terraform", "Kubernetes", "Argo CD", "GitHub Actions"],
    ],
    advanced: ["idempotency, replay, and exactly-once trade-offs", "lakehouse table formats and schema evolution", "stream processing, event time, and late data", "data contracts, lineage, and observability", "cost-aware distributed compute and workload isolation"],
    aiModule: "AI-assisted data engineering",
    aiTools: ["GitHub Copilot", "Amazon Q Developer", "Databricks Assistant"],
    project: "Build an observable batch-and-streaming data platform with quality gates and documented lineage.",
    challenge: "Design a replayable recovery plan for a late, duplicated, or malformed upstream data feed.",
    assistant: { name: "Pipeline", tool: "Data Pipeline Copilot", role: "Pipelines, orchestration, and data quality tutor", prompts: ["Help me plan this course", "Explain orchestration choices", "Suggest a portfolio project"] },
  },
  "ai-engineering": {
    tools: [
      ["Python", "PyTorch", "Hugging Face Transformers", "PEFT"],
      ["OpenAI API", "Anthropic API", "Gemini API", "LiteLLM"],
      ["LangGraph", "LlamaIndex", "DSPy", "PydanticAI"],
      ["Qdrant", "Weaviate", "Milvus", "pgvector"],
      ["vLLM", "Ollama", "llama.cpp", "Hugging Face TGI"],
      ["Ragas", "DeepEval", "Arize Phoenix", "OpenTelemetry"],
      ["Guardrails AI", "Presidio", "NeMo Guardrails", "Langfuse"],
    ],
    advanced: ["retrieval quality, hybrid search, and reranking", "agent state, bounded tools, and human approval", "offline evaluation, regression sets, and observability", "fine-tuning, quantization, and inference optimization", "privacy, prompt injection, and secure tool boundaries"],
    aiModule: "AI-assisted AI engineering",
    aiTools: ["Hugging Face Assistants", "GitHub Copilot", "LangGraph Studio"],
    project: "Ship an evaluated retrieval assistant with scoped tools, traceable sources, and a safety review.",
    challenge: "Improve a weak retrieval-and-answer pipeline using measured failure cases rather than prompt guessing.",
    assistant: { name: "Prompt", tool: "AI Engineering Copilot", role: "LLM, retrieval, and agent systems tutor", prompts: ["Help me plan this course", "Explain RAG evaluation", "Suggest a portfolio project"] },
  },
  "mern-stack": {
    tools: [
      ["TypeScript", "React", "Vite", "Next.js"],
      ["Node.js", "Express", "Fastify", "OpenAPI"],
      ["MongoDB Atlas", "PostgreSQL", "Prisma", "Drizzle ORM"],
      ["TanStack Query", "Zod", "tRPC", "React Hook Form"],
      ["Vitest", "Playwright", "Testing Library", "MSW"],
      ["Auth.js", "Better Auth", "WebAuthn", "OWASP ASVS"],
      ["Docker", "GitHub Actions", "Vercel", "OpenTelemetry"],
    ],
    advanced: ["server components, streaming, and cache invalidation", "typed API contracts and schema evolution", "database indexing, transactions, and query planning", "accessibility, performance budgets, and web vitals", "secure sessions, authorization, and supply-chain hygiene"],
    aiModule: "AI-assisted full-stack development",
    aiTools: ["GitHub Copilot", "Cursor", "v0"],
    project: "Ship a production-style full-stack application with typed APIs, accessibility, tests, and observability.",
    challenge: "Trace and fix a production-like performance or authorization issue with tests that prevent regressions.",
    assistant: { name: "Stack", tool: "Full-Stack Build Copilot", role: "React, APIs, databases, and testing tutor", prompts: ["Help me plan this course", "Explain API architecture", "Suggest a portfolio project"] },
  },
  "flutter-development": {
    tools: [
      ["Dart", "Flutter", "Material 3", "Cupertino"],
      ["Riverpod", "Bloc", "Freezed", "GoRouter"],
      ["Dio", "OpenAPI Generator", "Firebase", "Supabase"],
      ["Drift", "Isar", "SQLite", "Flutter Secure Storage"],
      ["Patrol", "integration_test", "Very Good CLI", "Melos"],
      ["Firebase App Distribution", "Fastlane", "Shorebird", "Codemagic"],
      ["Flutter DevTools", "Sentry", "Crashlytics", "Semantics"],
    ],
    advanced: ["offline-first sync, conflict resolution, and resilient networking", "app architecture, dependency injection, and modular packages", "rendering performance, isolates, and memory profiling", "accessibility, localization, and adaptive layouts", "release automation, staged rollout, and crash monitoring"],
    aiModule: "AI-assisted mobile development",
    aiTools: ["GitHub Copilot", "Gemini Code Assist", "Firebase AI Logic"],
    project: "Build and release an offline-capable Flutter app with secure auth, automated tests, and crash reporting.",
    challenge: "Make a network-dependent user journey robust to offline, retry, and duplicate-submit conditions.",
    assistant: { name: "Flutter", tool: "Mobile App Copilot", role: "Dart, Flutter architecture, and release tutor", prompts: ["Help me plan this course", "Explain app state choices", "Suggest a portfolio project"] },
  },
  "business-analyst": {
    tools: [
      ["Jira", "Confluence", "Jira Product Discovery", "Productboard"],
      ["Miro", "FigJam", "Lucidchart", "BPMN"],
      ["Excel", "Power BI", "Tableau", "SQL"],
      ["Figma", "Balsamiq", "Axure", "Mural"],
      ["Azure DevOps", "Jira", "Linear", "Aha!"],
      ["Copilot for Microsoft 365", "ChatGPT Enterprise", "Gemini", "Notion AI"],
      ["UAT plans", "Requirements traceability", "Process mining", "OKRs"],
    ],
    advanced: ["event storming and domain-driven discovery", "process mining and value-stream analysis", "outcome metrics, OKRs, and benefits realization", "AI-assisted research with evidence and privacy controls", "decision logs, change impact, and requirements traceability"],
    aiModule: "AI-assisted business analysis",
    aiTools: ["Copilot for Microsoft 365", "Miro AI", "Jira AI"],
    project: "Lead a discovery-to-delivery case: evidence, process model, prioritized requirements, and measurable outcomes.",
    challenge: "Resolve conflicting stakeholder needs into testable acceptance criteria and an explicit decision record.",
    assistant: { name: "Brief", tool: "Business Analysis Copilot", role: "Discovery, requirements, and process tutor", prompts: ["Help me plan this course", "Improve my user story", "Suggest a portfolio project"] },
  },
  "cloud-devops": {
    tools: [
      ["AWS", "Microsoft Azure", "Google Cloud", "Cloudflare"],
      ["Terraform", "OpenTofu", "Pulumi", "Crossplane"],
      ["Docker", "Kubernetes", "Helm", "Kustomize"],
      ["GitHub Actions", "GitLab CI", "Argo CD", "Tekton"],
      ["OpenTelemetry", "Prometheus", "Grafana", "Loki"],
      ["Vault", "External Secrets Operator", "SOPS", "Cloud KMS"],
      ["Kyverno", "OPA Gatekeeper", "Trivy", "Backstage"],
    ],
    advanced: ["GitOps reconciliation, progressive delivery, and rollback", "platform engineering, golden paths, and developer portals", "SLOs, error budgets, incident learning, and capacity planning", "policy as code, workload identity, and software supply chains", "FinOps, carbon-aware choices, and multi-cloud trade-offs"],
    aiModule: "AI-assisted cloud operations",
    aiTools: ["Amazon Q Developer", "GitHub Copilot", "Gemini Cloud Assist"],
    project: "Deploy a cloud-native service through a secure GitOps pipeline with SLOs, alerts, and cost controls.",
    challenge: "Respond to a simulated service degradation using evidence, safe rollback, and a blameless review.",
    assistant: { name: "SRE", tool: "Cloud Operations Copilot", role: "Cloud architecture, delivery, and reliability tutor", prompts: ["Help me plan this course", "Explain a deployment strategy", "Suggest a portfolio project"] },
  },
  "ui-ux-design": {
    tools: [
      ["Figma", "FigJam", "Variables", "Dev Mode"],
      ["Dovetail", "Maze", "Useberry", "Optimal Workshop"],
      ["WCAG 2.2", "Stark", "axe DevTools", "Lighthouse"],
      ["Tokens Studio", "Storybook", "Zeroheight", "Figma libraries"],
      ["Framer", "ProtoPie", "Rive", "Figma prototyping"],
      ["Miro AI", "Figma AI", "Adobe Firefly", "FigJam AI"],
      ["Lottie", "Chromatic", "Storybook test runner", "Design linting"],
    ],
    advanced: ["design tokens, theming, and multi-brand systems", "inclusive research, consent, and accessible prototypes", "AI-assisted ideation with provenance and human validation", "motion design, micro-interactions, and reduced-motion support", "design quality metrics, experimentation, and handoff automation"],
    aiModule: "AI-assisted product design",
    aiTools: ["Figma AI", "FigJam AI", "Adobe Firefly"],
    project: "Design, prototype, test, and hand off an accessible end-to-end product experience with a case study.",
    challenge: "Use research evidence to simplify a complex workflow and prove the improvement with usability testing.",
    assistant: { name: "Canvas", tool: "Product Design Copilot", role: "Research, interaction, and design systems tutor", prompts: ["Help me plan this course", "Review my design rationale", "Suggest a portfolio project"] },
  },
  cybersecurity: {
    tools: [
      ["NIST CSF 2.0", "CIS Controls", "MITRE ATT&CK", "OWASP ASVS"],
      ["Wireshark", "Zeek", "Suricata", "Security Onion"],
      ["Microsoft Sentinel", "Microsoft Defender XDR", "Splunk Enterprise Security", "Wazuh"],
      ["OpenSCAP", "CIS Benchmarks", "AWS Security Hub", "Microsoft Defender for Cloud"],
      ["Semgrep", "CodeQL", "Trivy", "Dependabot"],
      ["CrowdStrike Falcon", "Velociraptor", "Sysmon", "OSQuery"],
      ["OpenTelemetry", "Sigma", "YARA", "TheHive"],
    ],
    advanced: ["detection engineering, ATT&CK mapping, and false-positive tuning", "cloud identity, zero trust, and least-privilege review", "secure SDLC, SBOMs, and software supply-chain risk", "incident command, evidence handling, and recovery exercises", "security metrics, privacy impact, and control validation"],
    aiModule: "AI-assisted defensive security",
    aiTools: ["Microsoft Security Copilot", "GitHub Copilot Autofix", "Wazuh AI integrations"],
    project: "Create a defensive security program with threat model, prioritized controls, detections, and incident playbooks.",
    challenge: "Triage a simulated alert using only authorized evidence and document containment and recovery decisions.",
    assistant: { name: "Sentinel", tool: "Defensive Security Copilot", role: "Threat modeling, detection, and response tutor", prompts: ["Help me plan this course", "Explain a defensive control", "Suggest a portfolio project"] },
  },
};

const MODULE_PROJECT_IDEAS = {
  "data-analytics": [
    { title: "Phantom Metric Forensics", brief: "Trace a business metric that changed after a source export, using {topic} to find the exact transformation behind the discrepancy; deliver a reproducible reconciliation log." },
    { title: "Quiet-Signal Observatory", brief: "Build a way to surface a weak but consequential pattern in {topic} before it becomes obvious in a headline KPI; show the alert and its evidence." },
    { title: "Counterfactual Decision Room", brief: "Recreate a real planning decision with {topic}, change one assumption, and show how the recommended action shifts without hiding uncertainty." },
    { title: "Long-Tail Exception Atlas", brief: "Investigate rare records that ordinary summaries conceal in {topic}; deliver a small, explainable taxonomy of exceptions and their business impact." },
    { title: "One-Page Evidence Contract", brief: "Turn {topic} into a compact handoff another analyst can independently reproduce, including definitions, quality checks, and one decision the evidence supports." },
  ],
  "data-science": [
    { title: "The Missing-Week Observatory", brief: "Use {topic} to study a synthetic sensor network with irregular gaps, separating true events from collection failures and documenting uncertainty." },
    { title: "Model Autopsy Archive", brief: "Create a reproducible investigation of a model failure in {topic}, tracing it from a surprising prediction back to a testable cause." },
    { title: "Counterfactual Triage Desk", brief: "Prototype a {topic} workflow that compares plausible alternate outcomes for a high-stakes decision without presenting correlation as causation." },
    { title: "Drift Before Dawn", brief: "Build a small {topic} monitor for an emerging population shift, then specify when the evidence is too weak to trigger action." },
    { title: "The Uncertainty Receipt", brief: "Design a {topic} result card that exposes confidence, known blind spots, and the next measurement that would most reduce uncertainty." },
  ],
  "data-engineering": [
    { title: "Schema-Change Escape Room", brief: "Use {topic} to ingest a source that changes shape mid-run; make the pipeline detect, quarantine, and safely replay affected records." },
    { title: "The Backfill Ledger", brief: "Build a {topic} workflow for correcting a year of late-arriving events while proving that retries do not duplicate or erase facts." },
    { title: "Cold-Start Data Cooperative", brief: "Design a {topic} path for a new data source with no trusted history, including a quarantine lane and a measurable promotion rule." },
    { title: "Lineage Time Machine", brief: "Use {topic} to reconstruct which downstream outputs depend on one altered source field and produce a safe, ordered recovery plan." },
    { title: "The Budget-Aware Replay", brief: "Create a {topic} replay strategy that restores a delayed feed under a fixed compute budget and reports the freshness-versus-cost trade-off." },
  ],
  "ai-engineering": [
    { title: "Citation Fracture Lab", brief: "Use {topic} to build a test case where a plausible answer is unsupported by its sources, then make the failure visible and measurable." },
    { title: "The Permission-Bound Assistant", brief: "Prototype a {topic} workflow whose tools expose only a narrow, auditable action and require human approval at its riskiest boundary." },
    { title: "Dialect Drift Translator", brief: "Design a {topic} assistant for two specialized vocabularies and test whether it asks for clarification instead of confidently merging meanings." },
    { title: "Multimodal Evidence Trail", brief: "Build a {topic} demonstration that connects non-text input to a traceable answer while preserving source references and uncertainty." },
    { title: "The Regression Museum", brief: "Curate a small {topic} evaluation set from memorable failure cases and show how a proposed improvement changes both quality and risk." },
  ],
  "mern-stack": [
    { title: "The Borrowed-Device Handoff", brief: "Build a {topic} flow for a shared public device, making session ownership, safe handoff, and unsaved-work recovery explicit." },
    { title: "The Idempotent Promise", brief: "Create a {topic} feature where a double-click, retry, or stale tab cannot silently create duplicate real-world actions." },
    { title: "The Consent Receipt", brief: "Design a {topic} experience that records what a user agreed to, what changed later, and how the decision can be reviewed." },
    { title: "The Slow-Network Bazaar", brief: "Prototype a {topic} workflow that remains understandable through delayed responses, partial results, and a recoverable connection loss." },
    { title: "The Permission Maze", brief: "Use {topic} to model a multi-role workspace and demonstrate that a user cannot infer or change another role's private records." },
  ],
  "flutter-development": [
    { title: "The No-Signal Field Kit", brief: "Build a {topic} feature for a field worker who may be offline for a full shift, with queued actions and visible sync state." },
    { title: "The One-Handed Transit Flow", brief: "Prototype a {topic} task for someone in motion, then test reachability, interruption recovery, and accessible alternatives." },
    { title: "The Battery-Sparing Companion", brief: "Create a {topic} experience for a low-power device and document which background work can be deferred without losing user trust." },
    { title: "The Shared-Tablet Checkpoint", brief: "Design a {topic} flow for rotating users on one device, protecting local data and making account handoff unambiguous." },
    { title: "The Locale-Shift Journal", brief: "Use {topic} to handle a journey across time zones and language settings without corrupting dates, units, or saved progress." },
  ],
  "business-analyst": [
    { title: "The Invisible Queue", brief: "Use {topic} to uncover work that never appears in the official process map, then define evidence that would confirm the hidden wait." },
    { title: "The Conflicting-Clock Brief", brief: "Create a {topic} decision record for stakeholders who measure success on incompatible time horizons, with assumptions and trade-offs exposed." },
    { title: "The Exception-First Service Map", brief: "Model a {topic} service around its rare but costly exceptions rather than its happy path, then prioritize a measurable improvement." },
    { title: "The Reversible Decision Pack", brief: "Use {topic} to distinguish a reversible pilot from an irreversible commitment and specify a signal that should stop the work." },
    { title: "The Evidence-to-Backlog Bridge", brief: "Turn {topic} research into traceable, testable work while preserving links from each recommendation to its evidence and owner." },
  ],
  "cloud-devops": [
    { title: "The Midnight Region Loss", brief: "Use {topic} to rehearse losing one deployment region, including a safe failover, a cost boundary, and a tested return path." },
    { title: "The Expiring-Credential Drill", brief: "Build a {topic} exercise where credentials expire during a release and recovery does not require copying secrets into a build log." },
    { title: "The Carbon-and-Cost Scheduler", brief: "Design a {topic} workload policy that shifts flexible work against a fixed latency target, reporting both spend and energy trade-offs." },
    { title: "The Noisy-Alert Triage", brief: "Use {topic} to turn an alert storm into a short evidence-led incident timeline with one actionable signal and a rollback criterion." },
    { title: "The Rebuildable Platform Slice", brief: "Create a {topic} deployment slice that can be recreated from versioned inputs and prove recovery without relying on undocumented console state." },
  ],
  "ui-ux-design": [
    { title: "The Quiet-Route Finder", brief: "Use {topic} to help a sensory-sensitive visitor choose a route through a busy public space, with uncertainty and accessibility preferences visible." },
    { title: "The Consentful Research Loop", brief: "Design a {topic} research interaction that lets participants revise consent, skip sensitive questions, and see how their input is used." },
    { title: "The Interrupted-Journey Map", brief: "Prototype a {topic} task that can be paused and resumed across devices without forcing users to remember hidden progress." },
    { title: "The Low-Vision Contrast Audit", brief: "Create a {topic} artifact that reveals where color, density, or motion blocks a task and tests a non-visual alternative." },
    { title: "The Trust-Repair Prototype", brief: "Use {topic} to redesign a confusing error state so users understand what happened, what was saved, and how to recover safely." },
  ],
  cybersecurity: [
    { title: "The Canary-Account Timeline", brief: "Use {topic} with synthetic logs to reconstruct how a planted test identity moved through a defensive environment and which control should have interrupted it." },
    { title: "The Forgotten-Asset Census", brief: "Create a {topic} inventory exercise for a fictional organization and prioritize unknown assets by exposure and business impact." },
    { title: "The Evidence-Preserving Containment", brief: "Build a {topic} incident runbook that isolates a simulated compromised service while preserving a defensible evidence timeline." },
    { title: "The Policy-to-Packet Trace", brief: "Use {topic} to connect one written security control to a verifiable defensive signal and record where the control cannot be proven." },
    { title: "The Recovery-Without-Guessing Drill", brief: "Design a {topic} tabletop for restoring a fictional service from known-good inputs, with clear stop conditions and verification evidence." },
  ],
};

const COURSE_CAPSTONES = {
  "data-analytics": {
    title: "The Shadow Ledger: A neighborhood change observatory",
    brief: "Build an evidence trail from messy public-service and small-business data to a decision-ready view of how a neighborhood is changing. Integrate spreadsheet reconciliation, SQL analysis, reproducible code, governed BI, warehouse design, reliable pipelines, and a verified AI-assisted narrative.",
    deliverables: ["A documented, refreshable data pipeline and quality checks", "A metric dictionary with SQL and reproducible analysis", "A role-aware dashboard with a cost and privacy note", "A short decision brief that separates evidence from uncertainty"],
  },
  "data-science": {
    title: "The Missing-Week Observatory: Forecasting service pressure fairly",
    brief: "Create a reproducible early-warning study for a fictional city service whose demand shifts seasonally and whose sensor coverage is uneven. Connect problem framing, data preparation, inference, feature design, model comparison, time-series analysis, language signals, deep learning, fairness, explainability, deployment, and monitoring.",
    deliverables: ["A leakage-resistant experiment with a simple baseline", "A model card covering uncertainty, fairness, and known blind spots", "A small prediction service with drift checks", "A research note defending what the model should not decide"],
  },
  "data-engineering": {
    title: "The Black-Start Data Cooperative: Recoverable civic data exchange",
    brief: "Design a fictional multi-agency data platform that can recover after a source outage, schema change, and late event burst. Integrate architecture, ingestion, relational and non-relational stores, formats, transformation, orchestration, streaming, lakehouse and warehouse modeling, cloud operations, quality, governance, and optimization.",
    deliverables: ["A versioned batch-and-streaming architecture with lineage", "A replay and backfill plan proving idempotency", "Automated data contracts, freshness checks, and incident signals", "A recovery demo with an explicit compute-cost budget"],
  },
  "ai-engineering": {
    title: "The Evidence-Bound Public Service Navigator",
    brief: "Build a scoped assistant over fictional public-service documents that must cite current evidence, ask when policy is ambiguous, and hand off sensitive actions to a person. Integrate data preparation, model and prompt fundamentals, APIs, embeddings, retrieval, evaluation, fine-tuning choices, multimodal inputs, application design, bounded agents, security, operations, and deployment.",
    deliverables: ["A retrieval assistant with traceable citations and abstention behavior", "An evaluation set built from realistic failure cases", "A permission-limited tool flow with human approval", "A deployment and monitoring plan covering privacy and regressions"],
  },
  "mern-stack": {
    title: "The Repair Commons: A trusted neighborhood repair exchange",
    brief: "Ship a full-stack service where neighbors offer repair skills, coordinate shared tools, and record consent without exposing private contact details. Integrate accessible web foundations, typed React UI, routing and forms, Node and Express APIs, data modeling, authorization, testing, delivery, monitoring, and responsible AI assistance.",
    deliverables: ["A working responsive application with documented API contracts", "A role and privacy model exercised by automated tests", "A recoverable booking flow that handles retries and conflicts", "A deployable release with accessibility and performance evidence"],
  },
  "flutter-development": {
    title: "The Offline Field Atlas: A resilient community response app",
    brief: "Build a mobile field tool for a volunteer team working through intermittent connectivity, shared devices, and changing local conditions. Integrate Dart, Flutter UI, responsive design, navigation, state, APIs, offline persistence, Firebase services, testing, accessibility, performance, and release operations.",
    deliverables: ["An offline-first workflow with explicit sync and conflict states", "Secure shared-device handoff and local data handling", "Automated tests for interrupted and resumed tasks", "A staged release plan with accessibility and crash monitoring"],
  },
  "business-analyst": {
    title: "The Invisible Queue: Redesigning a delayed community service",
    brief: "Investigate a fictional service whose official process looks fast while applicants experience hidden waits and repeated requests. Integrate stakeholder discovery, elicitation, requirements, process analysis, SQL and spreadsheet evidence, KPI design, agile planning, prototyping, UAT, risk, and benefits measurement.",
    deliverables: ["A research-backed current and future state process map", "Traceable requirements and acceptance criteria", "A prototype and risk-based UAT plan", "A business case with measurable outcomes and a decision log"],
  },
  "cloud-devops": {
    title: "The Black-Sky Release Platform: A recoverable public alert service",
    brief: "Design a fictional public alert service that continues safely through a zone outage, noisy telemetry, and a compromised deployment credential. Integrate cloud architecture, Linux and networking, Git, containers, infrastructure as code, CI/CD, Kubernetes, secrets, observability, reliability, cost, security, and release practice.",
    deliverables: ["A reproducible, policy-checked deployment path", "A tested failover and rollback exercise with SLO evidence", "An alert and incident timeline with a blameless review", "A cost and least-privilege report for the platform"],
  },
  "ui-ux-design": {
    title: "The Quiet-Route Atlas: An accessible guide to overwhelming places",
    brief: "Design a service that helps visitors with different sensory, mobility, and language needs choose a manageable route through a crowded civic venue. Integrate research, journey mapping, information architecture, interaction and visual systems, prototyping, usability tests, accessibility, handoff, and case-study storytelling.",
    deliverables: ["Consentful research artifacts and a journey map", "A tested prototype with accessible route alternatives", "A reusable component and content pattern set", "A handoff-ready case study tied to observed outcomes"],
  },
  cybersecurity: {
    title: "The Museum After-Hours Tabletop: Defend a fictional digital collection",
    brief: "Build a safe defensive exercise for a fictional museum facing a suspicious account, an exposed cloud backup, and an urgent restoration deadline. Integrate risk, networking, operating systems, identity, hardening, threat modeling, monitoring, vulnerability management, incident response, cloud controls, governance, and responsible AI-assisted triage.",
    deliverables: ["A threat model and prioritized control map", "Synthetic defensive telemetry and detection rationale", "An evidence-preserving response and recovery playbook", "A governance and privacy review with explicit exercise boundaries"],
  },
};

function addModuleProjects(track, module) {
  const topic = module.title.replace(/[()]/g, "").trim();
  return {
    ...module,
    projects: MODULE_PROJECT_IDEAS[track.slug].map((idea) => ({
      title: `${idea.title} — ${topic}`,
      brief: idea.brief.replaceAll("{topic}", topic.toLowerCase()),
    })),
  };
}

function addMajorProject(track, modules) {
  return {
    ...COURSE_CAPSTONES[track.slug],
    modules: modules.map((module) => module.title),
  };
}

function enrichCourse(track) {
  const profile = COURSE_PROFILES[track.slug];
  if (!profile) {
    return {
      ...track,
      modules: track.modules.map((module) => addModuleProjects(track, module)),
      majorProject: addMajorProject(track, track.modules),
    };
  }
  if (!profile.tools) {
    return {
      ...track,
      assistant: profile.assistant,
      modules: track.modules.map((module) => addModuleProjects(track, module)),
      majorProject: addMajorProject(track, track.modules),
    };
  }

  const modules = track.modules.map((module, index) => {
    const tools = profile.tools[index % profile.tools.length];
    const topic = module.title.toLowerCase();
    const advancedA = profile.advanced[index % profile.advanced.length];
    const advancedB = profile.advanced[(index + 2) % profile.advanced.length];
    const topicLabel = module.title.replace(/[()]/g, "").trim();
    return {
      ...module,
      tools,
      chapters: [
        { title: `${topicLabel}: concepts, architecture, and decision criteria`, level: "core" },
        { title: `Build a practical ${topicLabel.toLowerCase()} workflow`, level: "core" },
        { title: `Validate, test, and communicate ${topicLabel.toLowerCase()} outcomes`, level: "core" },
        { title: `Advanced practice: ${advancedA}`, level: "advanced" },
        { title: `Advanced practice: ${advancedB}`, level: "advanced" },
      ],
      hours: 10,
      project: `Apply ${topicLabel.toLowerCase()} using ${tools.slice(0, 2).join(" and ")} as part of this course's capstone.`,
      challenge: `Compare two valid approaches to ${topic} and justify the choice using measurable evidence.`,
      points: [
        `Use ${tools.slice(0, 3).join(", ")} in a practical workflow`,
        `Apply current professional patterns for ${topicLabel.toLowerCase()}`,
        `Test and explain the trade-offs in your solution`,
      ],
    };
  });

  modules.push({
    ...analyticsModule({
      title: profile.aiModule,
      tools: profile.aiTools,
      chapters: [
        `AI-assisted workflows for ${track.title.toLowerCase()}`,
        "Prompting with task context, constraints, and success criteria",
        "Using copilots to draft, explain, and review work",
        "Verifying outputs against source material and tests",
        { title: "Privacy, permissions, and sensitive-data safeguards", level: "advanced" },
        { title: "Evaluation, human approval, and audit trails", level: "advanced" },
        { title: "Bias, reliability, and responsible AI adoption", level: "advanced" },
      ],
      points: ["Use domain-relevant AI assistants", "Verify generated output before using it", "Protect data and keep human approval in the loop"],
      hours: 8,
      project: `Use a course-specific assistant to accelerate one ${track.title.toLowerCase()} deliverable, then document verification and revisions.`,
      challenge: "Find an incorrect or unsupported AI suggestion and show how you caught it.",
    }),
  });

  return {
    ...track,
    path: `${modules.length} tool-based modules · foundation to advanced`,
    assistant: profile.assistant,
    project: profile.project,
    challenge: profile.challenge,
    modules: modules.map((module) => addModuleProjects(track, module)),
    majorProject: addMajorProject(track, modules),
  };
}

export const TRACKS = COURSE_TRACKS.map(enrichCourse);

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
