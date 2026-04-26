import geoip from "geoip-lite";

/** Best-effort country from reverse-proxy headers (CDN / host). */
export function countryFromRequest(req) {
  const h = req.headers;
  const candidates = [
    h["cf-ipcountry"],
    h["cloudfront-viewer-country"],
    h["x-vercel-ip-country"],
    h["x-appengine-country"],
    h["x-geo-country"],
  ];
  for (const raw of candidates) {
    const v = String(raw ?? "")
      .trim()
      .toUpperCase();
    if (v.length === 2 && v !== "XX" && /^[A-Z]{2}$/.test(v)) return v;
  }
  return "UN";
}

/** Client IP for geo (respects X-Forwarded-For when trust proxy is set). */
export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const first = String(xff).split(",")[0].trim();
    if (first) return normalizeIp(first);
  }
  const cf = req.headers["cf-connecting-ip"];
  if (cf) return normalizeIp(String(cf).trim());
  const real = req.headers["x-real-ip"];
  if (real) return normalizeIp(String(real).trim());
  if (req.ip) return normalizeIp(String(req.ip).trim());
  if (req.socket?.remoteAddress) return normalizeIp(String(req.socket.remoteAddress).trim());
  return "";
}

function normalizeIp(ip) {
  const s = String(ip).trim();
  if (s.startsWith("::ffff:")) return s.slice(7);
  return s;
}

/** Offline MaxMind-derived country from IPv4/IPv6 (geoip-lite). */
export function countryFromIp(ip) {
  if (!ip) return "UN";
  const ipNorm = normalizeIp(ip);
  if (!ipNorm || ipNorm === "127.0.0.1" || ipNorm === "::1") return "UN";
  try {
    const geo = geoip.lookup(ipNorm);
    if (!geo?.country) return "UN";
    const c = String(geo.country).toUpperCase();
    if (c.length === 2 && /^[A-Z]{2}$/.test(c)) return c;
  } catch {
    /* ignore */
  }
  return "UN";
}

/**
 * Final country for a visit: optional body override, then CDN headers, then GeoIP from IP.
 */
export function resolveVisitCountry(req, bodyCountryOverride) {
  const o = String(bodyCountryOverride ?? "")
    .trim()
    .toUpperCase();
  if (o.length === 2 && /^[A-Z]{2}$/.test(o) && o !== "XX") return o;

  const fromHeaders = countryFromRequest(req);
  if (fromHeaders !== "UN") return fromHeaders;

  return countryFromIp(getClientIp(req));
}
