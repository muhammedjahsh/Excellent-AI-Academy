import { AGENTS, getTrack, TRACKS } from "../data/curriculum.js";
import { TABLES, TASKS } from "../data/lab.js";

const WEBSITE_INFO = [
  {
    title: "Academy overview and navigation",
    keywords: ["website", "academy", "features", "help", "about", "what can you do", "courses", "catalog", "learning paths", "homepage", "navigation", "search", "ctrl k"],
    text: `Excellent AI Academy has a homepage, a catalog of ${TRACKS.length} learning paths (${TRACKS.map((track) => track.title).join(", ")}), course syllabi and projects, sign-in and enrollment, a progress dashboard, course coaches, a Data Analytics SQL lesson and lab, completion records, and Developer Studio. Use the course catalog to preview any syllabus. In the signed-in workspace, Ctrl+K opens the command palette.`,
    to: "/tracks",
  },
  {
    title: "Course structure and content availability",
    keywords: ["structure", "modules", "chapters", "syllabus", "curriculum", "roadmap", "content", "planned", "live", "published"],
    text: "Every course has an ordered module roadmap. Modules may include chapter outlines, tools, learning outcomes, an applied project, a challenge, and five distinctive project briefs. Each course has a major project joining its modules. Syllabi are available to preview; lesson access and course tools require enrollment. Only the Data Analytics SQL Fundamentals module currently has a published lesson and lab; other lesson content is still being built.",
    to: "/tracks",
  },
  {
    title: "Enrollment, pricing, and payment",
    keywords: ["enroll", "enrollment", "payment", "price", "pricing", "fee", "fees", "checkout", "cost", "stripe", "course access", "cancel", "refund"],
    text: "Course enrollment is a one-time ₹10,000 INR payment per course through Stripe Checkout. You can select multiple courses, and the total is the per-course price multiplied by the number selected. A cancelled checkout before payment takes no payment. Card details are entered on Stripe and are not stored by the academy. The website does not publish a post-payment refund policy.",
    to: "/checkout",
  },
  {
    title: "Accounts and sign-in",
    keywords: ["account", "login", "sign in", "register", "password", "signup"],
    text: "Create an account with your name, email, and a password of at least eight characters, or sign in with an existing account. Course selection and progress are stored in this browser.",
    to: "/signin",
  },
  {
    title: "Course selection and progress",
    keywords: ["dashboard", "progress", "completed", "saved", "sync", "browser", "switch", "active course", "learning space"],
    text: "Learners can enroll in multiple courses and choose one active course for the learning workspace. The dashboard shows opened and completed modules for that selected course. Course selection and learning progress are stored in this browser and are not synced across devices.",
    to: "/dashboard",
  },
  {
    title: "Data Analytics SQL lesson and lab",
    keywords: ["sql", "lab", "query", "database", "task", "grade", "customers", "orders"],
    text: `The Data Analytics course has a published SQL Fundamentals lesson in Module 2 and a lab with ${TASKS.length} graded tasks: ${TASKS.map((task) => `${task.title} — ${task.prompt}`).join("; ")}. The visible schema contains ${Object.keys(TABLES).join(" and ")} tables. A signed-in, enrolled learner's submissions are stored on the academy server when it is available; local grading also works in the browser. Lab access requires Data Analytics enrollment.`,
    to: "/lab",
  },
  {
    title: "Module projects and course major projects",
    keywords: ["project", "projects", "portfolio", "capstone", "major project", "deliverable"],
    text: `Each course module has five distinctive project briefs in addition to its applied project and challenge. Every course also has a named major project with portfolio deliverables that combine its full module path. Major projects: ${TRACKS.map((track) => `${track.title}: ${track.majorProject.title}`).join("; ")}. Ask for a course and module name to see that module's five briefs.`,
    to: "/tracks",
  },
  {
    title: "Certificates and completion records",
    keywords: ["certificate", "certificates", "record", "eligibility", "completion"],
    text: "The Records page shows course completion eligibility and lets a learner verify an issued record ID. An academy certificate is a course completion record, not a university degree or an outside certification. Issuance remains blocked until all course requirements exist and are completed; most course modules are still roadmap content.",
    to: "/certificates",
  },
  {
    title: "Developer Studio",
    keywords: ["developer studio", "python", "playground", "workflow", "github actions", "code"],
    text: "Developer Studio has three browser tools: a Pyodide Python runner in a temporary Web Worker (10-second run limit), a local JavaScript/Python source heuristic review (up to 50,000 characters), and a GitHub Actions workflow inspector (up to 50,000 characters). Drafts autosave in this browser. The workflow inspector does not connect to GitHub or read repository secrets. The Python runner is for trusted learning snippets, not a security sandbox.",
    to: "/studio",
  },
  {
    title: "Academy course coaches",
    keywords: ["ai", "coach", "tutor", "assistant", "chat", "chatbot", "guide", "privacy", "external model", "artificial intelligence"],
    text: "Each course has an on-device curriculum coach grounded in its course roadmap. The Academy Guide searches published course and website information locally and can link to relevant pages. Neither assistant sends learner prompts to an external AI model; they are not hosted generative AI tutors.",
    to: "/agents",
  },
  {
    title: "Academy faculty and helper agents",
    keywords: ["agents", "faculty", "atlas", "mira", "quill", "vega", "herald", "interviewer"],
    text: `The homepage introduces five helper concepts: ${AGENTS.map((agent) => `${agent.name}, ${agent.role.toLowerCase()} — ${agent.brief}`).join("; ")}. The interactive course coach is selected for the learner's active course.`,
    to: "/agents",
  },
  {
    title: "Current scope and limitations",
    keywords: ["limitations", "not implemented", "future", "refund", "quiz", "interview", "retrieval", "pdf", "admin", "security"],
    text: "The academy currently has no hosted AI tutor or retrieval citations, quiz engine, Python course lab, mock-interview engine, project submission/grading workflow, adaptive plans, gamification, PDF/QR certificates, or admin/instructor console. Most modules are mapped roadmaps rather than complete lessons. The SQL grader is intended for local development; it should be isolated before any public deployment.",
    to: "/tracks",
  },
];

const STOP_WORDS = new Set(
  "a an and are about academy can could do does for from how i in info information is it me of on or please site tell the this to want was website what when where which who why with".split(" "),
);

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function terms(value) {
  return [...new Set(normalize(value).split(" ").filter((word) => word.length > 2 && !STOP_WORDS.has(word)))];
}

function containsTerm(text, term) {
  return normalize(text).split(" ").some((word) =>
    word === term || (Math.min(word.length, term.length) >= 4 && (word.startsWith(term) || term.startsWith(word))),
  );
}

function courseSlugText(track) {
  return track.slug.replace(/-/g, " ");
}

function findCourse(query) {
  const text = normalize(query);
  return TRACKS.find((track) => {
    const majorProject = normalize(track.majorProject?.title || "");
    return text.includes(normalize(track.title))
      || text.includes(courseSlugText(track))
      || Boolean(majorProject && text.includes(majorProject));
  });
}

function getContextCourse(context = {}) {
  const lessonRoute = context.pathname?.match(/^\/learn\/([^/]+)\/(\d+)/);
  const trackRoute = context.pathname?.match(/^\/tracks\/([^/]+)/);
  const slug = lessonRoute?.[1] || trackRoute?.[1] || context.activeCourse;
  const track = getTrack(slug);
  const moduleNumber = lessonRoute ? Number(lessonRoute[2]) : 0;
  return {
    track,
    module: track && moduleNumber ? track.modules[moduleNumber - 1] : null,
    moduleIndex: moduleNumber ? moduleNumber - 1 : -1,
  };
}

function findModule(query, track) {
  const queryText = normalize(query);
  const courseTerms = new Set(track ? terms(`${track.title} ${courseSlugText(track)}`) : []);
  const queryTerms = terms(query).filter((term) => !courseTerms.has(term));
  const candidates = track ? [track] : TRACKS;
  let best = null;

  for (const candidate of candidates) {
    candidate.modules.forEach((module, index) => {
      const title = normalize(module.title);
      const tools = normalize((module.tools || []).join(" "));
      const searchable = normalize([
        module.title,
        ...(module.tools || []),
        ...(module.points || []),
        ...(module.chapters || []).map((chapter) => chapter.title),
        module.project || "",
        module.challenge || "",
        ...(module.projects || []).flatMap((project) => [project.title, project.brief]),
        ...(module.lesson?.sections || []).flatMap((section) => [section.h, section.t]),
      ].join(" "));
      const projectMatches = (module.projects || []).filter((project) =>
        queryText.includes(normalize(project.title)),
      );
      const score = queryTerms.reduce((total, term) => {
        if (containsTerm(title, term)) return total + 4;
        if (containsTerm(tools, term)) return total + 4;
        if (containsTerm(searchable, term)) return total + 1;
        return total;
      }, (queryText.includes(title) ? 10 : 0) + projectMatches.length * 12);

      if (score > (best?.score || 0)) {
        best = { track: candidate, module, index, score, projectMatches };
      }
    });
  }

  return best && best.score >= 3 ? best : null;
}

function answerForModule(match, projectIntent) {
  const { track, module, index } = match;
  const lesson = module.lesson;
  const lines = [
    `${track.title} · Module ${index + 1}: ${module.title}`,
    `Status: ${lesson ? "Published lesson available." : "Mapped syllabus; full lesson content and graded assessment are still in production."}`,
    `Syllabus: ${(module.chapters || []).map((chapter) => `${chapter.title}${chapter.level === "advanced" ? " (advanced)" : ""}`).join("; ") || "See the module roadmap."}`,
  ];
  if (module.tools?.length) lines.push(`Tools: ${module.tools.join(", ")}.`);
  if (module.hours) lines.push(`Estimated effort: about ${module.hours} hours.`);
  if (module.points?.length) lines.push(`Learning outcomes: ${module.points.join("; ")}.`);
  if (module.project) lines.push(`Applied project: ${module.project}`);
  if (module.challenge) lines.push(`Challenge: ${module.challenge}`);
  if (lesson?.sections?.length) {
    lines.push(`Published lesson: ${lesson.title}. ${lesson.sections.map((section) => `${section.h}: ${section.t}`).join(" ")}`);
  }
  if (lesson?.sources?.length) lines.push(`Lesson references: ${lesson.sources.map((source) => source.title).join(", ")}.`);
  if (projectIntent && module.projects?.length) {
    lines.push(`Five distinctive project briefs:\n${module.projects.map((project) => `• ${project.title}: ${project.brief}`).join("\n")}`);
  } else if (match.projectMatches?.length) {
    lines.push(`Requested project brief:\n${match.projectMatches.map((project) => `• ${project.title}: ${project.brief}`).join("\n")}`);
  }

  return {
    text: lines.join("\n\n"),
    to: `/tracks/${track.slug}#${track.slug}-${index + 1}`,
    linkLabel: "Open this module's syllabus",
  };
}

function answerForCourse(track, projectIntent) {
  const modules = track.modules.map((module, index) =>
    `${index + 1}. ${module.title}${module.lesson ? " (published lesson)" : " (roadmap)"}`,
  );
  const chapters = track.modules.reduce((total, module) => total + (module.chapters?.length || 0), 0);
  const advanced = track.modules.reduce(
    (total, module) => total + (module.chapters?.filter((chapter) => chapter.level === "advanced").length || 0),
    0,
  );
  const estimatedHours = track.modules.reduce((total, module) => total + (module.hours || 0), 0);
  const published = track.modules.filter((module) => module.lesson);
  const lines = [
    `${track.title}: ${track.summary}`,
    `${track.path}. ${track.modules.length} modules, ${chapters} chapter outlines, ${advanced} advanced chapters, and about ${estimatedHours} estimated module hours:\n${modules.join("\n")}`,
    `Published lesson content: ${published.length ? published.map((module) => module.title).join(", ") : "none yet; the modules are roadmap outlines."}`,
    `Course coach: ${track.assistant.name}, ${track.assistant.role}.`,
  ];
  if (track.majorProject) {
    lines.push(`Major project: ${track.majorProject.title}. ${track.majorProject.brief}`);
    lines.push(`Major project deliverables: ${track.majorProject.deliverables.join("; ")}.`);
  }
  if (projectIntent) {
    lines.push(`There are five distinctive project briefs in each module (${track.modules.length * 5} across this course), in addition to the applied module projects. Ask me about a module by name to see its five ideas.`);
  }

  return {
    text: lines.join("\n\n"),
    to: `/tracks/${track.slug}`,
    linkLabel: `Open the ${track.title} syllabus`,
  };
}

function answerForFees(query, contextTrack) {
  const text = normalize(query);
  const countWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const quantity = text.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:courses?|paths?)\b/);
  const requestedCount = quantity
    ? Number(quantity[1]) || countWords[quantity[1]]
    : 0;
  const allCourses = /\b(all|every|each|ten)\b/.test(text)
    && /\b(course|courses|path|paths)\b/.test(text);
  const selected = TRACKS.filter((track) =>
    text.includes(normalize(track.title)) || text.includes(courseSlugText(track)),
  );
  const count = allCourses
    ? TRACKS.length
    : selected.length || requestedCount || (contextTrack ? 1 : 0);
  const total = (count || 1) * 10_000;
  const totalText = total.toLocaleString("en-IN");
  return {
    text: count > 1
      ? `Enrollment is ₹10,000 INR per course as a one-time payment. ${allCourses ? `All ${TRACKS.length} courses would total ` : `${count} selected courses would total `}₹${totalText} INR. Payment is completed through Stripe Checkout.`
      : "Enrollment is a one-time ₹10,000 INR payment per course through Stripe Checkout. You can select more than one course; the checkout total is calculated from your selection. Card details are entered on Stripe and are not stored by the academy.",
    to: "/checkout",
    linkLabel: "View course enrollment",
  };
}

function scoreInfo(query, info) {
  const queryTerms = terms(query);
  let score = 0;
  for (const term of queryTerms) {
    if (containsTerm(info.title, term)) score += 5;
    else if (info.keywords.some((keyword) => containsTerm(keyword, term))) score += 4;
    else if (containsTerm(info.text, term)) score += 1;
  }
  return score;
}

export function academyGuideReply(question, context = {}) {
  const query = normalize(question);
  const projectIntent = /\b(project|projects|portfolio|capstone|major)\b/.test(query);
  const pageContext = getContextCourse(context);
  const courseReference = /\b(this|my|current|selected)\s+(course|path|progress|modules)\b/.test(query);
  const moduleReference = /\b(this|current|that)\s+(module|lesson|chapter)\b/.test(query);
  const course = findCourse(question) || (courseReference ? pageContext.track : null);
  const module = findModule(question, course)
    || (moduleReference && pageContext.module
      ? { track: pageContext.track, module: pageContext.module, index: pageContext.moduleIndex }
      : null);

  if (/^(hi|hello|hey|good morning|good afternoon)$/.test(query)) {
    return {
      text: "Hi! I’m the Academy Guide. Ask me about any course, module, project, enrollment, SQL lab, progress, certificates, or Developer Studio.",
      to: "/tracks",
      linkLabel: "Browse the courses",
    };
  }

  if (!course && !module && (!terms(question).length
    || /\b(help|what can you do|what do you know|overview|describe|tell me about)\b/.test(query))) {
    const info = WEBSITE_INFO[0];
    return { text: info.text, to: info.to, linkLabel: "Browse the course catalog" };
  }

  const moduleIntent = /\b(module|modules|syllabus|chapter|chapters|topics)\b/.test(query);
  const feeIntent = /\b(fee|fees|price|pricing|payment|pay|tuition|checkout|rupees|inr|how much)\b/.test(query)
    || (/\bcost\b/.test(query) && !projectIntent && !moduleIntent);
  if (feeIntent || question.includes("₹")) {
    return answerForFees(question, course || pageContext.track);
  }

  if (/\b(my|am i|which)\b.*\b(enrolled|enrollment)\b/.test(query)) {
    if (!context.user?.token) {
      return { text: "Sign in to see the courses enrolled to your account.", to: "/signin", linkLabel: "Sign in" };
    }
    const enrolledCourses = (context.enrollments || []).map((slug) => getTrack(slug)?.title || slug);
    return {
      text: enrolledCourses.length ? `Your account is enrolled in: ${enrolledCourses.join(", ")}.` : "Your account has no confirmed course enrollments yet.",
      to: "/checkout",
      linkLabel: enrolledCourses.length ? "Manage course selection" : "Choose courses",
    };
  }

  if (course && /\b(progress|completed|opened)\b/.test(query) && /\b(my|i|me|current|selected)\b/.test(query)) {
    const completed = course.modules.filter((_, index) => context.done?.[`${course.slug}-${index + 1}`]).length;
    const opened = course.modules.filter((_, index) => context.seen?.[`${course.slug}-${index + 1}`]).length;
    return {
      text: `Your ${course.title} progress in this browser: ${completed} of ${course.modules.length} modules marked complete and ${opened} opened. This progress is stored locally in this browser, not synced across devices.`,
      to: "/dashboard",
      linkLabel: "Open my progress dashboard",
    };
  }

  const majorTitle = normalize(course?.majorProject?.title || "");
  const majorIntent = /\b(major|capstone)\b/.test(query) || Boolean(majorTitle && query.includes(majorTitle));
  if (course && majorIntent) return answerForCourse(course, true);

  if (module && (projectIntent || moduleIntent)) return answerForModule(module, projectIntent);
  if (course && projectIntent) return answerForCourse(course, true);
  if (course && /\b(structure|syllabus|modules|chapters|roadmap|curriculum)\b/.test(query)) {
    return answerForCourse(course, projectIntent);
  }

  const infoResults = WEBSITE_INFO
    .map((info) => ({ info, score: scoreInfo(question, info) }))
    .sort((a, b) => b.score - a.score);
  if (infoResults[0]?.score >= 8) {
    const info = infoResults[0].info;
    return { text: info.text, to: info.to, linkLabel: `Open ${info.title.toLowerCase()}` };
  }

  if (!course && /\b(courses|catalog|learning paths)\b/.test(query)) {
    const info = WEBSITE_INFO[0];
    return { text: info.text, to: info.to, linkLabel: "Browse the course catalog" };
  }

  if (module) return answerForModule(module, projectIntent);
  if (course) return answerForCourse(course, projectIntent);

  if (projectIntent) {
    return {
      text: `Every course has a major project, and every module has five distinctive project briefs. For example, ${TRACKS.slice(0, 4).map((track) => `${track.title}: ${track.majorProject.title}`).join("; ")}. Ask for a course or module by name to explore its details.`,
      to: "/tracks",
      linkLabel: "Browse all course projects",
    };
  }

  const results = infoResults.filter((item) => item.score > 0).slice(0, 2);
  if (results.length) {
    return {
      text: results.map(({ info }) => info.text).join("\n\n"),
      to: results[0].info.to,
      linkLabel: `Open ${results[0].info.title.toLowerCase()}`,
    };
  }

  return {
    text: "I couldn’t find that detail in the academy’s published information. Try a course or module name, or ask about enrollment, projects, the SQL lab, progress, certificates, or Developer Studio.",
    to: "/tracks",
    linkLabel: "Browse the course catalog",
  };
}
