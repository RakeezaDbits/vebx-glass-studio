import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Item = {
  id: number;
  category: string;
  name: string;
  description: string | null;
  sort_order: number;
};

const emptyForm = { category: "", name: "", description: "", sort_order: 0 };

export default function AdminExpertise() {
  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/expertise")
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

  const openEdit = (row: Item) => {
    setEditingId(row.id);
    setForm({
      category: row.category,
      name: row.name,
      description: row.description || "",
      sort_order: row.sort_order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.category.trim() || !form.name.trim()) {
      toast.error("Category and name required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        category: form.category.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        sort_order: form.sort_order,
      };
      if (editingId) {
        await adminFetch("/api/admin/expertise/" + editingId, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Updated");
      } else {
        await adminFetch("/api/admin/expertise", { method: "POST", body: JSON.stringify(body) });
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
    if (!confirm("Delete this item?")) return;
    try {
      await adminFetch("/api/admin/expertise/" + id, { method: "DELETE" });
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
        <h1 className="font-display text-2xl font-bold">Expertise</h1>
        <Button onClick={openAdd} variant="hero" size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Tech stack and industry expertise shown on the website.</p>
      <div className="liquid-glass rounded-xl border-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-4">{row.category}</td>
                  <td className="p-4">{row.name}</td>
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
        {list.length === 0 && <p className="p-8 text-center text-muted-foreground">No expertise items. Click Add Item.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Expertise" : "Add Expertise"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="frontend, backend, mobile, industry" className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="React, Node.js, etc." className="bg-secondary/50" />
            </div>
            <div className="grid gap-2">
              <Label>Description (optional)</Label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="bg-secondary/50" />
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
