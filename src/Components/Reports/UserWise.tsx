
// // import React, { useState } from "react";
// // import * as XLSX from "xlsx";

// // interface Detail {
// //   date: string;
// //   service: string;
// // }

// // interface PatientRow {
// //   id: number;
// //   userName: string;
// //   userId: string;
// //   category: string;
// //   subcategory: string;
// //   numbers: number;
// //   details?: Detail[];
// // }

// // const UserwiseReport = () => {
// //   const [data] = useState<PatientRow[]>([
// //     {
// //       id: 1,
// //       userName: "Amit Sharma",
// //       userId: "U001",
// //       category: "OPD",
// //       subcategory: "General",
// //       numbers: 5,
// //       details: [
// //         { date: "2025-11-01", service: "Consultation" },
// //         { date: "2025-11-03", service: "Follow-up" },
// //         { date: "2025-11-05", service: "Blood Test" },
// //         { date: "2025-11-07", service: "Consultation" },
// //         { date: "2025-11-10", service: "Prescription Review" },
// //       ],
// //     },
// //     {
// //       id: 2,
// //       userName: "Priya Verma",
// //       userId: "U002",
// //       category: "Diagnostics",
// //       subcategory: "Radiology",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-02", service: "X-Ray" },
// //         { date: "2025-11-04", service: "MRI" },
// //         { date: "2025-11-08", service: "CT Scan" },
// //       ],
// //     },
// //     {
// //       id: 3,
// //       userName: "Ravi Patel",
// //       userId: "U003",
// //       category: "Emergency",
// //       subcategory: "Trauma",
// //       numbers: 2,
// //       details: [
// //         { date: "2025-11-06", service: "Emergency Consultation" },
// //         { date: "2025-11-09", service: "Trauma Treatment" },
// //       ],
// //     },
// //     {
// //       id: 4,
// //       userName: "Neha Gupta",
// //       userId: "U004",
// //       category: "OPD",
// //       subcategory: "Cardiology",
// //       numbers: 4,
// //       details: [
// //         { date: "2025-11-01", service: "ECG" },
// //         { date: "2025-11-05", service: "Echo Cardiogram" },
// //         { date: "2025-11-08", service: "Consultation" },
// //         { date: "2025-11-12", service: "Stress Test" },
// //       ],
// //     },
// //     {
// //       id: 5,
// //       userName: "Manoj Singh",
// //       userId: "U005",
// //       category: "Diagnostics",
// //       subcategory: "Lab Test",
// //       numbers: 6,
// //       details: [
// //         { date: "2025-11-01", service: "Blood Test" },
// //         { date: "2025-11-02", service: "Urine Test" },
// //         { date: "2025-11-03", service: "Liver Function" },
// //         { date: "2025-11-04", service: "Kidney Function" },
// //         { date: "2025-11-05", service: "Thyroid Test" },
// //         { date: "2025-11-06", service: "Diabetes Panel" },
// //       ],
// //     },
// //     {
// //       id: 6,
// //       userName: "Sunita Das",
// //       userId: "U006",
// //       category: "OPD",
// //       subcategory: "Dermatology",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-03", service: "Skin Consultation" },
// //         { date: "2025-11-07", service: "Allergy Test" },
// //         { date: "2025-11-14", service: "Follow-up" },
// //       ],
// //     },
// //     {
// //       id: 7,
// //       userName: "Arjun Reddy",
// //       userId: "U007",
// //       category: "Emergency",
// //       subcategory: "Cardiac",
// //       numbers: 4,
// //       details: [
// //         { date: "2025-11-02", service: "Emergency ECG" },
// //         { date: "2025-11-02", service: "Cardiac Monitoring" },
// //         { date: "2025-11-03", service: "Consultation" },
// //         { date: "2025-11-05", service: "Discharge Review" },
// //       ],
// //     },
// //     {
// //       id: 8,
// //       userName: "Kiran Kumar",
// //       userId: "U008",
// //       category: "Diagnostics",
// //       subcategory: "MRI",
// //       numbers: 5,
// //       details: [
// //         { date: "2025-11-01", service: "Brain MRI" },
// //         { date: "2025-11-03", service: "Spine MRI" },
// //         { date: "2025-11-05", service: "Knee MRI" },
// //         { date: "2025-11-08", service: "Abdominal MRI" },
// //         { date: "2025-11-10", service: "Cardiac MRI" },
// //       ],
// //     },
// //     {
// //       id: 9,
// //       userName: "Rahul Mehta",
// //       userId: "U009",
// //       category: "OPD",
// //       subcategory: "Neurology",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-04", service: "Neurology Consultation" },
// //         { date: "2025-11-06", service: "EEG" },
// //         { date: "2025-11-11", service: "Follow-up" },
// //       ],
// //     },
// //     {
// //       id: 10,
// //       userName: "Deepa Rao",
// //       userId: "U010",
// //       category: "Diagnostics",
// //       subcategory: "X-Ray",
// //       numbers: 2,
// //       details: [
// //         { date: "2025-11-05", service: "Chest X-Ray" },
// //         { date: "2025-11-07", service: "Hand X-Ray" },
// //       ],
// //     },
// //     {
// //       id: 11,
// //       userName: "Vikram Joshi",
// //       userId: "U011",
// //       category: "OPD",
// //       subcategory: "Pediatrics",
// //       numbers: 7,
// //       details: [
// //         { date: "2025-11-01", service: "Vaccination" },
// //         { date: "2025-11-02", service: "Growth Check" },
// //         { date: "2025-11-03", service: "Consultation" },
// //         { date: "2025-11-05", service: "Follow-up" },
// //         { date: "2025-11-08", service: "Vaccination" },
// //         { date: "2025-11-10", service: "Development Assessment" },
// //         { date: "2025-11-12", service: "Nutrition Counseling" },
// //       ],
// //     },
// //     {
// //       id: 12,
// //       userName: "Anjali Desai",
// //       userId: "U012",
// //       category: "Emergency",
// //       subcategory: "Orthopedic",
// //       numbers: 4,
// //       details: [
// //         { date: "2025-11-03", service: "Fracture Treatment" },
// //         { date: "2025-11-04", service: "X-Ray" },
// //         { date: "2025-11-05", service: "Consultation" },
// //         { date: "2025-11-07", service: "Cast Application" },
// //       ],
// //     },
// //     {
// //       id: 13,
// //       userName: "Sanjay Malhotra",
// //       userId: "U013",
// //       category: "Diagnostics",
// //       subcategory: "Ultrasound",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-02", service: "Abdominal Ultrasound" },
// //         { date: "2025-11-04", service: "Pelvic Ultrasound" },
// //         { date: "2025-11-06", service: "Thyroid Ultrasound" },
// //       ],
// //     },
// //     {
// //       id: 14,
// //       userName: "Pooja Iyer",
// //       userId: "U014",
// //       category: "OPD",
// //       subcategory: "ENT",
// //       numbers: 6,
// //       details: [
// //         { date: "2025-11-01", service: "Ear Check" },
// //         { date: "2025-11-02", service: "Audiometry" },
// //         { date: "2025-11-03", service: "Throat Examination" },
// //         { date: "2025-11-05", service: "Nasal Endoscopy" },
// //         { date: "2025-11-08", service: "Follow-up" },
// //         { date: "2025-11-10", service: "Hearing Test" },
// //       ],
// //     },
// //     {
// //       id: 15,
// //       userName: "Rajeev Bansal",
// //       userId: "U015",
// //       category: "Emergency",
// //       subcategory: "Respiratory",
// //       numbers: 2,
// //       details: [
// //         { date: "2025-11-04", service: "Asthma Treatment" },
// //         { date: "2025-11-05", service: "Nebulization" },
// //       ],
// //     },
// //     {
// //       id: 16,
// //       userName: "Sneha Choudhary",
// //       userId: "U016",
// //       category: "Diagnostics",
// //       subcategory: "CT Scan",
// //       numbers: 5,
// //       details: [
// //         { date: "2025-11-01", service: "Head CT" },
// //         { date: "2025-11-02", service: "Chest CT" },
// //         { date: "2025-11-03", service: "Abdominal CT" },
// //         { date: "2025-11-04", service: "Pelvic CT" },
// //         { date: "2025-11-05", service: "Spine CT" },
// //       ],
// //     },
// //     {
// //       id: 17,
// //       userName: "Alok Tiwari",
// //       userId: "U017",
// //       category: "OPD",
// //       subcategory: "Ophthalmology",
// //       numbers: 4,
// //       details: [
// //         { date: "2025-11-02", service: "Eye Checkup" },
// //         { date: "2025-11-03", service: "Retina Scan" },
// //         { date: "2025-11-05", service: "Glaucoma Test" },
// //         { date: "2025-11-08", service: "Prescription Glasses" },
// //       ],
// //     },
// //     {
// //       id: 18,
// //       userName: "Meera Nair",
// //       userId: "U018",
// //       category: "Emergency",
// //       subcategory: "Pediatric",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-03", service: "Fever Treatment" },
// //         { date: "2025-11-04", service: "Consultation" },
// //         { date: "2025-11-05", service: "Follow-up" },
// //       ],
// //     },
// //     {
// //       id: 19,
// //       userName: "Gaurav Saxena",
// //       userId: "U019",
// //       category: "Diagnostics",
// //       subcategory: "Blood Test",
// //       numbers: 8,
// //       details: [
// //         { date: "2025-11-01", service: "CBC" },
// //         { date: "2025-11-02", service: "Blood Sugar" },
// //         { date: "2025-11-03", service: "Cholesterol" },
// //         { date: "2025-11-04", service: "Liver Function" },
// //         { date: "2025-11-05", service: "Kidney Function" },
// //         { date: "2025-11-06", service: "Thyroid Panel" },
// //         { date: "2025-11-07", service: "Vitamin D" },
// //         { date: "2025-11-08", service: "Iron Studies" },
// //       ],
// //     },
// //     {
// //       id: 20,
// //       userName: "Lata Menon",
// //       userId: "U020",
// //       category: "OPD",
// //       subcategory: "Gastroenterology",
// //       numbers: 5,
// //       details: [
// //         { date: "2025-11-01", service: "Consultation" },
// //         { date: "2025-11-02", service: "Endoscopy" },
// //         { date: "2025-11-03", service: "Colonoscopy" },
// //         { date: "2025-11-05", service: "Follow-up" },
// //         { date: "2025-11-08", service: "Diet Counseling" },
// //       ],
// //     },
// //     {
// //       id: 21,
// //       userName: "Dinesh Prabhu",
// //       userId: "U021",
// //       category: "Emergency",
// //       subcategory: "General",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-04", service: "Fever Treatment" },
// //         { date: "2025-11-05", service: "Consultation" },
// //         { date: "2025-11-06", service: "Discharge" },
// //       ],
// //     },
// //     {
// //       id: 22,
// //       userName: "Shweta Agarwal",
// //       userId: "U022",
// //       category: "Diagnostics",
// //       subcategory: "ECG",
// //       numbers: 4,
// //       details: [
// //         { date: "2025-11-01", service: "Resting ECG" },
// //         { date: "2025-11-02", service: "Stress ECG" },
// //         { date: "2025-11-03", service: "Holter Monitoring" },
// //         { date: "2025-11-04", service: "Follow-up ECG" },
// //       ],
// //     },
// //     {
// //       id: 23,
// //       userName: "Nitin Chopra",
// //       userId: "U023",
// //       category: "OPD",
// //       subcategory: "Psychiatry",
// //       numbers: 2,
// //       details: [
// //         { date: "2025-11-05", service: "Therapy Session" },
// //         { date: "2025-11-12", service: "Follow-up" },
// //       ],
// //     },
// //     {
// //       id: 24,
// //       userName: "Anita Reddy",
// //       userId: "U024",
// //       category: "Emergency",
// //       subcategory: "Neurological",
// //       numbers: 6,
// //       details: [
// //         { date: "2025-11-01", service: "Emergency Consultation" },
// //         { date: "2025-11-02", service: "CT Scan" },
// //         { date: "2025-11-03", service: "Neurology Review" },
// //         { date: "2025-11-04", service: "Treatment" },
// //         { date: "2025-11-05", service: "Monitoring" },
// //         { date: "2025-11-06", service: "Discharge Planning" },
// //       ],
// //     },
// //     {
// //       id: 25,
// //       userName: "Harish Venkat",
// //       userId: "U025",
// //       category: "Diagnostics",
// //       subcategory: "MRI",
// //       numbers: 3,
// //       details: [
// //         { date: "2025-11-03", service: "Shoulder MRI" },
// //         { date: "2025-11-05", service: "Hip MRI" },
// //         { date: "2025-11-07", service: "Ankle MRI" },
// //       ],
// //     },
// //   ]);

// //   const [filters, setFilters] = useState({
// //     userName: "",
// //     userId: "",
// //     category: "",
// //     subcategory: "",
// //     numbers: "",
// //   });

// //   const [reportType, setReportType] = useState<"summary" | "detailed">("summary");

// //   const handleFilterChange = (field: string, value: string) => {
// //     setFilters((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handlePrint = () => {
// //     window.print();
// //   };

// //   const exportToExcel = () => {
// //     const exportData: any[] = [];

// //     filteredData.forEach((row, i) => {
// //       // Add summary row
// //       exportData.push({
// //         SrNo: i + 1,
// //         UserName: row.userName,
// //         UserID: row.userId,
// //         Category: row.category,
// //         Subcategory: row.subcategory,
// //         Numbers: row.numbers,
// //       });

// //       // Add detailed rows if detailed mode
// //       if (reportType === "detailed" && row.details) {
// //         row.details.forEach((d) => {
// //           exportData.push({
// //             SrNo: "",
// //             UserName: d.date,
// //             UserID: d.service,
// //             Category: "",
// //             Subcategory: "",
// //             Numbers: "",
// //           });
// //         });
// //       }
// //     });

// //     const worksheet = XLSX.utils.json_to_sheet(exportData);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
// //     XLSX.writeFile(workbook, "Reports.xlsx");
// //   };

// //   const categories = Array.from(new Set(data.map((d) => d.category)));
// //   const subcategories = Array.from(new Set(data.map((d) => d.subcategory)));

// //   const filteredData = data.filter((row) => {
// //     const userNameMatch = row.userName.toLowerCase().includes(filters.userName.toLowerCase());
// //     const userIdMatch = row.userId.toLowerCase().includes(filters.userId.toLowerCase());
// //     const categoryMatch = filters.category ? row.category === filters.category : true;
// //     const subcategoryMatch = filters.subcategory ? row.subcategory === filters.subcategory : true;
// //     const numbersMatch = filters.numbers ? row.numbers.toString().includes(filters.numbers) : true;

// //     return userNameMatch && userIdMatch && categoryMatch && subcategoryMatch && numbersMatch;
// //   });

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       {/* Top Bar */}
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-2xl font-semibold text-green-700">User Wise Report</h1>

// //         <div className="flex space-x-3">
// //           <select
// //             value={reportType}
// //             onChange={(e) => setReportType(e.target.value as "summary" | "detailed")}
// //             className="border px-2 py-1 rounded text-sm"
// //           >
// //             <option value="summary">Summary Report</option>
// //             <option value="detailed">Detailed Report</option>
// //           </select>

// //           <button onClick={handlePrint} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
// //             Print
// //           </button>

// //           <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
// //             Export Excel
// //           </button>
// //         </div>
// //       </div>

// //       {/* Summary Info */}
// //       <div className="mb-4 text-sm text-gray-600">
// //         Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
// //         <span className="font-semibold">{data.length}</span> records
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto rounded-lg shadow-md">
// //         <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
// //           <thead className="bg-green-600 text-white text-center">
// //             <tr>
// //               <th className="px-3 py-2">Sr.No</th>
// //               <th className="px-3 py-2">User Name</th>
// //               <th className="px-3 py-2">User ID</th>
// //               <th className="px-3 py-2">Category</th>
// //               <th className="px-3 py-2">Subcategory</th>
// //               <th className="px-3 py-2">Numbers</th>
// //             </tr>

// //             {/* Filters */}
// //             <tr className="bg-green-50 text-gray-700 text-center">
// //               <td></td>
// //               <td className="px-2 py-1">
// //                 <input
// //                   type="text"
// //                   value={filters.userName}
// //                   onChange={(e) => handleFilterChange("userName", e.target.value)}
// //                   placeholder="Search name"
// //                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
// //                 />
// //               </td>
// //               <td className="px-2 py-1">
// //                 <input
// //                   type="text"
// //                   value={filters.userId}
// //                   onChange={(e) => handleFilterChange("userId", e.target.value)}
// //                   placeholder="Search ID"
// //                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
// //                 />
// //               </td>
// //               <td className="px-2 py-1">
// //                 <select
// //                   value={filters.category}
// //                   onChange={(e) => handleFilterChange("category", e.target.value)}
// //                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
// //                 >
// //                   <option value="">All</option>
// //                   {categories.map((cat) => (
// //                     <option key={cat} value={cat}>
// //                       {cat}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </td>
// //               <td className="px-2 py-1">
// //                 <select
// //                   value={filters.subcategory}
// //                   onChange={(e) => handleFilterChange("subcategory", e.target.value)}
// //                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
// //                 >
// //                   <option value="">All</option>
// //                   {subcategories.map((sub) => (
// //                     <option key={sub} value={sub}>
// //                       {sub}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </td>
// //               <td className="px-2 py-1">
// //                 <input
// //                   type="text"
// //                   value={filters.numbers}
// //                   onChange={(e) => handleFilterChange("numbers", e.target.value)}
// //                   placeholder="Search no."
// //                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
// //                 />
// //               </td>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {filteredData.length > 0 ? (
// //               filteredData.map((row, i) => (
// //                 <React.Fragment key={row.id}>
// //                   {/* Main summary row */}
// //                   <tr className="border-b text-center">
// //                     <td className="px-3 py-2">{i + 1}</td>
// //                     <td className="px-3 py-2">{row.userName}</td>
// //                     <td className="px-3 py-2">{row.userId}</td>
// //                     <td className="px-3 py-2">{row.category}</td>
// //                     <td className="px-3 py-2">{row.subcategory}</td>
// //                     <td className="px-3 py-2 font-semibold text-green-700">{row.numbers}</td>
// //                   </tr>

// //                   {/* Detailed rows (auto-expanded in detailed mode) */}
// //                   {reportType === "detailed" &&
// //                     row.details?.map((d, idx) => (
// //                       <tr key={idx} className="border-b text-center bg-gray-50">
// //                         <td></td>
// //                         <td className="px-3 py-2 pl-4 text-gray-600">{d.date}</td>
// //                         <td className="px-3 py-2 text-gray-600">{d.service}</td>
// //                         <td className="px-3 py-2"></td>
// //                         <td className="px-3 py-2"></td>
// //                         <td className="px-3 py-2"></td>
// //                       </tr>
// //                     ))}
// //                 </React.Fragment>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan={6} className="text-center py-4 text-gray-500 italic">
// //                   No records found for selected filters
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserwiseReport;




// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { API } from "../../services/AllApiServices";

// interface Detail {
//   date: string;
//   service: string;
// }

// interface PatientRow {
//   id: number;
//   userName: string;
//   userId: string;
//   category: string;
//   subcategory: string;
//   numbers: number;
//   details?: Detail[];
// }

// const UserwiseReport = () => {
//   const [data, setData] = useState<PatientRow[]>([]);

//   const [filters, setFilters] = useState({
//     userName: "",
//     userId: "",
//     category: "",
//     subcategory: "",
//     numbers: "",
//   });

//   const [reportType, setReportType] = useState<"summary" | "detailed">("summary");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const fetchReport = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await API.getReportByUser({
//         UserId: filters.userId || "",
//         UserName: filters.userName || "",
//         Category: filters.category || "",
//         SubCategory: filters.subcategory || "",
//         Numbers: Number(filters.numbers) || 0,
//       });

//       // If backend returns rows directly
//       const rows: PatientRow[] = res.data ?? [];

//       // Add `id` to each row for React key (or use index if not provided)
//       const withIds = rows.map((r, idx) => ({ ...r, id: idx + 1 }));

//       setData(withIds);
//     } catch (e) {
//       setError("Failed to fetch user-wise report");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data whenever filters change
//   useEffect(() => {
//     fetchReport();
//   }, [filters]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const exportToExcel = () => {
//     const exportData: any[] = [];

//     filteredData.forEach((row, i) => {
//       exportData.push({
//         SrNo: i + 1,
//         UserName: row.userName,
//         UserID: row.userId,
//         Category: row.category,
//         Subcategory: row.subcategory,
//         Numbers: row.numbers,
//       });

//       if (reportType === "detailed" && row.details) {
//         row.details.forEach((d) => {
//           exportData.push({
//             SrNo: "",
//             UserName: d.date,
//             UserID: d.service,
//             Category: "",
//             Subcategory: "",
//             Numbers: "",
//           });
//         });
//       }
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
//     XLSX.writeFile(workbook, "Reports.xlsx");
//   };

//   const categories = Array.from(new Set(data.map((d) => d.category)));
//   const subcategories = Array.from(new Set(data.map((d) => d.subcategory)));

//   const filteredData = data.filter((row) => {
//   const userNameMatch = row.userName?.toLowerCase().includes(filters.userName.toLowerCase()) ?? false;
//   const userIdMatch = row.userId?.toLowerCase().includes(filters.userId.toLowerCase()) ?? false;
//   const categoryMatch = filters.category ? row.category === filters.category : true;
//   const subcategoryMatch = filters.subcategory ? row.subcategory === filters.subcategory : true;
//   const numbersMatch = filters.numbers ? row.numbers.toString().includes(filters.numbers) : true;

//   return userNameMatch && userIdMatch && categoryMatch && subcategoryMatch && numbersMatch;
// });


//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold text-green-700">User Wise Report</h1>

//         <div className="flex space-x-3">
//           <select
//             value={reportType}
//             onChange={(e) => setReportType(e.target.value as "summary" | "detailed")}
//             className="border px-2 py-1 rounded text-sm"
//           >
//             <option value="summary">Summary Report</option>
//             <option value="detailed">Detailed Report</option>
//           </select>

//           <button onClick={handlePrint} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
//             Print
//           </button>

//           <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Summary Info */}
//       <div className="mb-4 text-sm text-gray-600">
//         {loading ? (
//           "Loading..."
//         ) : error ? (
//           <span className="text-red-600">{error}</span>
//         ) : (
//           <>
//             Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
//             <span className="font-semibold">{data.length}</span> records
//           </>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
//           <thead className="bg-green-600 text-white text-center">
//             <tr>
//               <th className="px-3 py-2">Sr.No</th>
//               <th className="px-3 py-2">User Name</th>
//               <th className="px-3 py-2">User ID</th>
//               <th className="px-3 py-2">Category</th>
//               <th className="px-3 py-2">Subcategory</th>
//               <th className="px-3 py-2">Numbers</th>
//             </tr>

//             {/* Filters */}
//             <tr className="bg-green-50 text-gray-700 text-center">
//               <td></td>
//               <td className="px-2 py-1">
//                 <input
//                   type="text"
//                   value={filters.userName}
//                   onChange={(e) => handleFilterChange("userName", e.target.value)}
//                   placeholder="Search name"
//                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
//                 />
//               </td>
//               <td className="px-2 py-1">
//                 <input
//                   type="text"
//                   value={filters.userId}
//                   onChange={(e) => handleFilterChange("userId", e.target.value)}
//                   placeholder="Search ID"
//                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
//                 />
//               </td>
//               <td className="px-2 py-1">
//                 <select
//                   value={filters.category}
//                   onChange={(e) => handleFilterChange("category", e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
//                 >
//                   <option value="">All</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//               <td className="px-2 py-1">
//                 <select
//                   value={filters.subcategory}
//                   onChange={(e) => handleFilterChange("subcategory", e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
//                 >
//                   <option value="">All</option>
//                   {subcategories.map((sub) => (
//                     <option key={sub} value={sub}>
//                       {sub}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//               <td className="px-2 py-1">
//                 <input
//                   type="text"
//                   value={filters.numbers}
//                   onChange={(e) => handleFilterChange("numbers", e.target.value)}
//                   placeholder="Search no."
//                   className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
//                 />
//               </td>
//             </tr>
//           </thead>

//           <tbody>
//             {!loading && !error && filteredData.length > 0 ? (
//               filteredData.map((row, i) => (
//                 <React.Fragment key={row.id}>
//                   {/* Main summary row */}
//                   <tr className="border-b text-center">
//                     <td className="px-3 py-2">{i + 1}</td>
//                     <td className="px-3 py-2">{row.userName}</td>
//                     <td className="px-3 py-2">{row.userId}</td>
//                     <td className="px-3 py-2">{row.category}</td>
//                     <td className="px-3 py-2">{row.subcategory}</td>
//                     <td className="px-3 py-2 font-semibold text-green-700">{row.numbers}</td>
//                   </tr>

//                   {/* Detailed rows */}
//                   {reportType === "detailed" &&
//                     row.details?.map((d, idx) => (
//                       <tr key={idx} className="border-b text-center bg-gray-50">
//                         <td></td>
//                         <td className="px-3 py-2 pl-4 text-gray-600">{d.date}</td>
//                         <td className="px-3 py-2 text-gray-600">{d.service}</td>
//                         <td className="px-3 py-2"></td>
//                         <td className="px-3 py-2"></td>
//                         <td className="px-3 py-2"></td>
//                       </tr>
//                     ))}
//                 </React.Fragment>
//               ))
//             ) : loading ? null : (
//               <tr>
//                 <td colSpan={6} className="text-center py-4 text-gray-500 italic">
//                   {error ? error : "No records found for selected filters"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserwiseReport;




import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { API } from "../../services/AllApiServices";

interface Detail {
  date: string;
  service: string;
}

interface PatientRow {
  id: number;
  userName: string;
  userId: string;
  category: string;
  subcategory: string;
  numbers: number;
  details?: Detail[];
}

const UserwiseReport = () => {
  const [data, setData] = useState<PatientRow[]>([]);
  const [filters, setFilters] = useState({
    userName: "",
    userId: "",
    category: "",
    subcategory: "",
    numbers: "",
  });
  const [reportType, setReportType] = useState<"summary" | "detailed">("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.getReportByUser({
        UserId: filters.userId || "",
        UserName: filters.userName || "",
        Category: filters.category || "",
        SubCategory: filters.subcategory || "",
        Numbers: Number(filters.numbers) || 0,
      });

      // Normalize API response fields to match our UI
      const rows: PatientRow[] = (res.data ?? []).map((r: any, idx: number) => ({
        id: idx + 1,
        userName: r.UserName,
        userId: r.UserId,
        category: r.Category,
        subcategory: r.SubCategory,
        numbers: r.Numbers,
        details: r.details ?? [],
      }));

      setData(rows);
    } catch (e) {
      setError("Failed to fetch user-wise report");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const handlePrint = () => window.print();

  const exportToExcel = () => {
    const exportData: any[] = [];
    filteredData.forEach((row, i) => {
      exportData.push({
        SrNo: i + 1,
        UserName: row.userName,
        UserID: row.userId,
        Category: row.category,
        Subcategory: row.subcategory,
        Numbers: row.numbers,
      });
      if (reportType === "detailed" && row.details) {
        row.details.forEach((d) => {
          exportData.push({
            SrNo: "",
            UserName: d.date,
            UserID: d.service,
            Category: "",
            Subcategory: "",
            Numbers: "",
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "Reports.xlsx");
  };

  const categories = Array.from(new Set(data.map((d) => d.category)));
  const subcategories = Array.from(new Set(data.map((d) => d.subcategory)));

  const filteredData = data.filter((row) => {
    const userNameMatch = row.userName?.toLowerCase().includes(filters.userName.toLowerCase()) ?? false;
    const userIdMatch = row.userId?.toLowerCase().includes(filters.userId.toLowerCase()) ?? false;
    const categoryMatch = filters.category ? row.category === filters.category : true;
    const subcategoryMatch = filters.subcategory ? row.subcategory === filters.subcategory : true;
    const numbersMatch = filters.numbers ? row.numbers.toString().includes(filters.numbers) : true;
    return userNameMatch && userIdMatch && categoryMatch && subcategoryMatch && numbersMatch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-700">User Wise Report</h1>
        <div className="flex space-x-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as "summary" | "detailed")}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Report</option>
          </select>
          <button onClick={handlePrint} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Print
          </button>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Info */}
      <div className="mb-4 text-sm text-gray-600">
        {loading ? (
          "Loading..."
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <>
            Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
            <span className="font-semibold">{data.length}</span> records
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
          <thead className="bg-green-600 text-white text-center">
            <tr>
              <th className="px-3 py-2">Sr.No</th>
              <th className="px-3 py-2">User Name</th>
              <th className="px-3 py-2">User ID</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subcategory</th>
              <th className="px-3 py-2">Numbers</th>
            </tr>
            {/* Filters */}
            <tr className="bg-green-50 text-gray-700 text-center">
              <td></td>
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={filters.userName}
                  onChange={(e) => handleFilterChange("userName", e.target.value)}
                  placeholder="Search name"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange("userId", e.target.value)}
                  placeholder="Search ID"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </td>
              <td className="px-2 py-1">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1">
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange("subcategory", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="">All</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={filters.numbers}
                  onChange={(e) => handleFilterChange("numbers", e.target.value)}
                  placeholder="Search no."
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </td>
            </tr>
          </thead>

          <tbody>
            {!loading && !error && filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <React.Fragment key={row.id}>
                  {/* Main summary row */}
                  <tr className="border-b text-center">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{row.userName}</td>
                    <td className="px-3 py-2">{row.userId}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.subcategory}</td>
                    <td className="px-3 py-2 font-semibold text-green-700">{row.numbers}</td>
                  </tr>

                  {/* Detailed rows */}
                  {reportType === "detailed" &&
                    row.details?.map((d, idx) => (
                      <tr key={`${row.id}-${idx}`} className="border-b text-center bg-gray-50">
                        <td></td>
                        <td className="px-3 py-2 pl-4 text-gray-600">{d.date}</td>
                        <td className="px-3 py-2 text-gray-600">{d.service}</td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            ) : loading ? null : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 italic">
                  {error ? error : "No records found for selected filters"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserwiseReport;
