// import { createContext, useContext, useState, useEffect } from "react";
// import type { ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import { ROLE_ROUTES, type UserRoleType } from "../constants/AllConstants";

// interface User {
//   id: string;
//   name: string;
//   userType: UserRoleType;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (userData: any) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   // ✅ Load user from localStorage on refresh
//   useEffect(() => {
//     const storedUserType = localStorage.getItem("UserType");
//     const storedName = localStorage.getItem("UserName");
//     const storedId = localStorage.getItem("UserId");

//     if (storedUserType && storedName && storedId) {
//       setUser({
//         id: storedId,
//         name: storedName,
//         userType: Number(storedUserType) as UserRoleType,
//       });
//     }
//   }, []);

//   // ✅ Called from Login page after API success
//   const login = (data: any) => {
//     const newUser = {
//       id: data.Id,
//       name: data.Name,
//       userType: Number(data.UserType) as UserRoleType,
//     };
//     setUser(newUser);

//     // Store in localStorage for persistence
//     localStorage.setItem("UserId", newUser.id);
//     localStorage.setItem("UserName", newUser.name);
//     localStorage.setItem("UserType", String(newUser.userType));

//     const redirectPath = ROLE_ROUTES[newUser.userType] || "/";
//     navigate(redirectPath, { replace: true });
//   };

//   // ✅ Clear state on logout
//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     navigate("/", { replace: true });
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };



// // import { createContext, useContext, useState, useEffect } from "react";
// // import type { ReactNode } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../services/api";
// // import { ROLE_ROUTES, type UserRoleType } from "../constants/AllConstants";

// // interface User {
// //   id: string;
// //   name: string;
// //   userType: UserRoleType;
// // }

// // interface UserPrivileges {
// //   categories: any[];
// //   subcategories: any[];
// //   counters: any[];
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   privileges: UserPrivileges | null;
// //   login: (userData: any) => Promise<void>;
// //   logout: () => void;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [privileges, setPrivileges] = useState<UserPrivileges | null>(null);

// //   const navigate = useNavigate();

// //   // Load user on refresh
// //   useEffect(() => {
// //     const storedUserType = localStorage.getItem("UserType");
// //     const storedName = localStorage.getItem("UserName");
// //     const storedId = localStorage.getItem("UserId");

// //     const storedPrivileges = localStorage.getItem("UserPrivileges");

// //     if (storedUserType && storedName && storedId) {
// //       setUser({
// //         id: storedId,
// //         name: storedName,
// //         userType: Number(storedUserType) as UserRoleType,
// //       });
// //     }

// //     if (storedPrivileges) {
// //       setPrivileges(JSON.parse(storedPrivileges));
// //     }
// //   }, []);

// //   // 🔥 LOGIN FUNCTION (VERY IMPORTANT)
// //   const login = async (data: any) => {
// //     const newUser: User = {
// //       id: data.Id,
// //       name: data.Name,
// //       userType: Number(data.UserType) as UserRoleType,
// //     };

// //     setUser(newUser);

// //     // Store base user info
// //     localStorage.setItem("UserId", newUser.id);
// //     localStorage.setItem("UserName", newUser.name);
// //     localStorage.setItem("UserType", String(newUser.userType));

// //     // --------- FETCH USER PRIVILEGES ----------
// //     try {
// //       const res = await api.get(
// //         `/Account/UserPrevilege/get/${newUser.id}?userId=${newUser.id}`
// //       );

// //       const p = res.data;

// //       // Flatten useful structured data
// //       const extracted = {
// //         categories: p.Categories || [],
// //         subcategories:
// //           p.Categories?.flatMap((c: any) => c.SubCategories) || [],
// //         counters:
// //           p.Categories?.flatMap((c: any) =>
// //             c.SubCategories.flatMap((s: any) => s.Counters)
// //           ) || [],
// //       };

// //       setPrivileges(extracted);
// //       localStorage.setItem("UserPrivileges", JSON.stringify(extracted));
// //     } catch (err) {
// //       console.error("Error fetching user privileges:", err);
// //     }

// //     // Redirect after login
// //     const redirectPath = ROLE_ROUTES[newUser.userType] || "/";
// //     navigate(redirectPath, { replace: true });
// //   };

// //   const logout = () => {
// //     localStorage.clear();
// //     setUser(null);
// //     setPrivileges(null);
// //     navigate("/", { replace: true });
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, privileges, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) throw new Error("useAuth must be used within an AuthProvider");
// //   return context;
// // };

// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import api from "../services/api";
import { ROLE_ROUTES, type UserRoleType } from "../constants/AllConstants";

interface User {
  id: string;
  name: string;
  userType: UserRoleType;
}

interface UserPrevilege {
  categories: any[];
  subcategories: any[];
  counters: any[];
}

interface AuthContextType {
  user: User | null;
  privileges: UserPrevilege | null;
  loading: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [privileges, setPrivileges] = useState<UserPrevilege | null>(null);
  const [loading, setLoading] = useState(true);     // ⬅️ NEW
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem("UserType");
    const storedName = localStorage.getItem("UserName");
    const storedId = localStorage.getItem("UserId");
    const storedPrivileges = localStorage.getItem("UserPrivileges");

    if (storedUserType && storedName && storedId) {
      setUser({
        id: storedId,
        name: storedName,
        userType: Number(storedUserType) as UserRoleType,
      });
    }

    if (storedPrivileges) {
      setPrivileges(JSON.parse(storedPrivileges));
    }

    setLoading(false);   // ✅ Done restoring
  }, []);

  const login = async (data: any) => {
    const newUser: User = {
      id: data.Id,
      name: data.Name,
      userType: Number(data.UserType) as UserRoleType,
    };

    setUser(newUser);

    localStorage.setItem("UserId", newUser.id);
    localStorage.setItem("UserName", newUser.name);
    localStorage.setItem("UserType", String(newUser.userType));

    try {
      const res = await api.get(`/Account/UserPrevilege/get/${newUser.id}`);
      const p = res.data;

      const extracted: UserPrevilege = {
        categories: p.Categories || [],
        subcategories: p.Categories?.flatMap((c: any) => c.SubCategories) || [],
        counters:
          p.Categories?.flatMap((c: any) =>
            c.SubCategories.flatMap((s: any) => s.Counters)
          ) || [],
      };

      setPrivileges(extracted);
      localStorage.setItem("UserPrivileges", JSON.stringify(extracted));
    } catch (err) {
      console.error("Error fetching user privileges:", err);
    }

    const redirectPath = ROLE_ROUTES[newUser.userType] || "/";
    navigate(redirectPath, { replace: true });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPrivileges(null);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, privileges, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

