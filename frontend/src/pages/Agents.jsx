import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AGENTS } from "../data/curriculum";
import { TASKS } from "../data/lab";
import { useAcademy } from "../context/AcademyContext";
import { useTitle } from "../hooks/useTitle";
import { coachReply } from "../lib/coach";

const PROMPTS = {
  atlas: "Where should I start?",
  mira: "Teach me the difference between WHERE and HAVING.",
  quill: "I am stuck on this task.",
  vega: "Ask me an interview question.",
  herald: "Am I eligible for a completion record?",
};

export default function Agents() {
  useTitle("Agent studio");
  const { done, attempts } = useAcademy();
  const [params, setParams] = useSearchParams();
  const initial = AGENTS.some((agent) => agent.id === params.get("agent")) ? params.get("agent") : "mira";
  const [agentId, setAgentId] = useState(initial);
  const [taskId, setTaskId] = useState(TASKS[0].id);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const thread = useRef(null);
  const agent = AGENTS.find((item) => item.id === agentId);

  useEffect(() => {
    setMessages([
      {
        from: "agent",
        text: `${agent.name} is in the studio. ${agent.brief} This reply engine runs in the browser from the published curriculum.`,
      },
    ]);
  }, [agent]);

  useEffect(() => {
    thread.current?.scrollTo(0, thread.current.scrollHeight);
  }, [messages]);

  function choose(id) {
    setAgentId(id);
    setParams({ agent: id });
  }

  function send(text) {
    const content = text.trim();
    if (!content) return;
    const reply = coachReply({ agentId, text: content, taskId, done, attempts });
    setMessages((current) => [
      ...current,
      { from: "user", text: content },
      { from: "agent", text: reply },
    ]);
    setDraft("");
  }

  return (
    <div className="page agents">
      <header className="page-head">
        <p className="eyebrow">Faculty</p>
        <h1>Agent studio</h1>
        <p className="lede">
          Five roles share the catalog. They explain, hint, and interview from what is published. A hosted model can replace this studio later without changing the rooms around it.
        </p>
      </header>
      <div className="studio">
        <aside className="roster">
          {AGENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === agentId ? `roster-card on tint-${item.tint}` : `roster-card tint-${item.tint}`}
              onClick={() => choose(item.id)}
            >
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </button>
          ))}
          <label className="field">
            <span>Lab task in front of Quill</span>
            <select value={taskId} onChange={(event) => setTaskId(event.target.value)}>
              {TASKS.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </label>
        </aside>
        <section className="panel thread-panel">
          <header className="thread-head">
            <div>
              <p className="kicker">{agent.role}</p>
              <h2>{agent.name}</h2>
            </div>
            <span className="badge badge-mint">On-device studio</span>
          </header>
          <div className="thread" ref={thread}>
            {messages.map((message, index) => (
              <p key={index} className={message.from === "user" ? "bubble user" : "bubble agent"}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="chips">
            <button type="button" onClick={() => send(PROMPTS[agentId])}>
              {PROMPTS[agentId]}
            </button>
          </div>
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Message ${agent.name}`}
            />
            <button className="btn btn-gold" type="submit">
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
