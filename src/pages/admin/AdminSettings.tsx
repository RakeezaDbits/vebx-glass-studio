import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/api";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => ({}))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="liquid-glass rounded-xl border-glow p-6 max-w-xl space-y-6">
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input
            value={settings.contact_email ?? ""}
            onChange={(e) => handleChange("contact_email", e.target.value)}
            placeholder="support@vebx.run"
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Contact Address</Label>
          <Textarea
            value={settings.contact_address ?? ""}
            onChange={(e) => handleChange("contact_address", e.target.value)}
            placeholder="117 S Lexington Street..."
            rows={2}
            className="bg-secondary/50 resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Contact Phone</Label>
          <Input
            value={settings.contact_phone ?? ""}
            onChange={(e) => handleChange("contact_phone", e.target.value)}
            placeholder="+1 234 567 8900"
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Business Hours</Label>
          <Input
            value={settings.business_hours ?? ""}
            onChange={(e) => handleChange("business_hours", e.target.value)}
            placeholder="Mon-Fri: 9AM-6PM"
            className="bg-secondary/50"
          />
        </div>
        <Button onClick={handleSave} variant="hero" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
