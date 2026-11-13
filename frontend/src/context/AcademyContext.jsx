import { createContext, useContext, useEffect, useState } from "react";
import { getTrack } from "../data/curriculum";
import * as api from "../lib/api";

const KEY = "eai-academy";
const AcademyContext = createContext(null);

const blank = { user: null, seen: {}, done: {}, attempts: [], enrollments: [] };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      ...blank,
      ...saved,
      activeCourse: getTrack(saved.activeCourse) ? saved.activeCourse : null,
    };
  } catch {
    return blank;
  }
}

export function AcademyProvider({ children }) {
  const [state, setState] = useState(load);
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    api.ping().then(setOnline).catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    if (!state.user?.token) return;
    let active = true;
    setEnrollmentLoading(true);
    api.getEnrollments(state.user.token)
      .then(({ courses }) => {
        if (!active) return;
        setEnrollmentError("");
        setState((current) => ({
          ...current,
          enrollments: courses,
          activeCourse: courses.includes(current.activeCourse) ? current.activeCourse : courses[0] || null,
        }));
      })
      .catch((error) => {
        if (active) setEnrollmentError(error.message);
      })
      .finally(() => {
        if (active) setEnrollmentLoading(false);
      });
    return () => { active = false; };
  }, [state.user?.token]);

  async function register(form) {
    setBusy(true);
    try {
      const data = await api.register(form);
      setState((current) => ({
        ...current,
        user: { name: form.name, email: form.email, token: data.token, guest: false },
        activeCourse: null,
        enrollments: [],
      }));
      setEnrollmentError("");
      return data;
    } finally {
      setBusy(false);
    }
  }

  async function login(form) {
    setBusy(true);
    try {
      const data = await api.login(form);
      const { courses } = await api.getEnrollments(data.token);
      setState((current) => ({
        ...current,
        user: {
          name: form.email.split("@")[0],
          email: form.email,
          token: data.token,
          guest: false,
        },
        enrollments: courses,
        activeCourse: courses.includes(current.activeCourse) ? current.activeCourse : courses[0] || null,
      }));
      setEnrollmentError("");
      return { courses };
    } finally {
      setBusy(false);
    }
  }

  async function refreshEnrollments() {
    const token = state.user?.token;
    if (!token) throw new Error("Sign in to check course enrollments.");
    setEnrollmentLoading(true);
    try {
      const { courses } = await api.getEnrollments(token);
      setEnrollmentError("");
      setState((current) => ({
        ...current,
        enrollments: courses,
        activeCourse: courses.includes(current.activeCourse) ? current.activeCourse : courses[0] || null,
      }));
      return courses;
    } catch (error) {
      setEnrollmentError(error.message);
      throw error;
    } finally {
      setEnrollmentLoading(false);
    }
  }

  function logout() {
    setState((current) => ({ ...current, user: null, activeCourse: null, enrollments: [] }));
  }

  function selectCourse(slug) {
    if (!getTrack(slug)) {
      throw new Error("Choose a course from the available learning paths.");
    }
    setState((current) => ({ ...current, activeCourse: slug }));
  }

  function clearCourseSelection() {
    setState((current) => ({ ...current, activeCourse: null }));
  }

  function continueAsGuest() {
    setState((current) => ({
      ...current,
      user: { name: "Guest learner", email: "", token: null, guest: true },
      activeCourse: null,
      enrollments: [],
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
    enrollmentLoading,
    enrollmentError,
    register,
    login,
    refreshEnrollments,
    logout,
    continueAsGuest,
    selectCourse,
    clearCourseSelection,
    see,
    complete,
    addAttempt,
  };

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  return useContext(AcademyContext);
}
