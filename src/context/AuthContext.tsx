import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { API } from "../services/AllApiServices";
import { ROLE_ROUTES, type UserRoleType } from "../constants/AllConstants";
 
type RawCategory = {
  Id?: number;
  CategoryId: string;
  CategoryName: string;
  SubCategories?: RawSubCategory[];
};
 
type RawSubCategory = {
  Id?: number;
  SubCategoryId: string;
  SubCategoryName: string;
  Counters?: RawCounter[];
};
 
type RawCounter = {
  Id?: number;
  CounterId: string;
  CounterName: string;
};
 
interface User {
  id: string;
  name: string;
  userType: UserRoleType;
  raw?: any;
}
 
interface UserPrivilege {
  categories: RawCategory[]; // Full structure as returned by backend
  subcategories: RawSubCategory[]; // Flattened array for convenience
  counters: RawCounter[]; // Flattened array
}
 
interface AuthContextType {
  user: User | null;
  privileges: UserPrivilege | null;
  loading: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => void;
  ensurePrivilegesForUser: (userId?: string) => Promise<void>;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [privileges, setPrivileges] = useState<UserPrivilege | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  // Restore from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("AppUser");
    const storedPrivileges = localStorage.getItem("UserPrivileges");
 
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.warn("Failed parsing stored user", e);
      }
    }
 
    if (storedPrivileges) {
      try {
        setPrivileges(JSON.parse(storedPrivileges));
      } catch (e) {
        console.warn("Failed parsing stored privileges", e);
      }
    }
 
    setLoading(false);
  }, []);
 
  // Login: receives the raw login response from /Account/ValidateLogin
  const login = async (data: any) => {
    // Store basic user model
    const newUser: User = {
      id: data.Id,
      name: data.Name,
      userType: Number(data.UserType) as UserRoleType,
      raw: data,
    };
 
    setUser(newUser);
    localStorage.setItem("AppUser", JSON.stringify(newUser));
 
    // Fetch privileges for this user (server has the canonical privileges)
    await ensurePrivilegesForUser(String(newUser.id));
 
    const redirectPath = ROLE_ROUTES[newUser.userType] || "/";
    navigate(redirectPath, { replace: true });
  };
 
  // Fetch user privileges from API and set in state + localStorage
  const ensurePrivilegesForUser = async (userId?: string) => {
    if (!userId && !user) return;
   
    const uid = userId || user!.id;
 
    try {
      const res = await API.getUserPrivilegesById(uid);
      const p = res.data;
 
      // p.Categories is expected to be array with structure similar to your sample
      const categories: RawCategory[] = p.Categories || [];
 
      // Flattened arrays for convenience
      const subcategories: RawSubCategory[] =
        categories.flatMap((c) => c.SubCategories || []) || [];
     
      const counters: RawCounter[] =
        subcategories.flatMap((s) => s.Counters || []) || [];
 
      const extracted: UserPrivilege = {
        categories,
        subcategories,
        counters,
      };
 
      setPrivileges(extracted);
      localStorage.setItem("UserPrivileges", JSON.stringify(extracted));
    } catch (err) {
      console.error("Error fetching user privileges:", err);
      // Keep privileges as null; pages should handle missing privileges gracefully
    }
  };
 
  const logout = () => {
    localStorage.removeItem("AppUser");
    localStorage.removeItem("UserPrivileges");
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    // Optionally preserve other localStorage keys if needed
 
    setUser(null);
    setPrivileges(null);
    navigate("/", { replace: true });
  };
 
  return (
    <AuthContext.Provider
      value={{
        user,
        privileges,
        loading,
        login,
        logout,
        ensurePrivilegesForUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => {
  const ctx = useContext(AuthContext);
 
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
 
  return ctx;
};