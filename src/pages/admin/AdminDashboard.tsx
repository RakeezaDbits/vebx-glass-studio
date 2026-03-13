import { Link } from "react-router-dom";
import { Mail, FileText, FolderOpen, Wrench, Settings } from "lucide-react";

const cards = [
  { to: "/admin/contacts", label: "Contact Submissions", icon: Mail },
  { to: "/admin/quotes", label: "Quote Submissions", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/expertise", label: "Expertise", icon: Wrench },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
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
  );
}
