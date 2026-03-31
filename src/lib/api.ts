const API_BASE = import.meta.env.VITE_API_URL || "";

function getUrl(path: string) {
  return `${API_BASE}${path}`;
}

/** URL for visitor live-chat SSE (same-origin or VITE_API_URL). */
export function getLiveChatEventsUrl(token: string): string {
  return getUrl(`/api/livechat/${encodeURIComponent(token)}/events`);
}

/** URL for admin live-chat SSE (EventSource cannot set Authorization). */
export function getAdminLiveChatEventsUrl(sessionId: number, accessToken: string): string {
  return getUrl(
    `/api/admin/livechat/sessions/${sessionId}/events?access_token=${encodeURIComponent(accessToken)}`
  );
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

/** POST multipart (do not set Content-Type; browser sets boundary). */
export async function adminFetchForm(path: string, formData: FormData): Promise<Response> {
  const token = getAdminToken();
  const res = await fetch(getUrl(path), {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  return res;
}

export async function adminFetchBlob(path: string): Promise<Blob> {
  const token = getAdminToken();
  const res = await fetch(getUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Failed to load file");
  return res.blob();
}

const LIVE_CHAT_TOKEN_KEY = "vebx_live_chat_token";

export function getLiveChatToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(LIVE_CHAT_TOKEN_KEY);
}

export function setLiveChatToken(token: string): void {
  localStorage.setItem(LIVE_CHAT_TOKEN_KEY, token);
}

export function clearLiveChatToken(): void {
  localStorage.removeItem(LIVE_CHAT_TOKEN_KEY);
}

function parseLiveChatJson<T extends object>(raw: string): T {
  try {
    const o = JSON.parse(raw) as T;
    return o && typeof o === "object" ? o : ({} as T);
  } catch {
    return {} as T;
  }
}

/** Prefer JSON `error` from API/proxy; then status-specific hints (incl. Vite empty-500 when API is down). */
function throwLiveChatHttpError(
  res: Response,
  raw: string,
  opts: { devEmpty500?: string; fallback: string }
): never {
  const data = parseLiveChatJson<{ error?: string }>(raw);
  const fromServer = data.error?.trim();
  if (fromServer) throw new Error(fromServer);
  if (res.status === 502 || res.status === 503) {
    throw new Error(
      import.meta.env.DEV
        ? "Chat API unreachable (502/503). Start npm run server (port 3001) or npm run dev:all."
        : "Chat is temporarily unavailable. Try again in a moment or email support@vebx.run."
    );
  }
  if (import.meta.env.DEV && res.status === 500 && !String(raw).trim() && opts.devEmpty500) {
    throw new Error(opts.devEmpty500);
  }
  throw new Error(opts.fallback);
}

export type LiveChatMessageRow = {
  id: number;
  sender: "visitor" | "admin";
  msg_type: string;
  body: string | null;
  mime_type: string | null;
  created_at: string;
};

export async function createLiveChatSession(): Promise<{ token: string }> {
  let res: Response;
  try {
    res = await fetch(getUrl("/api/livechat/session"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  } catch {
    throw new Error(
      "Cannot reach chat server. Use dev with API running (port 3001), or set VITE_API_URL to your live API."
    );
  }
  const raw = await res.text();
  const data = parseLiveChatJson<{ token?: string; error?: string }>(raw);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "Chat API not found (404). Deploy the Node server and proxy /api, or set VITE_API_URL."
      );
    }
    throwLiveChatHttpError(res, raw, {
      devEmpty500:
        "Backend returned an empty 500 — usually nothing is listening on port 3001. Run npm run server or npm run dev:all.",
      fallback: `Server error (${res.status}). If the database is missing live_chat tables, run the SQL migration.`,
    });
  }
  if (!data.token) throw new Error("Invalid response from chat server.");
  setLiveChatToken(data.token);
  return { token: data.token };
}

export async function fetchLiveChatMessages(token: string, afterId: number): Promise<LiveChatMessageRow[]> {
  let res: Response;
  try {
    res = await fetch(getUrl(`/api/livechat/${encodeURIComponent(token)}/messages?afterId=${afterId}`));
  } catch {
    throw new Error(
      import.meta.env.DEV
        ? "Chat server unreachable. Start the API (npm run server) with npm run dev:all, or set VITE_API_URL."
        : "Chat is temporarily unavailable. Try again in a moment or email support@vebx.run."
    );
  }
  const raw = await res.text();
  const data = parseLiveChatJson<{ messages?: LiveChatMessageRow[]; error?: string }>(raw);
  if (res.status === 404) {
    clearLiveChatToken();
    throw new Error("SESSION_EXPIRED");
  }
  if (!res.ok) {
    throwLiveChatHttpError(res, raw, {
      devEmpty500:
        "Backend returned an empty 500 — usually the API on port 3001 is not running. Run npm run server or npm run dev:all.",
      fallback: `Could not load chat (${res.status}). Check that the API and database are running.`,
    });
  }
  return data.messages ?? [];
}

export function getLiveChatMediaUrl(token: string, messageId: number): string {
  return getUrl(`/api/livechat/${encodeURIComponent(token)}/file/${messageId}`);
}

/** Returns new message id when server sends it (201), for advancing poll cursor without duplicate fetches. */
export async function postLiveChatMessage(token: string, formData: FormData): Promise<{ id: number } | undefined> {
  const res = await fetch(getUrl(`/api/livechat/${encodeURIComponent(token)}/messages`), {
    method: "POST",
    body: formData,
  });
  const raw = await res.text();
  if (res.status === 404) {
    clearLiveChatToken();
    throw new Error("SESSION_EXPIRED");
  }
  if (!res.ok) {
    throwLiveChatHttpError(res, raw, {
      devEmpty500:
        "Backend returned an empty 500 — usually the API on port 3001 is not running. Run npm run server or npm run dev:all.",
      fallback: "Failed to send",
    });
  }
  try {
    const o = JSON.parse(raw) as { id?: number | string };
    const id = o.id;
    const n =
      typeof id === "number" && Number.isFinite(id)
        ? id
        : typeof id === "string" && /^\d+$/.test(id)
          ? Number(id)
          : NaN;
    if (!Number.isNaN(n)) return { id: n };
  } catch {
    /* ignore */
  }
  return undefined;
}
