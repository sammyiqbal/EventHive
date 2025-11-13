const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function login(credentials) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function signup(payload) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getHealth() {
  return request("/health");
}

export { API_BASE_URL };

