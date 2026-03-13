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
  referenceImageRef?: string;
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

const AI_QUOTE_REF_KEY = "vebx_ai_quote_ref";

export function getStoredAIQuoteRef(): string | null {
  return localStorage.getItem(AI_QUOTE_REF_KEY);
}

export function setStoredAIQuoteRef(ref: string | null): void {
  if (ref) localStorage.setItem(AI_QUOTE_REF_KEY, ref);
  else localStorage.removeItem(AI_QUOTE_REF_KEY);
}

export function getChatCredits(deviceId: string): Promise<{ remaining: number; limit: number }> {
  return fetch(getUrl(`/api/chat/credits?deviceId=${encodeURIComponent(deviceId)}`))
    .then((r) => r.json())
    .catch(() => ({ remaining: 0, limit: 5 }));
}

export function generateAIImage(prompt: string, deviceId: string): Promise<{
  ref: string;
  creditsLeft: number;
  limit: number;
}> {
  const res = fetch(getUrl("/api/chat/generate-image"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, deviceId }),
  }).then((r) => {
    if (!r.ok) return r.json().then((d) => Promise.reject(new Error((d as { error?: string }).error || "Failed")));
    return r.json();
  });
  return res;
}

export function getGeneratedImageUrl(ref: string): string {
  return getUrl(`/api/chat/generated-image/${ref}`);
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
