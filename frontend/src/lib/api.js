const BASE = import.meta.env.VITE_API_URL || "/api";

export async function request(path, { token, method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error("The academy server is not reachable.");
    error.network = true;
    throw error;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail?.unmet)
          ? detail.unmet.join("\n")
          : `Request failed (${res.status}).`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

export function ping() {
  return request("/tracks").then(() => true);
}

export function register(body) {
  return request("/auth/register", { method: "POST", body });
}

export function login(body) {
  return request("/auth/login", { method: "POST", body });
}

export function submitSql(token, taskId, query) {
  return request("/labs/sql/submit", {
    token,
    method: "POST",
    body: { task_id: taskId, query },
  });
}

export function verifyCertificate(id) {
  return request(`/verify/${encodeURIComponent(id)}`);
}
