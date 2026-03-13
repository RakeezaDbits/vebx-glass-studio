/**
 * Simple device fingerprint for AI chat credits (no PII).
 * Stored in localStorage so it persists per browser.
 */
const KEY = "vebx_device_id";

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (id) return id;
    const parts = [
      navigator.userAgent,
      navigator.language,
      typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "",
      new Date().getTimezoneOffset(),
    ].filter(Boolean);
    id = simpleHash(parts.join("|")) + "-" + simpleHash(Date.now().toString());
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return "anon-" + Math.random().toString(36).slice(2, 12);
  }
}
