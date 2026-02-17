import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../globals/useAuthStore";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
