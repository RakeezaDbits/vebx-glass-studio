#!/usr/bin/env node
/**
 * Merges scripts/catalog-data.mjs into src/locales/en.json (serviceCatalog, newServiceCatalog, serviceDetail, seo).
 * Run: node scripts/merge-service-catalog-into-en.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { serviceCatalog, newServiceCatalog } from "./catalog-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const enPath = join(__dirname, "..", "src", "locales", "en.json");
const en = JSON.parse(readFileSync(enPath, "utf8"));

en.serviceCatalog = serviceCatalog;
en.newServiceCatalog = newServiceCatalog;

en.serviceDetail = {
  badge: "Service",
  offerBefore: "What we",
  offerHighlight: "offer",
  whyBefore: "Why work with",
  whyHighlight: "us",
  ctaReadyPrefix: "Ready for",
  ctaReadySuffix: "?",
  ctaDesc: "Let's discuss your project and build something great together.",
  ctaButton: "Let's Talk",
  backAllServices: "← All Services",
};

en.seo = {
  homeTitle: "Home",
  homeDescription:
    "vebxrun — Mobile apps, web development, game development, metaverse, AI solutions & digital marketing. Imagine. Innovate. Inspire.",
  servicesTitle: "Services",
  servicesDescription:
    "Mobile apps, web & CMS development, software development, corporate branding, digital marketing, 2D/3D animation, metaverse, game development & more. Explore vebxrun services.",
};

writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n", "utf8");
console.log("Merged service catalog + serviceDetail + seo into en.json");
