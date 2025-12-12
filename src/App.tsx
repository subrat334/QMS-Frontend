
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Login from "./Components/Auth/Login";
// import Register from "./Components/Auth/register";

// import Dashboard from "./Components/Dashboard/Dashboard";
// import Kiosk from "./Components/Products/Kiosk";

// import Users from "./Components/Users/users";

// import ConfigureTokens from "./Components/ConfigureTokens/ConfigureTokens";
// import ManageToken from "./Components/ManageToken/ManageToken";
// // import Monitor from "./Components/Monitor/Monitor";
// import MonitorWithLayout from "./Components/Monitor/MonitorWithLayout";


// import TokenPage from "./Components/TokenPage/TokenPage";

// import Datewise from "./Components/Reports/DateWise";
// import Catagory from "./Components/Reports/Catagory";
// import PatientWise from "./Components/Reports/UserWise";

// import TopBar from "./Components/TopBar/TopBar";
// import MainLayout from "./Components/Layout/MainLayout";

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* ----------- NO SIDEBAR / TOPBAR ----------- */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* ----------- PAGES WITH SIDEBAR & TOPBAR ----------- */}

//         <Route
//           path="/dashboard"
//           element={
//             <MainLayout>
//               <Dashboard />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/Kiosk"
//           element={
//             <MainLayout>
//               <Kiosk />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/users"
//           element={
//             <MainLayout>
//               <Users />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/configure-tokens"
//           element={
//             <MainLayout>
//               <ConfigureTokens />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/manage-tokens"
//           element={
//             <MainLayout>
//               <ManageToken />
//             </MainLayout>
//           }
//         />

//         {/* <Route
//           path="/monitor"
//           element={
//             <MainLayout>
//               <Monitor />
//             </MainLayout>
//           }
//         /> */}

// <Route path="/monitor" element={<MonitorWithLayout />} />


//         <Route
//           path="/TokenPage/:subcategoryId"
//           element={
//             <MainLayout>
//               <TokenPage />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/DateWise"
//           element={
//             <MainLayout>
//               <Datewise />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/Catagory"
//           element={
//             <MainLayout>
//               <Catagory />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/PatientWise"
//           element={
//             <MainLayout>
//               <PatientWise />
//             </MainLayout>
//           }
//         />

//         {/* Optional TopBar preview route */}
//         <Route path="/topbar" element={<TopBar onLogout={() => {}} />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;


import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
 
const App = () => {
  return (
    <>
      <AppRoutes />
      {/* REQUIRED for toast messages to appear */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};
 
export default App;
