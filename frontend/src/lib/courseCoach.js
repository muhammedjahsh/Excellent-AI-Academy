function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function findModule(track, message, currentModule) {
  if (currentModule) return currentModule;
  const query = normalize(message);
  return track.modules.find((module) => {
    const terms = [module.title, ...(module.tools || [])]
      .map(normalize)
      .filter((term) => term.length > 2);
    return terms.some((term) => query.includes(term) || term.split(" ").some((word) => word.length > 4 && query.includes(word)));
  });
}

export function courseCoachReply(track, message, { currentModule, done = {} } = {}) {
  const text = message.trim().toLowerCase();
  const module = findModule(track, text, currentModule);
  const project = track.project || track.modules.find((item) => item.project)?.project;
  const challenge = track.challenge || track.modules.find((item) => item.challenge)?.challenge;

  if (/plan|start|roadmap|sequence/.test(text)) {
    const next = track.modules.find((item, index) => !done[`${track.slug}-${index + 1}`]) || track.modules[0];
    return `Start with ${next.title}. Work through its chapter outline and finish the applied project before moving on. The roadmap has ${track.modules.length} modules, progressing from foundations to advanced practice. Your course capstone is: ${project}`;
  }

  if (/project|portfolio|capstone/.test(text)) {
    return `Capstone direction: ${project} A strong submission should include the problem, your decisions, a working artifact, and evidence that you tested it. Stretch challenge: ${challenge}`;
  }

  if (/quiz|practice|test me|challenge/.test(text)) {
    const focus = module || track.modules[0];
    const chapter = focus.chapters?.find((item) => item.level === "advanced") || focus.chapters?.[0];
    return `Practice question for ${focus.title}: ${chapter?.title || focus.points?.[0] || "Explain the core workflow."} What would you measure to prove your approach works? Try answering in 3–5 sentences, then compare it with the module tools: ${(focus.tools || []).join(", ")}.`;
  }

  if (module) {
    const advanced = module.chapters?.filter((item) => item.level === "advanced").map((item) => item.title) || [];
    return `${module.title} focuses on ${module.points?.join("; ") || "practical course skills"}. Tools to explore: ${(module.tools || []).join(", ") || "see the chapter outline"}. Start with ${module.chapters?.[0]?.title || "the module outline"}${advanced.length ? `, then stretch into ${advanced[0]}` : ""}. Applied project: ${module.project || project}`;
  }

  return `I’m ${track.assistant.name}, your ${track.assistant.role.toLowerCase()}. I can help plan the ${track.title} roadmap, explain a listed tool or module, suggest a portfolio project, or give you a practice question. This course has ${track.modules.length} modules and uses ${track.modules.slice(0, 3).map((item) => item.title).join(", ")} as its starting sequence.`;
}
