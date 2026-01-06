import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../constants/AllConstants";
import type { JSX } from "react";

const ROLE_ROUTE_MAP: Record<number, string[]> = {
  [USER_ROLES.SUPER_ADMIN]: [
    "/dashboard",
    "/users",
    "/configure-tokens",
    "/manage-tokens",
    "/DateWise",
    "/Catagory",
    "/PatientWise",
  ],
  [USER_ROLES.MIS]: [

    "/DateWise",
    "/Catagory",
    "/PatientWise",
  ],
  [USER_ROLES.COUNTER]: ["/manage-tokens"],
  [USER_ROLES.MONITOR]: ["/monitor"],
  [USER_ROLES.PATIENT_SCREEN]: ["/kiosk"],
};

const RoleGuard = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const allowedRoutes = ROLE_ROUTE_MAP[user.userType] || [];

  //  URL not allowed → LOGIN
  if (!allowedRoutes.includes(location.pathname)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
