import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type Row = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default function AdminContacts() {
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/contacts")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Contact Submissions</h1>
      <div className="liquid-glass rounded-xl border-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Subject</th>
                <th className="text-left p-4 font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-4 text-muted-foreground">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">
                    <a href={"mailto:" + row.email} className="text-primary hover:underline">{row.email}</a>
                  </td>
                  <td className="p-4">{row.subject || "\u2014"}</td>
                  <td className="p-4 max-w-xs truncate">{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <p className="p-8 text-center text-muted-foreground">No submissions yet.</p>}
      </div>
    </div>
  );
}
