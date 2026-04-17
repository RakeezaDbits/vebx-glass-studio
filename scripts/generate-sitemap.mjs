#!/usr/bin/env node
/**
 * Generates public/sitemap.xml. Run after adding new pages or services.
 * npm run generate-sitemap
 *
 * Set SITE_URL to match your canonical domain and Google Search Console property:
 * - URL-prefix property https://vebx.run → SITE_URL=https://vebx.run
 * - URL-prefix property https://www.vebx.run → SITE_URL=https://www.vebx.run
 * If they differ, GSC reports "URL not allowed" for every <loc>.
 * A Domain property (vebx.run) avoids host mismatch for sitemaps.
 *
 * Example: SITE_URL=https://www.vebx.run npm run generate-sitemap
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || "https://vebx.run").replace(/\/$/, "");

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/services/mobile-application", changefreq: "monthly", priority: "0.8" },
  { path: "/services/web-cms-development", changefreq: "monthly", priority: "0.8" },
  { path: "/services/software-development", changefreq: "monthly", priority: "0.8" },
  { path: "/services/corporate-branding", changefreq: "monthly", priority: "0.8" },
  { path: "/services/online-digital-marketing", changefreq: "monthly", priority: "0.8" },
  { path: "/services/2d-3d-animation", changefreq: "monthly", priority: "0.8" },
  { path: "/services/3d-rendering-services", changefreq: "monthly", priority: "0.8" },
  { path: "/services/metaverse-development", changefreq: "monthly", priority: "0.8" },
  { path: "/services/game-development", changefreq: "monthly", priority: "0.8" },
  { path: "/services/extended-reality", changefreq: "monthly", priority: "0.8" },
  { path: "/services/social-media-marketing", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services", changefreq: "monthly", priority: "0.9" },
  { path: "/new-services/ai", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/ebook", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/magazine", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/e-newspaper", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/podcast", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/infographics", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/chatbot", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/copywriting", changefreq: "monthly", priority: "0.8" },
  { path: "/new-services/social-content", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/our-work", changefreq: "monthly", priority: "0.9" },
  { path: "/expertise", changefreq: "monthly", priority: "0.9" },
  { path: "/projects", changefreq: "monthly", priority: "0.85" },
  { path: "/ai", changefreq: "monthly", priority: "0.85" },
  { path: "/contact", changefreq: "monthly", priority: "0.9" },
  { path: "/design-assistant", changefreq: "monthly", priority: "0.85" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.5" },
];

const lastmod = new Date().toISOString().split("T")[0];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`).join("\n")}
</urlset>
`;

const outPath = join(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log("Generated:", outPath);

const robotsPath = join(__dirname, "..", "public", "robots.txt");
try {
  let robots = readFileSync(robotsPath, "utf8");
  robots = robots.replace(/^Sitemap:\s*.+$/m, `Sitemap: ${SITE_URL}/sitemap.xml`);
  writeFileSync(robotsPath, robots, "utf8");
  console.log("Updated Sitemap line in:", robotsPath);
} catch {
  /* robots.txt optional */
}
