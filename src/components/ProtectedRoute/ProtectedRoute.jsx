import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking permissions..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles.length > 0 && !roles.includes(user?.role?.toLowerCase())) return <Navigate to="/" replace />;

  return children;
}
