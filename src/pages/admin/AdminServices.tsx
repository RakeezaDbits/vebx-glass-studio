import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { adminFetch } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Service = {
  id: number;
  slug: string;
  title: string;
  short_desc: string | null;
  long_desc: string | null;
  icon_name: string | null;
  features: string | null;
  sort_order: number;
};

const emptyForm = { slug: "", title: "", short_desc: "", long_desc: "", icon_name: "", features: "", sort_order: 0 };

export default function AdminServices() {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/services").then((r) => r.json()).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const parseFeatures = (s: string | null): string[] => {
    if (!s) return [];
    try { const j = JSON.parse(s); return Array.isArray(j) ? j : []; } catch { return []; }
  };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (row: Service) => {
    setEditingId(row.id);
    setForm({ slug: row.slug, title: row.title, short_desc: row.short_desc || "", long_desc: row.long_desc || "", icon_name: row.icon_name || "", features: parseFeatures(row.features).join("\n"), sort_order: row.sort_order });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim()) { toast.error("Slug and title required"); return; }
    const featuresArr = form.features.split("\n").map((s) => s.trim()).filter(Boolean);
    setSaving(true);
    try {
      const body = { slug: form.slug.trim(), title: form.title.trim(), short_desc: form.short_desc.trim() || null, long_desc: form.long_desc.trim() || null, icon_name: form.icon_name.trim() || null, features: featuresArr, highlights: [], sort_order: form.sort_order };
      if (editingId) {
        await adminFetch("/api/admin/services/" + editingId, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Updated");
      } else {
        await adminFetch("/api/admin/services", { method: "POST", body: JSON.stringify(body) });
        toast.success("Added");
      }
      setOpen(false);
      load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    try {
      await adminFetch("/api/admin/services/" + id, { method: "DELETE" });
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <Button onClick={openAdd} variant="hero" size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Service</Button>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Services shown on the website.</p>
      <div className="liquid-glass rounded-xl border-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-4">{row.title}</td>
                  <td className="p-4 text-muted-foreground">{row.slug}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(row)} className="gap-1"><Pencil className="w-3 h-3" /> Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="gap-1 text-destructive hover:text-destructive"><Trash2 className="w-3 h-3" /> Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <p className="p-8 text-center text-muted-foreground">No services. Click Add Service.</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="mobile-application" className="bg-secondary/50" /></div>
            <div className="grid gap-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Mobile Application" className="bg-secondary/50" /></div>
            <div className="grid gap-2"><Label>Short description</Label><Input value={form.short_desc} onChange={(e) => setForm((f) => ({ ...f, short_desc: e.target.value }))} className="bg-secondary/50" /></div>
            <div className="grid gap-2"><Label>Long description</Label><Textarea value={form.long_desc} onChange={(e) => setForm((f) => ({ ...f, long_desc: e.target.value }))} rows={3} className="bg-secondary/50 resize-none" /></div>
            <div className="grid gap-2"><Label>Icon name</Label><Input value={form.icon_name} onChange={(e) => setForm((f) => ({ ...f, icon_name: e.target.value }))} placeholder="Smartphone, Globe" className="bg-secondary/50" /></div>
            <div className="grid gap-2"><Label>Features (one per line)</Label><Textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} rows={4} className="bg-secondary/50 resize-none text-xs" /></div>
            <div className="grid gap-2"><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))} className="bg-secondary/50" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
