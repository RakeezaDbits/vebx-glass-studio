const API_BASE = import.meta.env.VITE_API_URL || "";

function getUrl(path: string) {
  return `${API_BASE}${path}`;
}

export async function postContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(getUrl("/api/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to send");
  }
  return res.json();
}

export async function postQuote(data: {
  name: string;
  email: string;
  phone?: string;
  serviceSlug: string;
  subTypeId?: string;
  techIds: string[];
  tierId?: string;
  referenceLink?: string;
  referenceFileName?: string;
}) {
  const res = await fetch(getUrl("/api/quote"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to submit");
  }
  return res.json();
}

export function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("admin_token");
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(getUrl(path), {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  return res;
}
