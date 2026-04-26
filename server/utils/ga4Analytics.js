import { BetaAnalyticsDataClient } from "@google-analytics/data";

/** GA4 `date` dimension is YYYYMMDD; chart expects yyyy-MM-dd. */
function gaDateToIso(ga) {
  const s = String(ga ?? "").replace(/\D/g, "");
  if (s.length !== 8) return String(ga ?? "");
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function buildClient() {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  if (!propertyId) return null;
  if (!/^\d{5,12}$/.test(propertyId)) {
    console.error(
      "[ga4] GA4_PROPERTY_ID must be numeric only (GA4 → Admin → Property settings). Not Measurement ID (G-…) or GTM (GT-…)."
    );
    return null;
  }

  const jsonRaw = process.env.GA4_SERVICE_ACCOUNT_JSON?.trim();
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (jsonRaw) {
    try {
      const credentials = JSON.parse(jsonRaw);
      return { client: new BetaAnalyticsDataClient({ credentials }), propertyId };
    } catch (e) {
      console.error("[ga4] GA4_SERVICE_ACCOUNT_JSON is not valid JSON:", e.message);
      return null;
    }
  }
  if (keyFile) {
    return { client: new BetaAnalyticsDataClient({ keyFilename: keyFile }), propertyId };
  }
  return null;
}

/** True when GA4 env looks configured (used for logging / strict mode later). */
export function isGa4EnvConfigured() {
  const pid = process.env.GA4_PROPERTY_ID?.trim();
  if (!pid || !/^\d{5,12}$/.test(pid)) return false;
  return !!(process.env.GA4_SERVICE_ACCOUNT_JSON?.trim() || process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());
}

/**
 * When GA4_PROPERTY_ID + service account are set, returns dashboard-shaped summary
 * aligned with the admin UI: page views ≈ screenPageViews, uniques ≈ activeUsers.
 */
export async function fetchGa4AnalyticsSummary(days) {
  const built = buildClient();
  if (!built) return null;

  const { client, propertyId } = built;
  const property = `properties/${propertyId}`;
  const dayCount = Math.min(90, Math.max(7, days));
  const startDate = `${dayCount}daysAgo`;
  const dateRanges = [{ startDate, endDate: "today" }];

  try {
    const [totalsResp] = await client.runReport({
      property,
      dateRanges,
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    });
    const pageViewsTotal = Number(totalsResp.rows?.[0]?.metricValues?.[0]?.value || 0);
    const uniqueVisitorsTotal = Number(totalsResp.rows?.[0]?.metricValues?.[1]?.value || 0);

    const [dailyResp] = await client.runReport({
      property,
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 10000,
    });

    const byDay = (dailyResp.rows || []).map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value ?? "";
      return {
        date: gaDateToIso(rawDate),
        pageViews: Number(row.metricValues?.[0]?.value || 0),
        uniqueVisitors: Number(row.metricValues?.[1]?.value || 0),
      };
    });

    let countryRows = [];
    try {
      const [countryResp] = await client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "countryId" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 32,
      });
      countryRows = (countryResp.rows || []).map((row) => ({
        code: String(row.dimensionValues?.[0]?.value || "UN").slice(0, 8) || "UN",
        count: Number(row.metricValues?.[0]?.value || 0),
      }));
    } catch (e) {
      console.warn("[ga4] country report skipped:", e.message || e);
    }

    const denom = pageViewsTotal > 0 ? pageViewsTotal : countryRows.reduce((a, r) => a + r.count, 0) || 1;
    const countries = countryRows.map((r) => {
      const code = r.code === "(not set)" || !r.code ? "UN" : r.code;
      return {
        code,
        count: r.count,
        percent: denom > 0 ? Math.round((r.count * 1000) / denom) / 10 : 0,
      };
    });

    return {
      days: dayCount,
      totals: { pageViews: pageViewsTotal, uniqueVisitors: uniqueVisitorsTotal },
      byDay,
      countries,
      dataSource: "ga4",
    };
  } catch (err) {
    console.error("[ga4] runReport failed:", err.message || err);
    if (isGa4EnvConfigured()) {
      console.error(
        "[ga4] Check: (1) GA4_PROPERTY_ID is the numeric ID from GA4 → Admin → Property settings (not G-XXXX). (2) Service account email has Viewer on this property. (3) Analytics Data API enabled in Google Cloud."
      );
    }
    return null;
  }
}
