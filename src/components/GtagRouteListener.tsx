import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-KJGZND4KYS";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** SPA navigations → GA4 page_path (initial load already counted by index.html snippet). Skips /admin. */
export default function GtagRouteListener() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    if (pathname.startsWith("/admin")) {
      first.current = false;
      return;
    }

    if (first.current) {
      first.current = false;
      return;
    }

    window.gtag("config", GA_ID, {
      page_path: pathname + search,
    });
  }, [pathname, search]);

  return null;
}
