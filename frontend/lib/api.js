// Use relative URLs to work with Next.js proxy, or fallback to direct backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
// Backend URL for OAuth redirects (needs full URL)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

async function request(path, options = {}) {
  // Get token from localStorage or sessionStorage if available
  const token = typeof window !== "undefined" 
    ? (localStorage.getItem("eventhive_token") || sessionStorage.getItem("eventhive_token"))
    : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
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
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function signup(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getHealth() {
  return request("/health");
}

// OAuth endpoints
export function initiateOAuth(provider) {
  // Redirect to backend OAuth endpoint (needs full URL for redirects)
  window.location.href = `${BACKEND_URL}/api/auth/${provider}`;
}

// Event endpoints
export function getEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.q) params.append("q", filters.q);
  if (filters.college) params.append("college", filters.college);
  if (filters.category) params.append("category", filters.category);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.savedByUser) params.append("savedByUser", filters.savedByUser);
  if (filters.createdBy) params.append("createdBy", filters.createdBy);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  
  return request(`/api/events?${params.toString()}`);
}

export function getEventById(id) {
  return request(`/api/events/${id}`);
}

export function createEvent(eventData) {
  return request("/api/events", {
    method: "POST",
    body: JSON.stringify(eventData)
  });
}

export function updateEvent(id, eventData) {
  return request(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData)
  });
}

export function deleteEvent(id) {
  return request(`/api/events/${id}`, {
    method: "DELETE"
  });
}

export function saveEvent(id) {
  return request(`/api/events/${id}/save`, {
    method: "POST"
  });
}

export function registerForEvent(id) {
  return request(`/api/events/${id}/register`, {
    method: "POST"
  });
}

// User endpoints
export function getCurrentUser() {
  return request("/api/users/me");
}

export function updateUserProfile(data) {
  return request("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function getSavedEvents(userId) {
  return request(`/api/users/${userId}/saved-events`);
}

// College endpoints
export function getColleges() {
  return request("/api/colleges");
}

// Category endpoints
export function getCategories() {
  return request("/api/categories");
}

// AI endpoints
export function generateCaption(data) {
  return request("/api/ai/generate-caption", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export { API_BASE_URL };

