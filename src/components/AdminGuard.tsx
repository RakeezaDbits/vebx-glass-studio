import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken } from "@/lib/api";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = getAdminToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
