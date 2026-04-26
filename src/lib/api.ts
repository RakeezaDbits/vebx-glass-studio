/** No trailing slash; avoids `https://host.com/` + `/api` double-slash issues. */
const API_BASE = (() => {
  const raw = String(import.meta.env.VITE_API_URL ?? "").trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
})();

/** Vite `base` (e.g. `/` or `/subdir/`). Same-origin `/api` must sit under this path on some hosts. */
function viteAppBasePath(): string {
  let b = String(import.meta.env.BASE_URL || "/").trim();
  if (!b || b === "/") return "";
  b = b.replace(/\/+$/, "");
  if (!b.startsWith("/")) b = `/${b}`;
  return b;
}

/**
 * Optional override from `api-config.json` (same folder as `index.html`, respecting Vite `base`).
 * Use when the marketing site is static-only but Node runs on another URL (subdomain, Hostinger Node URL, etc.).
 * Example: { "apiBase": "https://api.vebxrun.com" } — no trailing slash, no /api suffix.
 */
let runtimeApiBase: string | null | undefined = undefined;

function apiConfigJsonUrl(): string {
  const sub = viteAppBasePath();
  if (typeof window === "undefined") return sub ? `${sub}/api-config.json` : "/api-config.json";
  if (sub) return `${window.location.origin}${sub}/api-config.json`;
  return "/api-config.json";
}

export async function loadRuntimeApiConfig(): Promise<void> {
  if (runtimeApiBase !== undefined) return;
  if (typeof window === "undefined") {
    runtimeApiBase = null;
    return;
  }
  try {
    const r = await fetch(apiConfigJsonUrl(), { cache: "no-store" });
    if (!r.ok) {
      runtimeApiBase = null;
      return;
    }
    const j = (await r.json()) as { apiBase?: unknown };
    const b = typeof j.apiBase === "string" ? j.apiBase.trim().replace(/\/+$/, "") : "";
    runtimeApiBase = b || null;
  } catch {
    runtimeApiBase = null;
  }
}

function effectiveApiBase(): string {
  if (runtimeApiBase === undefined || runtimeApiBase === null) return API_BASE;
  return runtimeApiBase;
}

export function getUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const root = effectiveApiBase();
  if (root) return `${root}${p}`;

  const sub = viteAppBasePath();
  if (sub && typeof window !== "undefined") {
    return `${window.location.origin}${sub}${p}`;
  }
  return p;
}

/** For support / env debugging (dashboard error messages). */
export function getResolvedApiBase(): string {
  const b = effectiveApiBase();
  if (b) return b;
  const sub = viteAppBasePath();
  if (sub) return `(same origin + Vite base ${sub})`;
  return "(same origin — relative /api/…)";
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

const VISITOR_KEY = "vebx_visitor_id";

export function getOrCreateVisitorId(): string {
  if (typeof localStorage === "undefined") return "anon";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id || !/^[a-zA-Z0-9_-]{8,40}$/.test(id)) {
    const raw =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2, 14)}`;
    id = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
    if (id.length < 8) id = `v_${Date.now()}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** Fire-and-forget page view for analytics (ignored if API unreachable). */
export function postSiteVisit(path: string): void {
  const visitorKey = getOrCreateVisitorId();
  void fetch(getUrl("/api/analytics/visit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: path || "/", visitorKey }),
  }).catch(() => {});
}

export type AdminAnalyticsSummary = {
  days: number;
  totals: { pageViews: number; uniqueVisitors: number };
  byDay: { date: string; pageViews: number; uniqueVisitors: number }[];
  countries: { code: string; count: number; percent: number }[];
  /** `ga4` | `self_hosted` from API. */
  dataSource?: "ga4" | "self_hosted";
};

function isAnalyticsSummaryBody(x: unknown): x is AdminAnalyticsSummary {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.days === "number" &&
    o.totals !== null &&
    typeof o.totals === "object" &&
    Array.isArray(o.byDay) &&
    Array.isArray(o.countries)
  );
}

export async function fetchAdminAnalytics(days = 30): Promise<AdminAnalyticsSummary> {
  const q = `?days=${days}`;
  const paths = [
    `/api/health/analytics${q}`,
    `/api/summary${q}`,
    `/api/analytics-dashboard${q}`,
    `/api/analytics/dashboard${q}`,
    `/api/admin/analytics/summary${q}`,
  ];
  const attempts: string[] = [];

  for (const p of paths) {
    const fullUrl = getUrl(p);
    attempts.push(`${fullUrl} → …`);
    const res = await adminFetch(p);
    const ct = (res.headers.get("content-type") || "").toLowerCase();

    if (!res.ok) {
      attempts[attempts.length - 1] = `${fullUrl} → HTTP ${res.status}`;
      const err = await res.json().catch(() => ({}));
      const serverMsg = (err as { error?: string }).error?.trim();
      if (res.status === 404) continue;
      throw new Error(serverMsg || `Analytics failed (HTTP ${res.status}). API: ${getResolvedApiBase()}`);
    }

    if (!ct.includes("application/json")) {
      attempts[attempts.length - 1] = `${fullUrl} → not JSON (${ct.slice(0, 40) || "no content-type"})`;
      continue;
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      attempts[attempts.length - 1] = `${fullUrl} → invalid JSON`;
      continue;
    }

    if (isAnalyticsSummaryBody(data)) {
      return data;
    }
    attempts[attempts.length - 1] = `${fullUrl} → wrong JSON shape`;
  }

  const healthTry = getUrl("/api/health");
  const analyticsTry = getUrl(`/api/health/analytics${q}`);
  throw new Error(
    `Analytics failed (all paths 404). If "${healthTry}" shows {"ok":true} but dashboard still fails, your host is probably not forwarding every /api/* path to Node — redeploy the latest server code (it adds ${analyticsTry} as a fallback), or fix nginx so the full URI reaches Express (see server/nginx.example.conf). Other fixes: set VITE_API_URL in root .env and rebuild, or set apiBase in api-config.json. Tried: ${attempts.join(" | ")}. Base: ${getResolvedApiBase()}`
  );
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  await loadRuntimeApiConfig();
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
  await loadRuntimeApiConfig();
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
  await loadRuntimeApiConfig();
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
        : "Chat is temporarily unavailable. Try again in a moment or email support@vebxrun.com."
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
        : "Chat is temporarily unavailable. Try again in a moment or email support@vebxrun.com."
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
