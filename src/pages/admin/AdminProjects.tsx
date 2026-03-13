import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminFetch } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Project = {
  id: number;
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

const emptyForm = {
  slug: "",
  title: "",
  category: "",
  description: "",
  image_url: "",
  sort_order: 0,
};

export default function AdminProjects() {
  const [list, setList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/projects")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: Project) => {
    setEditingId(row.id);
    setForm({
      slug: row.slug,
      title: row.title,
      category: row.category || "",
      description: row.description || "",
      image_url: row.image_url || "",
      sort_order: row.sort_order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim()) {
      toast.error("Slug and title required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await adminFetch("/api/admin/projects/" + editingId, {
          method: "PUT",
          body: JSON.stringify({
            slug: form.slug.trim(),
            title: form.title.trim(),
            category: form.category.trim() || null,
            description: form.description.trim() || null,
            image_url: form.image_url.trim() || null,
            sort_order: form.sort_order,
          }),
        });
        toast.success("Updated");
      } else {
        await adminFetch("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify({
            slug: form.slug.trim(),
            title: form.title.trim(),
            category: form.category.trim() || null,
            description: form.description.trim() || null,
            image_url: form.image_url.trim() || null,
            sort_order: form.sort_order,
          }),
        });
        toast.success("Added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await adminFetch("/api/admin/projects/" + id, { method: "DELETE" });
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Projects</h1>
        <Button onClick={openAdd} variant="hero" size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Portfolio projects shown on Our Work page.</p>
      <div className="liquid-glass rounded-xl border-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-4">{row.title}</td>
                  <td className="p-4 text-muted-foreground">{row.slug}</td>
                  <td className="p-4">{row.category || "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)} className="gap-1">
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="gap-1 text-destructive hover:text-destructive">
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <p className="p-8 text-center text-muted-foreground">No projects. Click Add Project.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="my-project" className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="My Project" className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Web Application" className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="bg-secondary/50 resize-none" />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="/our-work/example.png" className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))} className="bg-secondary/50" />
            </div>
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
