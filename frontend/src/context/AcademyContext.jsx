import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../lib/api";

const KEY = "eai-academy";
const AcademyContext = createContext(null);

const blank = { user: null, seen: {}, done: {}, attempts: [] };

function load() {
  try {
    return { ...blank, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return blank;
  }
}

export function AcademyProvider({ children }) {
  const [state, setState] = useState(load);
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    api.ping().then(setOnline).catch(() => setOnline(false));
  }, []);

  async function register(form) {
    setBusy(true);
    try {
      const data = await api.register(form);
      setState((current) => ({
        ...current,
        user: { name: form.name, email: form.email, token: data.token, guest: false },
      }));
    } finally {
      setBusy(false);
    }
  }

  async function login(form) {
    setBusy(true);
    try {
      const data = await api.login(form);
      setState((current) => ({
        ...current,
        user: {
          name: form.email.split("@")[0],
          email: form.email,
          token: data.token,
          guest: false,
        },
      }));
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    setState((current) => ({ ...current, user: null }));
  }

  function continueAsGuest() {
    setState((current) => ({
      ...current,
      user: { name: "Guest learner", email: "", token: null, guest: true },
    }));
  }

  function see(id) {
    setState((current) =>
      current.seen[id] ? current : { ...current, seen: { ...current.seen, [id]: true } },
    );
  }

  function complete(id) {
    setState((current) => ({
      ...current,
      seen: { ...current.seen, [id]: true },
      done: { ...current.done, [id]: true },
    }));
  }

  function addAttempt(attempt) {
    setState((current) => ({
      ...current,
      attempts: [attempt, ...current.attempts].slice(0, 24),
    }));
  }

  const value = {
    ...state,
    online,
    busy,
    register,
    login,
    logout,
    continueAsGuest,
    see,
    complete,
    addAttempt,
  };

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  return useContext(AcademyContext);
}
