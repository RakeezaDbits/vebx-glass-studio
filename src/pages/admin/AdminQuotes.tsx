import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

interface Row {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service_slug: string;
  sub_type_id: string | null;
  tech_ids: string | null;
  tier_id: string | null;
  reference_link: string | null;
  reference_file_name: string | null;
  created_at: string;
}

export default function AdminQuotes() {
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/quotes")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Quote Submissions</h1>
      <div className="liquid-glass rounded-xl border-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Phone</th>
                <th className="text-left p-4 font-medium">Service</th>
                <th className="text-left p-4 font-medium">Tier</th>
                <th className="text-left p-4 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="p-4 text-muted-foreground">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">
                    <a href={`mailto:${row.email}`} className="text-primary hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="p-4">{row.phone || "—"}</td>
                  <td className="p-4">{row.service_slug}</td>
                  <td className="p-4">{row.tier_id || "—"}</td>
                  <td className="p-4">
                    {row.reference_link ? (
                      <a href={row.reference_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[120px] block">
                        {row.reference_link}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
