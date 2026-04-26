import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch, getUrl, loadRuntimeApiConfig } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Megaphone, FlaskConical, ListOrdered } from "lucide-react";

type EnvKeyRow = { key: string; configured: boolean };

type LoadPayload = {
  envPlatforms: Record<string, EnvKeyRow[]>;
  settings: Record<string, string>;
};

function truthy(v: string | undefined) {
  return v === "1" || v === "true" || v === "on" || v === "yes";
}

function PlatformCard({
  title,
  description,
  rows,
  enabled,
  onEnabledChange,
  onTest,
}: {
  title: string;
  description: string;
  rows: EnvKeyRow[];
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  onTest: () => void;
}) {
  const configuredCount = rows.filter((r) => r.configured).length;
  return (
    <Card className="liquid-glass border-glow">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Label htmlFor={`social-en-${title}`} className="text-xs text-muted-foreground">
              Enable
            </Label>
            <Switch id={`social-en-${title}`} checked={enabled} onCheckedChange={onEnabledChange} />
          </div>
          <Badge variant={configuredCount === rows.length ? "default" : "secondary"}>
            {configuredCount}/{rows.length} env keys
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Secrets live in <code className="text-foreground">server/.env</code> — this panel only shows whether each
          variable is set on the server (not the value).
        </p>
        <ul className="space-y-1.5 text-sm">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center justify-between gap-2 font-mono text-xs">
              <span className="truncate">{r.key}</span>
              <Badge variant={r.configured ? "outline" : "destructive"} className="shrink-0">
                {r.configured ? "set" : "empty"}
              </Badge>
            </li>
          ))}
        </ul>
        <Button type="button" variant="secondary" size="sm" className="gap-2" onClick={onTest}>
          <FlaskConical className="w-4 h-4" />
          Test connection (stub)
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminSocialAutomation() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [envPlatforms, setEnvPlatforms] = useState<Record<string, EnvKeyRow[]>>({});
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [webhookUrl, setWebhookUrl] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await loadRuntimeApiConfig();
      setWebhookUrl(getUrl("/api/social/webhooks/meta"));
      const r = await adminFetch("/api/admin/social-automation");
      const j = (await r.json()) as LoadPayload;
      setEnvPlatforms(j.envPlatforms ?? {});
      setSettings(j.settings ?? {});
    } catch {
      toast.error("Could not load social automation");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setBool = (key: string, v: boolean) => {
    setSettings((s) => ({ ...s, [key]: v ? "1" : "0" }));
  };

  const setField = (key: string, v: string) => {
    setSettings((s) => ({ ...s, [key]: v }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/social-automation", {
        method: "PUT",
        body: JSON.stringify({ settings }),
      });
      toast.success("Automation preferences saved");
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const runTest = useCallback(async (platform: string) => {
    try {
      const r = await adminFetch("/api/admin/social-automation/test", {
        method: "POST",
        body: JSON.stringify({ platform }),
      });
      const j = (await r.json()) as { message?: string };
      toast.message(j.message || "OK");
    } catch {
      toast.error("Test request failed");
    }
  }, []);

  const dryRun = useCallback(async () => {
    try {
      const r = await adminFetch("/api/admin/social-automation/queue/dry-run", { method: "POST", body: "{}" });
      const j = (await r.json()) as { message?: string };
      toast.message(j.message || "Dry run OK");
    } catch {
      toast.error("Dry run failed");
    }
  }, []);

  const master = truthy(settings.social_auto_master_enabled);

  const platformProps = useMemo(
    () => ({
      facebook: {
        title: "Facebook",
        description: "Page posts, lead ads sync, and Meta webhook subscription (Graph API).",
        rows: envPlatforms.facebook ?? [],
        enabled: truthy(settings.social_auto_fb_enabled),
        onEnabledChange: (v: boolean) => setBool("social_auto_fb_enabled", v),
        onTest: () => void runTest("facebook"),
      },
      instagram: {
        title: "Instagram",
        description: "Business/Creator account via Meta — reels & feed (requires linked Facebook Page).",
        rows: envPlatforms.instagram ?? [],
        enabled: truthy(settings.social_auto_ig_enabled),
        onEnabledChange: (v: boolean) => setBool("social_auto_ig_enabled", v),
        onTest: () => void runTest("instagram"),
      },
      linkedin: {
        title: "LinkedIn",
        description: "Organization posts and newsletter-style updates (Marketing API / REST).",
        rows: envPlatforms.linkedin ?? [],
        enabled: truthy(settings.social_auto_li_enabled),
        onEnabledChange: (v: boolean) => setBool("social_auto_li_enabled", v),
        onTest: () => void runTest("linkedin"),
      },
      twitter: {
        title: "Twitter / X",
        description: "Tweets, media, and polls (API v2 with OAuth 1.0a or OAuth 2.0 user context).",
        rows: envPlatforms.twitter ?? [],
        enabled: truthy(settings.social_auto_tw_enabled),
        onEnabledChange: (v: boolean) => setBool("social_auto_tw_enabled", v),
        onTest: () => void runTest("twitter"),
      },
    }),
    [envPlatforms, settings, runTest]
  );

  if (loading) return <p className="text-muted-foreground">Loading social automation…</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-primary" />
            Social media automation
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Wire API credentials in <code className="text-foreground">server/.env</code>, restart the API, then use
            these toggles and rules. Publishing is stubbed until SDK calls are added server-side.
          </p>
        </div>
        <Button variant="hero" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save preferences"}
        </Button>
      </div>

      <Card className="liquid-glass border-glow border-primary/20">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Master switch</CardTitle>
              <CardDescription>When off, no automation jobs should run (implementation pending).</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="master">Automation enabled</Label>
              <Switch
                id="master"
                checked={master}
                onCheckedChange={(v) => setBool("social_auto_master_enabled", v)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
          <TabsTrigger value="rules">Automation rules</TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="mt-4">
          <PlatformCard {...platformProps.facebook} />
        </TabsContent>
        <TabsContent value="instagram" className="mt-4">
          <PlatformCard {...platformProps.instagram} />
        </TabsContent>
        <TabsContent value="linkedin" className="mt-4">
          <PlatformCard {...platformProps.linkedin} />
        </TabsContent>
        <TabsContent value="twitter" className="mt-4">
          <PlatformCard {...platformProps.twitter} />
        </TabsContent>

        <TabsContent value="rules" className="mt-4 space-y-4">
          <Card className="liquid-glass border-glow">
            <CardHeader>
              <CardTitle className="text-lg">Posting &amp; behaviour</CardTitle>
              <CardDescription>Stored in site settings — safe to edit from the admin UI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">Cross-post same content</div>
                  <p className="text-xs text-muted-foreground">One draft → all enabled channels (when implemented).</p>
                </div>
                <Switch
                  checked={truthy(settings.social_auto_cross_post)}
                  onCheckedChange={(v) => setBool("social_auto_cross_post", v)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">Weekly digest email</div>
                  <p className="text-xs text-muted-foreground">Placeholder — hook to email provider later.</p>
                </div>
                <Switch
                  checked={truthy(settings.social_auto_digest_weekly)}
                  onCheckedChange={(v) => setBool("social_auto_digest_weekly", v)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">AI reply suggestions</div>
                  <p className="text-xs text-muted-foreground">Queue suggested replies for moderator approval.</p>
                </div>
                <Switch
                  checked={truthy(settings.social_auto_reply_suggestions)}
                  onCheckedChange={(v) => setBool("social_auto_reply_suggestions", v)}
                />
              </div>
              <div className="space-y-2">
                <Label>Default hashtags</Label>
                <Input
                  value={settings.social_auto_default_hashtags ?? ""}
                  onChange={(e) => setField("social_auto_default_hashtags", e.target.value)}
                  placeholder="#vebx #buildinpublic"
                  className="bg-secondary/50 font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred posting window (UTC)</Label>
                <Input
                  value={settings.social_auto_post_window_utc ?? ""}
                  onChange={(e) => setField("social_auto_post_window_utc", e.target.value)}
                  placeholder="09:00–12:00"
                  className="bg-secondary/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="liquid-glass border-glow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListOrdered className="w-5 h-5" />
                Webhook &amp; queue
              </CardTitle>
              <CardDescription>Meta subscription callback URL (GET verifies with your verify token).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Meta webhook URL</Label>
                <Textarea readOnly value={webhookUrl} className="font-mono text-xs bg-secondary/50 min-h-[72px]" />
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => void dryRun()}>
                <FlaskConical className="w-4 h-4" />
                Queue dry-run
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
