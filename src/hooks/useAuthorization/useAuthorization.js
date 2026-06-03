import { useAuth } from "@/components/context/AuthContext";

export default function useAuthorization(roles = []) {
  const { user, isAuthenticated, loading } = useAuth();
  const allowed = roles.length === 0 || roles.includes(user?.role);

  return {
    loading,
    isAuthenticated,
    allowed: isAuthenticated && allowed,
  };
}
