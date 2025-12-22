// // Sidebar.tsx
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   PlusSquare,
//   ClipboardList,
//   Monitor,
//   BarChart2,
//   Users,
//   ChevronDown,
//   ChevronUp,
//   LogOut,
//   Menu,
// } from "lucide-react";
// import logo from "../../assets/utkal.png";

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
//   const location = useLocation();
//   const [showReports, setShowReports] = useState(false);

//   const isActive = (path: string) =>
//     location.pathname === path ? "bg-green-500 text-white" : "";

//   return (
//     <aside
//       className={`sidebar fixed top-0 left-0 z-40 h-screen bg-green-700 shadow-lg transition-all duration-300 ${
//         collapsed ? "w-16" : "w-50"
//       }`}
//     >
//       <div className="h-full px-3 py-4 text-gray-100 flex flex-col">

//         {/* COLLAPSE / EXPAND BUTTON */}
//         {/* <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="mb-4 p-2 bg-green-600 rounded-lg hover:bg-green-500 transition self-end"
//         >
//           <Menu size={20} />
//         </button> */}
//         <button
//   onClick={() => setCollapsed(!collapsed)}
//   className="mb-4 p-2 bg-green-600 rounded-lg hover:bg-green-500 transition self-end flex items-center justify-center"
// >
//   {collapsed ? (
//     <span className="text-white text-xl">{">"}</span>
//   ) : (
//     <span className="text-white text-xl">{"<"}</span>
//   )}
// </button>


//         {/* LOGO */}
//        {!collapsed && (
//   <div className="flex flex-col items-start mb-6 px-2">
//     <img
//       src={logo}
//       alt="Logo"
//       className="h-10 w-auto rounded-md bg-white p-1 mb-2"
//     />

//     <h1 className="text-lg font-semibold text-white leading-tight">
//       Utkal Hospital
//     </h1>
//   </div>
// )}


//         <ul className="space-y-2 font-medium flex-1">

//           {/* Dashboard */}
//           <li>
//             <Link
//               to="/dashboard"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/dashboard"
//               )}`}
//             >
//               <LayoutDashboard size={20} />
//               {!collapsed && <span>+ Add New</span>}
//             </Link>
//           </li>

//           {/* Configure Tokens */}
//           <li>
//             <Link
//               to="/configure-tokens"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/configure-tokens"
//               )}`}
//             >
//               <PlusSquare size={20} />
//               {!collapsed && <span>Configure Tokens</span>}
//             </Link>
//           </li>

//           {/* Manage Tokens */}
//           <li>
//             <Link
//               to="/manage-tokens"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/manage-tokens"
//               )}`}
//             >
//               <ClipboardList size={20} />
//               {!collapsed && <span>Manage Tokens</span>}
//             </Link>
//           </li>

//           {/* Monitor */}
//           <li>
//             <Link
//               to="/monitor"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/monitor"
//               )}`}
//             >
//               <Monitor size={20} />
//               {!collapsed && <span>Monitor</span>}
//             </Link>
//           </li>

//           {/* Token Request */}
//           <li>
//             <Link
//               to="/Kiosk"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/Kiosk"
//               )}`}
//             >
//               <ClipboardList size={20} />
//               {!collapsed && <span>Token Request</span>}
//             </Link>
//           </li>

//           {/* MIS REPORTS */}
//           <li>
//             <button
//               onClick={() => setShowReports(!showReports)}
//               className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-green-600 transition"
//             >
//               <div className="flex items-center gap-3">
//                 <BarChart2 size={20} />
//                 {!collapsed && <span>MIS Reports</span>}
//               </div>

//               {!collapsed &&
//                 (showReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//             </button>

//             {!collapsed && showReports && (
//               <ul className="ml-6 mt-2 space-y-1">
//                 <li>
//                   <Link
//                     to="/DateWise"
//                     className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
//                       "/DateWise"
//                     )}`}
//                   >
//                     Date Wise Report
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/Catagory"
//                     className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
//                       "/Catagory"
//                     )}`}
//                   >
//                     Category Wise Report
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/PatientWise"
//                     className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
//                       "/PatientWise"
//                     )}`}
//                   >
//                     User Wise Report
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Users */}
//           <li>
//             <Link
//               to="/users"
//               className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
//                 "/users"
//               )}`}
//             >
//               <Users size={20} />
//               {!collapsed && <span>Users</span>}
//             </Link>
//           </li>

//           {/* Logout */}
//           <li>
//             <a
//               href="/"
//               className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition text-red-200"
//             >
//               <LogOut size={20} />
//               {!collapsed && <span>Logout</span>}
//             </a>
//           </li>
//         </ul>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


// // import { useState } from "react";
// // import { Link } from "react-router-dom";

// // interface SidebarProps {
// //   collapsed: boolean;
// //   setCollapsed: (val: boolean) => void;
// // }

// // const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
// //   return (
// //     <div
// //       className={`bg-gray-900 text-white h-screen p-4 flex flex-col transition-all duration-300 
// //       ${collapsed ? "w-16" : "w-64"}`}
// //     >
// //       {/* COLLAPSE / EXPAND BUTTON */}
// //       <button
// //         onClick={() => setCollapsed(!collapsed)}
// //         className="mb-4 p-2 bg-green-600 rounded-lg hover:bg-green-500 transition self-end"
// //       >
// //         {collapsed ? (
// //           <span className="text-white text-xl">{">"}</span>
// //         ) : (
// //           <span className="text-white text-xl">{"<"}</span>
// //         )}
// //       </button>

// //       {/* SIDEBAR MENU ITEMS */}
// //       <nav className="flex flex-col gap-3">
// //         <Link
// //           to="/dashboard"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Dashboard" : "D"}
// //         </Link>

// //         <Link
// //           to="/Kiosk"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Kiosk" : "K"}
// //         </Link>

// //         <Link
// //           to="/users"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Users" : "U"}
// //         </Link>

// //         <Link
// //           to="/configure-tokens"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Configure Tokens" : "C"}
// //         </Link>

// //         <Link
// //           to="/manage-tokens"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Manage Tokens" : "M"}
// //         </Link>

// //         <Link
// //           to="/monitor"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Monitor" : "Mo"}
// //         </Link>

// //         <Link
// //           to="/DateWise"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Datewise Report" : "DR"}
// //         </Link>

// //         <Link
// //           to="/Catagory"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Category Report" : "CR"}
// //         </Link>

// //         <Link
// //           to="/PatientWise"
// //           className="p-2 hover:bg-gray-700 rounded-lg transition"
// //         >
// //           {!collapsed ? "Patient Report" : "PR"}
// //         </Link>
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  ClipboardList,
  Monitor,
  BarChart2,
  Users,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../constants/AllConstants";
import logo from "../../assets/utkal.png";
import { logoutUser } from "../../services/api"; 

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const [showReports, setShowReports] = useState(false);
  const { user } = useAuth();

  const role = user?.userType;

  const isActive = (path: string) =>
    location.pathname === path ? "bg-green-500 text-white" : "";

  // Helper for showing items only if allowed
  const showFor = (...roles: number[]) => roles.includes(role!);

  return (
    <aside
      className={`sidebar fixed top-0 left-0 z-40 h-screen bg-green-700 shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-50"
      }`}
    >
      <div className="h-full px-3 py-4 text-gray-100 flex flex-col">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 p-2 bg-green-600 rounded-lg hover:bg-green-500 transition self-end flex items-center justify-center"
        >
          {collapsed ? (
            <span className="text-white text-xl">{">"}</span>
          ) : (
            <span className="text-white text-xl">{"<"}</span>
          )}
        </button>

        {!collapsed && (
          <div className="flex flex-col items-start mb-6 px-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto rounded-md bg-white p-1 mb-2"
            />
            <h1 className="text-lg font-semibold text-white leading-tight">
              Utkal Hospital
            </h1>
          </div>
        )}

        <ul className="space-y-2 font-medium flex-1">

          {/* SUPER ADMIN ONLY */}
          {showFor(USER_ROLES.SUPER_ADMIN) && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                    "/dashboard"
                  )}`}
                >
                  <LayoutDashboard size={20} />
                  {!collapsed && <span>+ Add New</span>}
                </Link>
              </li>

              <li>
                <Link
                  to="/configure-tokens"
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                    "/configure-tokens"
                  )}`}
                >
                  <PlusSquare size={20} />
                  {!collapsed && <span>Configure Tokens</span>}
                </Link>
              </li>
            </>
          )}

          {/* MANAGE TOKENS → COUNTER + SUPER_ADMIN */}
          {showFor(USER_ROLES.SUPER_ADMIN, USER_ROLES.COUNTER) && (
            <li>
              <Link
                to="/manage-tokens"
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                  "/manage-tokens"
                )}`}
              >
                <ClipboardList size={20} />
                {!collapsed && <span>Manage Tokens</span>}
              </Link>
            </li>
          )}

          {/* MONITOR → MONITOR + SUPER_ADMIN */}
          {showFor(USER_ROLES.SUPER_ADMIN, USER_ROLES.MONITOR) && (
            <li>
              <Link
                to="/monitor"
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                  "/monitor"
                )}`}
              >
                <Monitor size={20} />
                {!collapsed && <span> Q-Monitor</span>}
              </Link>
            </li>
          )}

          {/* TOKEN REQUEST → PATIENT_SCREEN + SUPER_ADMIN */}
          {showFor(USER_ROLES.SUPER_ADMIN, USER_ROLES.PATIENT_SCREEN) && (
            <li>
              <Link
                to="/Kiosk"
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                  "/Kiosk"
                )}`}
              >
                <ClipboardList size={20} />
                {!collapsed && <span>Token Request</span>}
              </Link>
            </li>
          )}

          {/* MIS REPORTS → MIS + SUPER_ADMIN */}
          {showFor(USER_ROLES.SUPER_ADMIN, USER_ROLES.MIS) && (
            <li>
              <button
                onClick={() => setShowReports(!showReports)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-green-600 transition"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 size={20} />
                  {!collapsed && <span>MIS Reports</span>}
                </div>

                {!collapsed &&
                  (showReports ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </button>

              {!collapsed && showReports && (
                <ul className="ml-6 mt-2 space-y-1">
                  <li>
                    <Link
                      to="/DateWise"
                      className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
                        "/DateWise"
                      )}`}
                    >
                      Date Wise Report
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/Catagory"
                      className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
                        "/Catagory"
                      )}`}
                    >
                      Category Wise Report
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/PatientWise"
                      className={`block p-2 rounded-md hover:bg-green-600 transition ${isActive(
                        "/PatientWise"
                      )}`}
                    >
                      User Wise Report
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* USERS → SUPER_ADMIN ONLY */}
          {showFor(USER_ROLES.SUPER_ADMIN) && (
            <li>
              <Link
                to="/users"
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-green-600 transition ${isActive(
                  "/users"
                )}`}
              >
                <Users size={20} />
                {!collapsed && <span>Users</span>}
              </Link>
            </li>
          )}

          {/* LOGOUT */}
       <li>
  <button
    onClick={logoutUser}
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition text-red-200 w-full text-left"
  >
    <LogOut size={20} />
    {!collapsed && <span>Logout</span>}
  </button>
</li>

        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

