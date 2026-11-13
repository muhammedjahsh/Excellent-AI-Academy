import { useState } from "react";
import { useAcademy } from "../context/AcademyContext";
import { courseCoachReply } from "../lib/courseCoach";

export default function CourseCoach({ track, currentModule }) {
  const { done } = useAcademy();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const prompts = track.assistant.prompts;

  function send(text) {
    const question = text.trim();
    if (!question) return;
    const answer = courseCoachReply(track, question, { currentModule, done });
    setMessages((items) => [...items, { from: "learner", text: question }, { from: "coach", text: answer }]);
    setDraft("");
  }

  return (
    <section className="panel course-coach" aria-label={`${track.assistant.name} course coach`}>
      <header className="course-coach-head">
        <div>
          <p className="kicker">{track.assistant.tool} · Course AI coach</p>
          <h2>{track.assistant.name}</h2>
          <p className="muted">{track.assistant.role}</p>
        </div>
        <span className="badge badge-mint">On-device pilot</span>
      </header>
      <p className="coach-disclosure">
        Curriculum-grounded helper using this course roadmap. It does not send your questions to an external AI service.
      </p>
      <div className="course-coach-thread" aria-live="polite">
        {messages.length === 0 ? (
          <p className="bubble agent">
            I can help you plan, explore tools and chapters, find a project direction, or practice a concept. Choose a prompt or ask a question.
          </p>
        ) : (
          messages.map((message, index) => (
            <p key={`${index}-${message.from}`} className={`bubble ${message.from === "learner" ? "user" : "agent"}`}>
              {message.text}
            </p>
          ))
        )}
      </div>
      <div className="course-coach-prompts">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" className="btn btn-ghost btn-small" onClick={() => send(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <form
        className="composer course-coach-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <label className="sr-only" htmlFor={`course-coach-${track.slug}`}>Ask the course coach</label>
        <input
          id={`course-coach-${track.slug}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Ask ${track.assistant.name} about this course`}
        />
        <button className="btn btn-gold" type="submit" disabled={!draft.trim()}>Ask</button>
      </form>
    </section>
  );
}
