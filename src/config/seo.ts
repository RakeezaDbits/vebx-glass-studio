/**
 * Central SEO config. Update SITE_URL when deploying to production.
 */
export const SEO_CONFIG = {
  /** Full site URL with no trailing slash (e.g. https://vebx.run) */
  SITE_URL: "https://vebx.run",
  defaultTitle: "vebx.run — Imagine. Innovate. Inspire.",
  defaultDescription:
    "vebx.run delivers cutting-edge mobile apps, web development, game development, metaverse, AI solutions, and digital marketing. Transform your ideas into reality.",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@vebxrun",
  locale: "en_US",
  themeColor: "#0a0a0a",
} as const;

export function absoluteUrl(path: string): string {
  const base = SEO_CONFIG.SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
