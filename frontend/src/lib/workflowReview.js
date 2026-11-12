function finding(severity, title, detail, line = null) {
  return { severity, title, detail, line };
}

export function reviewWorkflow(source) {
  const findings = [];
  const lines = source.split(/\r?\n/);
  const content = lines.filter((line) => !/^\s*#/.test(line)).join("\n");
  const add = (severity, title, detail, line = null) =>
    findings.push(finding(severity, title, detail, line));

  for (const key of ["name", "on", "jobs"]) {
    if (!new RegExp(`^\\s*${key}\\s*:`, "m").test(content)) {
      add("high", `Missing "${key}"`, `A GitHub Actions workflow needs a top-level "${key}" key.`);
    }
  }
  if (!/^\s*runs-on\s*:/m.test(content)) {
    add("warning", "No runner found", "Add runs-on to a job to select its execution environment.");
  }
  if (!/^\s*steps\s*:/m.test(content)) {
    add("warning", "No steps found", "Add a steps list to describe the work the job should perform.");
  }
  if (!/^\s*permissions\s*:/m.test(content)) {
    add("warning", "Permissions not declared", "Declare the minimum GITHUB_TOKEN permissions the workflow needs.");
  }

  lines.forEach((line, index) => {
    if (/^\s*(?:-\s*)?uses\s*:/i.test(line) && !/@[a-f0-9]{40}(?:\s|$)/i.test(line)) {
      add(
        "info",
        "Action is not pinned to a full commit SHA",
        "Consider pinning third-party actions to a verified full commit SHA.",
        index + 1,
      );
    }
    if (
      /^\s*pull_request_target\s*:/i.test(line) ||
      (/^\s*on\s*:/i.test(line) && /\bpull_request_target\b/i.test(line))
    ) {
      add(
        "high",
        "Privileged pull_request_target trigger",
        "Review permissions and never run untrusted pull-request code with repository secrets.",
        index + 1,
      );
    }
  });

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*(?:-\s*)?run\s*:/i.test(lines[index])) continue;
    const indent = lines[index].match(/^\s*/)[0].length;
    const runLines = [lines[index]];
    for (let next = index + 1; next < lines.length; next += 1) {
      const currentIndent = lines[next].match(/^\s*/)[0].length;
      if (lines[next].trim() && currentIndent <= indent) break;
      runLines.push(lines[next]);
    }
    if (runLines.some((line) => /\$\{\{\s*github\.event\.(?:pull_request|issue)\.(?:title|body)\s*\}\}/i.test(line))) {
      add(
        "high",
        "Untrusted event text enters a shell command",
        "Pass pull-request or issue text through a safely quoted environment variable instead of interpolating it into run.",
        index + 1,
      );
    }
  }

  if (!findings.length) {
    add(
      "info",
      "Basic structure looks present",
      "This quick check is heuristic; validate the YAML and test the workflow in GitHub before relying on it.",
    );
  }
  return findings;
}
