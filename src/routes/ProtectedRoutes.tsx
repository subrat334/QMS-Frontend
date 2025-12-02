// ProtectedRoutes.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  allowedRoles: number[];
  element: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Wait for AuthContext to restore user from localStorage
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
