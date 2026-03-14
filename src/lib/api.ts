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

export function useChatCredit(deviceId: string): Promise<{ success: boolean; remaining: number; limit: number }> {
  return fetch(getUrl("/api/chat/use-credit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId }),
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (r.status === 402) return { success: false, remaining: data.remaining ?? 0, limit: data.limit ?? 5 };
    if (!r.ok) throw new Error((data as { error?: string }).error || "Failed");
    return { success: true, remaining: data.remaining ?? 0, limit: data.limit ?? 5 };
  });
}

/** Generate design image via backend (OpenAI DALL-E 2). Uses 1 credit. */
export async function generateDesignImage(
  deviceId: string,
  prompt: string
): Promise<{ imageData: string; remaining: number; limit: number }> {
  try {
    const r = await fetch(getUrl("/api/chat/generate-image"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, prompt: prompt.trim() }),
    });
    const raw = await r.text();
    let data: { error?: string; message?: string; imageData?: string; remaining?: number; limit?: number; details?: string } = {};
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      console.error("[generateDesignImage] Backend response (not JSON):", raw?.slice(0, 500));
      throw new Error(raw?.slice(0, 200) || `Server error (${r.status})`);
    }
    if (r.status === 402) throw new Error("No credits left for today. Try again tomorrow.");
    if (!r.ok) {
      const msg = data.error || data.message || raw?.slice(0, 300) || `Image generation failed (${r.status})`;
      console.error("[generateDesignImage] Backend error response:", { status: r.status, data, raw: raw?.slice(0, 500) });
      throw new Error(msg);
    }
    return {
      imageData: data.imageData ?? "",
      remaining: data.remaining ?? 0,
      limit: data.limit ?? 5,
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(String(err));
  }
}

export async function saveReferenceImage(
  deviceId: string,
  imageDataBase64: string
): Promise<{ ref: string }> {
  const r = await fetch(getUrl("/api/chat/save-reference-image"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, imageData: imageDataBase64 }),
  });
  const raw = await r.text();
  let data: { error?: string; message?: string; ref?: string } = {};
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    console.error("[saveReferenceImage] Backend response (not JSON):", raw?.slice(0, 500));
    throw new Error(raw?.slice(0, 200) || `Failed to save (${r.status})`);
  }
  if (!r.ok) {
    const msg = data.error || data.message || raw?.slice(0, 300) || `Failed to save (${r.status})`;
    console.error("[saveReferenceImage] Backend error:", { status: r.status, data, raw: raw?.slice(0, 500) });
    throw new Error(msg);
  }
  return { ref: data.ref ?? "" };
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
