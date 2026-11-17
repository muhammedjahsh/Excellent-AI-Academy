import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import Icon from "./Icon";
import { academyGuideReply } from "../lib/academyAssistant";

const SUGGESTIONS = [
  "What courses are offered?",
  "How does enrollment work?",
  "Show me a module's five projects",
  "What is in Developer Studio?",
];

export default function AcademyAssistant() {
  const location = useLocation();
  const { activeCourse, done, seen, enrollments, user } = useAcademy();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m the Academy Guide. Ask me about courses, syllabi, projects, enrollment, or any feature on this website.",
    },
  ]);
  const inputRef = useRef(null);
  const threadRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function send(text) {
    const question = text.trim();
    if (!question) return;
    const answer = academyGuideReply(question, {
      pathname: location.pathname,
      activeCourse,
      done,
      seen,
      enrollments,
      user,
    });
    setMessages((items) => [
      ...items,
      { role: "user", text: question },
      { role: "assistant", ...answer },
    ].slice(-40));
    setDraft("");
  }

  return (
    <div className="academy-assistant">
      {open && (
        <section className="academy-chat-panel" role="dialog" aria-label="Academy Guide chatbot">
          <header className="academy-chat-header">
            <span className="academy-chat-icon"><Icon name="bot" size={21} /></span>
            <div>
              <strong>Academy Guide</strong>
              <small>Ask about Excellent Academy</small>
            </div>
            <button type="button" className="academy-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>
          <p className="academy-chat-disclosure">Answers use the academy’s published information on this device. No external AI service is contacted.</p>
          <div className="academy-chat-thread" aria-live="polite" ref={threadRef}>
            {messages.map((message, index) => (
              <article key={`${index}-${message.role}`} className={`academy-chat-message ${message.role}`}>
                <p>{message.text}</p>
                {message.to && (
                  <Link to={message.to} onClick={() => setOpen(false)}>
                    {message.linkLabel || "Open details"} →
                  </Link>
                )}
              </article>
            ))}
          </div>
          <div className="academy-chat-suggestions" aria-label="Suggested questions">
            {SUGGESTIONS.map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => send(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="academy-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <label className="sr-only" htmlFor="academy-chat-question">Ask the Academy Guide</label>
            <input
              id="academy-chat-question"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about this academy…"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-gold" disabled={!draft.trim()}>Send</button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="academy-chat-toggle"
        aria-expanded={open}
        aria-label={open ? "Close Academy Guide" : "Open Academy Guide"}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="bot" size={21} />
      </button>
    </div>
  );
}
