const SECRET_PATTERN =
  /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*(['"])[^'"]{8,}\1/i;

export function reviewSource(source, language = "javascript") {
  const findings = [];
  const lines = source.split(/\r?\n/);
  const add = (line, severity, title, detail) => findings.push({ line, severity, title, detail });

  lines.forEach((text, index) => {
    const line = index + 1;
    if (text.length > 100) {
      add(line, "info", "Long line", `Line is ${text.length} characters; consider wrapping it.`);
    }
    if (/\s+$/.test(text)) {
      add(line, "info", "Trailing whitespace", "Remove spaces or tabs at the end of this line.");
    }
    if (/TODO|FIXME/i.test(text)) {
      add(line, "info", "Follow-up marker", "Confirm this note has an owner before shipping.");
    }
    if (SECRET_PATTERN.test(text)) {
      add(line, "high", "Possible hard-coded secret", "Move credentials to a secret store and rotate exposed values.");
    }
    if (/\bdebugger\s*;?/.test(text) || /\bconsole\.(?:log|debug)\s*\(/.test(text)) {
      add(line, "warning", "Debug statement", "Remove or gate debugging output before release.");
    }
    if (/\beval\s*\(|\bnew\s+Function\s*\(/.test(text)) {
      add(line, "high", "Dynamic code execution", "Avoid evaluating generated strings; use explicit, typed operations.");
    }
    if (language === "python" && /^\s*except\s*:\s*(?:#.*)?$/.test(text)) {
      add(line, "warning", "Bare exception handler", "Catch the expected exception type so failures are not hidden.");
    }
    if (language === "python" && /^\s*(?:from\s+\S+\s+import\s+\*|import\s+\*)/.test(text)) {
      add(line, "info", "Wildcard import", "Import the names you use to keep dependencies clear.");
    }
  });

  const severityOrder = { high: 0, warning: 1, info: 2 };
  return findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.line - b.line);
}
