import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Mail, FileText, FolderOpen, Wrench, Settings, Users, Eye, AlertCircle, Megaphone } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { fetchAdminAnalytics, getResolvedApiBase, type AdminAnalyticsSummary } from "@/lib/api";

function emptyAnalytics(days: number): AdminAnalyticsSummary {
  return {
    days,
    totals: { pageViews: 0, uniqueVisitors: 0 },
    byDay: [],
    countries: [],
  };
}

const quickLinks = [
  { to: "/admin/contacts", label: "Contact Submissions", icon: Mail },
  { to: "/admin/quotes", label: "Quote Submissions", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/expertise", label: "Expertise", icon: Wrench },
  { to: "/admin/social-automation", label: "Social automation", icon: Megaphone },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const chartConfig = {
  pageViews: { label: "Page views", color: "hsl(262.1 83.3% 57.8%)" },
  uniqueVisitors: { label: "Unique visitors", color: "hsl(173 58% 42%)" },
} as const;

function regionLabel(code: string): string {
  if (code === "UN") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function colorForCountryCode(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i += 1) h = (h * 31 + code.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 62% 52%)`;
}

function mergeSeries(
  byDay: { date: string; pageViews: number; uniqueVisitors: number }[],
  days: number
) {
  const end = new Date();
  const start = subDays(end, days - 1);
  const keys = eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
  const map = new Map(byDay.map((r) => [r.date, r]));
  return keys.map((date) => {
    const row = map.get(date);
    return {
      date,
      label: format(new Date(date + "T12:00:00"), "MMM d"),
      pageViews: row?.pageViews ?? 0,
      uniqueVisitors: row?.uniqueVisitors ?? 0,
    };
  });
}

function AnalyticsPanels({ data, chartData }: { data: AdminAnalyticsSummary; chartData: ReturnType<typeof mergeSeries> }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="liquid-glass rounded-xl border-glow p-5 flex items-center gap-4">
          <div className="rounded-lg bg-primary/15 p-3">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Page views</div>
            <div className="text-2xl font-bold tabular-nums">{data.totals.pageViews.toLocaleString()}</div>
          </div>
        </div>
        <div className="liquid-glass rounded-xl border-glow p-5 flex items-center gap-4">
          <div className="rounded-lg bg-primary/15 p-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Unique visitors</div>
            <div className="text-2xl font-bold tabular-nums">{data.totals.uniqueVisitors.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 liquid-glass rounded-xl border-glow p-5">
          <h2 className="font-display font-semibold text-lg mb-1">Visits over time</h2>
          <p className="text-xs text-muted-foreground mb-4">
            {data.dataSource === "ga4"
              ? "Daily page views and active users (Google Analytics 4)"
              : "Daily page views and unique visitors"}
          </p>
          <ChartContainer config={chartConfig} className="aspect-[16/9] min-h-[260px] w-full max-w-none">
            <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
              <YAxis width={44} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="var(--color-pageViews)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="uniqueVisitors"
                stroke="var(--color-uniqueVisitors)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-6 rounded-full shrink-0" style={{ background: chartConfig.pageViews.color }} />
              Page views
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-6 rounded-full shrink-0" style={{ background: chartConfig.uniqueVisitors.color }} />
              Unique visitors
            </span>
          </div>
        </div>

        <div className="liquid-glass rounded-xl border-glow p-5 flex flex-col min-h-[280px]">
          <h2 className="font-display font-semibold text-lg mb-1">By country</h2>
          <p className="text-xs text-muted-foreground mb-4">Share of page views (%)</p>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] pr-1">
            {data.countries.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {data.dataSource === "ga4"
                  ? "No country breakdown for this range in GA4."
                  : "No traffic in this range yet. Each public page hit stores IP → country (GeoIP) on the server."}
              </p>
            )}
            {data.countries.map((c) => (
              <div key={c.code} className="space-y-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-border/60"
                      style={{ backgroundColor: colorForCountryCode(c.code) }}
                    />
                    <span className="truncate font-medium">{regionLabel(c.code)}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">{c.code}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {c.percent}% · {c.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, c.percent)}%`,
                      backgroundColor: colorForCountryCode(c.code),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const days = 30;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-analytics", days],
    queryFn: () => fetchAdminAnalytics(days),
    retry: 1,
  });

  const displayData = useMemo(() => {
    if (data) return data;
    if (isError) return emptyAnalytics(days);
    return undefined;
  }, [data, isError, days]);

  const chartData = useMemo(() => {
    if (!displayData?.byDay) return [];
    return mergeSeries(displayData.byDay, displayData.days);
  }, [displayData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Traffic from the public site (last {days} days). Admin routes are not tracked.
          {displayData?.dataSource === "ga4" && (
            <span className="block mt-1 text-primary/90">
              Source: Google Analytics 4 — page views (screen views) and active users.
            </span>
          )}
          {data?.dataSource === "self_hosted" && (
            <span className="block mt-1">Source: on-site visit log (database): IP, country, path.</span>
          )}
        </p>
      </div>

      {isError && (
        <div
          role="alert"
          className="liquid-glass rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-4 text-sm flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="min-w-0 space-y-2">
            <p className="font-medium text-destructive">Analytics API did not respond</p>
            <p className="text-muted-foreground break-words">
              {error instanceof Error ? error.message : "Unknown error"}. Resolved API base:{" "}
              <span className="text-foreground font-mono text-xs">{getResolvedApiBase()}</span>
            </p>
            <p className="text-muted-foreground text-xs">
              The chart below is empty until the admin request reaches your Node server. Easiest fix: in the project
              root <code className="text-foreground">.env</code> set{" "}
              <code className="text-foreground">VITE_API_URL=https://YOUR-NODE-PUBLIC-ORIGIN</code> (no{" "}
              <code className="text-foreground">/api</code> suffix), run <code className="text-foreground">npm run build</code>
              , upload <code className="text-foreground">dist/</code>. Or configure your web server so{" "}
              <code className="text-foreground">/api</code> proxies to Node (see{" "}
              <code className="text-foreground">server/nginx.example.conf</code>). DB-only charts:{" "}
              <code className="text-foreground">ANALYTICS_DASHBOARD_SOURCE=mysql</code> in{" "}
              <code className="text-foreground">server/.env</code>.
            </p>
          </div>
        </div>
      )}

      {isLoading && !displayData && (
        <div className="liquid-glass rounded-xl border-glow p-8 text-muted-foreground text-sm">Loading analytics…</div>
      )}

      {displayData && <AnalyticsPanels data={displayData} chartData={chartData} />}

      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Quick links</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="liquid-glass rounded-xl border-glow p-6 flex items-center gap-4 hover:bg-white/5 transition-colors"
            >
              <c.icon className="w-8 h-8 text-primary" />
              <span className="font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
