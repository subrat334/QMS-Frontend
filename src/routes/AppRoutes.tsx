// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "../context/AuthContext";
// import Login from "../pages/Auth/Login";
// import ProtectedRoute from "./ProtectedRoute";

// // Pages
// import CreateUser from "../pages/SuperAdmin/CreateUser";
// import MISReport from "../pages/MIS/MISReport";
// import MonitorControl from "../pages/Monitor/MonitorControl";
// import UserPage from "../pages/Counter/UserPage";
// import Display from "../pages/PatientScreen/Display";
// import { ROLE_ROUTES, USER_ROLES } from "../constants/AllConstants";

// const AppRoutes = () => (
//   <BrowserRouter>
//     <AuthProvider>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Login />} />

//         {/* SuperAdmin (UserType 1) */}
//         <Route
//           path={ROLE_ROUTES[USER_ROLES.SUPER_ADMIN]}
//           element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]} element={<CreateUser />} />}
//         />

//         {/* MIS (UserType 2) */}
//         <Route
//           path={ROLE_ROUTES[USER_ROLES.MIS]}
//           element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN,USER_ROLES.MIS]} element={<MISReport />} />}
//         />

//         {/* Monitor (UserType 3) */}
//         <Route
//           path={ROLE_ROUTES[USER_ROLES.MONITOR]}
//           element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.MONITOR]} element={<MonitorControl />} />}
//         />

//         {/* Counter (UserType 4) */}
//         <Route
//           path={ROLE_ROUTES[USER_ROLES.COUNTER]}
//           element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.COUNTER]} element={<UserPage />} />}
//         />

    
//         <Route
//           path={ROLE_ROUTES[USER_ROLES.PATIENT_SCREEN]}
//           element={<ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PATIENT_SCREEN]} element={<Display />} />}
//         />
//       </Routes>
//     </AuthProvider>
//   </BrowserRouter>
// );

// export default AppRoutes;

// AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// Auth Pages
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/register";

// Layout
import MainLayout from "../Components/Layout/MainLayout";

// Pages
import Dashboard from "../Components/Dashboard/Dashboard";
import Kiosk from "../Components/Products/Kiosk";
import Users from "../Components/Users/users";
import ConfigureTokens from "../Components/ConfigureTokens/ConfigureTokens";
import ManageToken from "../Components/ManageToken/ManageToken";
import MonitorWithLayout from "../Components/Monitor/MonitorWithLayout";
// import TokenPage from "../Components/TokenPage/TokenPage";

import Datewise from "../Components/Reports/DateWise";
import Catagory from "../Components/Reports/Catagory";
import PatientWise from "../Components/Reports/UserWise";

import TopBar from "../Components/TopBar/TopBar";
import UpdatePassword from "../Password/update-password";

import ProtectedRoute from "./ProtectedRoutes";
import { USER_ROLES } from "../constants/AllConstants";

const AppRoutes = () => (
  <Router>
    <AuthProvider>
      <Routes>

        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- SUPER ADMIN ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN]}
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN]}
              element={
                <MainLayout>
                  <Users />
                </MainLayout>
              }
            />
          }
        />

        <Route
          path="/configure-tokens"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN]}
              element={
                <MainLayout>
                  <ConfigureTokens />
                </MainLayout>
              }
            />
          }
        />

        {/* ---------- COUNTER ---------- */}
        <Route
          path="/manage-tokens"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.COUNTER]}
              element={
                <MainLayout>
                  <ManageToken />
                </MainLayout>
              }
            />
          }
        />

        {/* ---------- MONITOR ---------- */}
        <Route
          path="/monitor"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.MONITOR]}
              element={<MonitorWithLayout />}
            />
          }
        />

        {/* ---------- PATIENT SCREEN ---------- */}
        <Route
          path="/kiosk"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PATIENT_SCREEN]}
              element={
                <MainLayout>
                  <Kiosk />
                </MainLayout>
              }
            />
          }
        />

        {/* ---------- REPORTS (MIS) ---------- */}
        <Route
          path="/DateWise"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.MIS]}
              element={
                <MainLayout>
                  <Datewise />
                </MainLayout>
              }
            />
          }
        />

        <Route
          path="/Catagory"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.MIS]}
              element={
                <MainLayout>
                  <Catagory />
                </MainLayout>
              }
            />
          }
        />

        <Route
          path="/PatientWise"
          element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.MIS]}
              element={
                <MainLayout>
                  <PatientWise />
                </MainLayout>
              }
            />
          }
        />

        {/* ---------- COMMON ---------- */}
        <Route
          path="/update-password"
          element={
            <ProtectedRoute
              allowedRoles={[
                USER_ROLES.MIS,
                USER_ROLES.MONITOR,
                USER_ROLES.COUNTER,
                USER_ROLES.PATIENT_SCREEN,
              ]}
              element={
                <MainLayout>
                  <UpdatePassword />
                </MainLayout>
              }
            />
          }
        />

        {/* Optional */}
        <Route path="/topbar" element={<TopBar onLogout={() => {}} />} />

      </Routes>
    </AuthProvider>
  </Router>
);

export default AppRoutes;
