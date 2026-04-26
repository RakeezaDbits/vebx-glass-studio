import db from "../config/db.js";
import { ensureAnalyticsTables } from "./ensureAnalyticsTables.js";
import { fetchGa4AnalyticsSummary, isGa4EnvConfigured } from "./ga4Analytics.js";

function analyticsPrefersMysql() {
  const v = String(process.env.ANALYTICS_DASHBOARD_SOURCE || process.env.ANALYTICS_SOURCE || "")
    .trim()
    .toLowerCase();
  return v === "mysql" || v === "db" || v === "database" || v === "self_hosted" || v === "self-hosted";
}

/** Shared handler for GET admin traffic summary (mounted under /api/admin and /api/analytics). */
export async function sendAdminAnalyticsSummary(req, res) {
  try {
    const days = Math.min(90, Math.max(7, parseInt(String(req.query.days || "30"), 10) || 30));
    const windowDays = Math.min(89, Math.max(0, days - 1));

    if (!analyticsPrefersMysql()) {
      const ga4 = await fetchGa4AnalyticsSummary(days);
      if (ga4) {
        return res.json(ga4);
      }
      if (isGa4EnvConfigured()) {
        console.warn("[ga4] GA4 env is set but reports returned no data — falling back to MySQL site_visits.");
      }
    }

    await ensureAnalyticsTables();

    const intervalSql = `DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ${windowDays} DAY)`;

    const [totRow] = await db.execute(
      `SELECT COUNT(*) AS page_views, COUNT(DISTINCT visitor_key) AS unique_visitors
       FROM site_visits
       WHERE ${intervalSql}`
    );
    const pageViewsTotal = Number(totRow[0]?.page_views || 0);
    const uniqueVisitorsTotal = Number(totRow[0]?.unique_visitors || 0);

    const [byDay] = await db.execute(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d,
        COUNT(*) AS page_views,
        COUNT(DISTINCT visitor_key) AS unique_visitors
       FROM site_visits
       WHERE ${intervalSql}
       GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
       ORDER BY d ASC`
    );

    const [byCountry] = await db.execute(
      `SELECT country_code AS code, COUNT(*) AS cnt
       FROM site_visits
       WHERE ${intervalSql}
       GROUP BY country_code
       ORDER BY cnt DESC
       LIMIT 32`
    );

    const countries = byCountry.map((r) => {
      const cnt = Number(r.cnt || 0);
      const percent = pageViewsTotal > 0 ? Math.round((cnt * 1000) / pageViewsTotal) / 10 : 0;
      return { code: String(r.code || "UN"), count: cnt, percent };
    });

    res.json({
      days,
      totals: { pageViews: pageViewsTotal, uniqueVisitors: uniqueVisitorsTotal },
      byDay: byDay.map((r) => ({
        date: r.d,
        pageViews: Number(r.page_views || 0),
        uniqueVisitors: Number(r.unique_visitors || 0),
      })),
      countries,
      dataSource: "self_hosted",
    });
  } catch (err) {
    console.error("[analytics] summary", err);
    const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
    const hint =
      code === "ER_NO_SUCH_TABLE"
        ? "Database is missing site_visits. Redeploy API or run server/sql/schema.sql."
        : "Failed to load analytics";
    res.status(500).json({ error: hint });
  }
}
