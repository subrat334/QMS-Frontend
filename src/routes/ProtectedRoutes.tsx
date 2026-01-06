
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  allowedRoles: number[];
  element: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Wait until auth is restored
  if (loading) {
    return null;
  }

  //  Not logged in → Login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  //  Logged in but NOT allowed → FORCE LOGOUT + Login page
  if (!allowedRoles.includes(user.userType)) {
    localStorage.clear(); // clear user + tokens
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return element;
};

export default ProtectedRoute;
