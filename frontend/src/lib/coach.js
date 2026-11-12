import { TASKS } from "../data/lab";
import { getTrack, liveLessons } from "../data/curriculum";

const INTERVIEW = [
  "Walk me through a JOIN you would use on customers and orders. What would a wrong key do to the numbers?",
  "A chart shows revenue up 40%. What do you ask before you repeat that sentence to a director?",
  "An agent can call a SQL tool. What permission would you refuse to give it, and why?",
  "WHERE and HAVING both filter. When does each one run?",
  "Describe a retrieval step in a tutor agent. What would you store so the answer can cite a lesson?",
];

function lessonReply() {
  return [
    "Think of customers and orders as two spreadsheets.",
    "SELECT chooses columns. WHERE keeps rows before any grouping.",
    "A JOIN adds the matching customer onto each order: orders.customer_id = customers.id.",
    "GROUP BY then collapses those rows. SUM and COUNT describe each group, and HAVING filters the groups.",
    "The check for this lesson: WHERE cannot see SUM(amount), because the sum does not exist yet.",
    "When that feels solid, open the SQL lab and run the three tasks.",
  ].join(" ");
}

export function coachReply({ agentId, text, taskId, done, attempts }) {
  const message = text.trim();
  const lower = message.toLowerCase();
  const task = TASKS.find((item) => item.id === taskId) || TASKS[0];
  const live = liveLessons()[0];
  const passed = new Set(attempts.filter((item) => item.passed).map((item) => item.taskId));

  if (agentId === "mira") {
    if (/where|having|group|join|select/.test(lower)) return lessonReply();
    if (/agent/.test(lower)) {
      return "An agent here is a role with a job: tutor, lab coach, interviewer, planner, or records. The live classroom is still the SQL lesson. Agentic AI, the module where you build the loop yourself, is mapped on the AI engineering track and the lesson text is not published yet.";
    }
    return `I teach the live lesson, ${live.mod.title}. ${lessonReply()}`;
  }

  if (agentId === "quill") {
    if (/^select\b/i.test(message)) {
      const notes = [];
      if (!/\bwhere\b/i.test(message) && task.id === "sql-1") notes.push("I do not see a WHERE yet.");
      if (!/\bjoin\b/i.test(message) && task.id === "sql-2") notes.push("This task needs a JOIN.");
      if (!/\bgroup\s+by\b/i.test(message) && task.id !== "sql-1") notes.push("Look at GROUP BY.");
      if (/\bselect\s+\*/i.test(message)) notes.push("SELECT * is a fine way to look around. The task wants specific columns.");
      return `${notes.join(" ") || "The shape is in the right family."} Hint: ${task.hint} Submit it in the lab when you want a grade. I will not paste the finished query.`;
    }
    return `You are on “${task.title}”. ${task.prompt} Hint: ${task.hint}`;
  }

  if (agentId === "vega") {
    const index = Math.abs(message.length) % INTERVIEW.length;
    return INTERVIEW[index];
  }

  if (agentId === "herald") {
    const labs = TASKS.filter((item) => passed.has(item.id)).length;
    const lesson = done["data-analytics-4"] ? "The SQL lesson is marked complete." : "The SQL lesson is still open.";
    return `${lesson} Lab tasks passed: ${labs} of ${TASKS.length}. A completion record also waits on the modules still in production, plus the capstone, the final interview, and the final assessment. Those are mapped and not open yet, so eligibility stays closed on purpose.`;
  }

  const track = getTrack("ai-engineering");
  const next = live;
  return `The next live room is ${next.track.title}, module ${next.n}: ${next.mod.title}. ${
    done["data-analytics-4"] ? "You already marked that lesson complete, so the lab is the right room." : "Start there, then use Quill on the SQL tasks."
  } ${track.title} holds the Agentic AI module for when you want to build agents, not only study with them. Ask me for a path and I will stay inside what is actually published.`;
}
