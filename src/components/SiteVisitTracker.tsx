import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { postSiteVisit } from "@/lib/api";

/** Records public page views for the admin analytics dashboard (skips /admin). */
export default function SiteVisitTracker() {
  const loc = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (loc.pathname.startsWith("/admin")) return;
    if (prevPath.current === loc.pathname) return;
    prevPath.current = loc.pathname;
    postSiteVisit(loc.pathname || "/");
  }, [loc.pathname]);

  return null;
}
