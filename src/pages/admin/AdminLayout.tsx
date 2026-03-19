import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Mail, FileText, FolderOpen, Wrench, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/contacts", label: "Contact Submissions", icon: Mail },
  { to: "/admin/quotes", label: "Quote Submissions", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/expertise", label: "Expertise", icon: Wrench },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/admin/dashboard" className="font-display font-bold text-lg text-foreground">
            vebx Admin
          </Link>
        </div>
        <nav className="p-2 flex-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
