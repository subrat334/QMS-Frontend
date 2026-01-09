

import { useState } from "react";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";

interface ReportRow {
  id: number;
  dateTime: string;
  token: string;
  mobile: string;
  category: string;
  subcategory: string;
  contact: string;
  username: string;
  callTime: string;
  receiveTime: string;
  completeTime: string;
  status: string;
}

const DatewiseReport = () => {
  const [reports] = useState<ReportRow[]>([
    {
      id: 1,
      dateTime: "2025-11-10 09:30 AM",
      token: "TK-001",
      mobile: "9876543210",
      category: "OPD",
      subcategory: "General",
      contact: "7001234567",
      username: "Admin",
      callTime: "09:35 AM",
      receiveTime: "09:38 AM",
      completeTime: "09:50 AM",
      status: "Completed",
    },
    {
      id: 2,
      dateTime: "2025-11-10 10:00 AM",
      token: "TK-002",
      mobile: "9988776655",
      category: "Diagnostics",
      subcategory: "Radiology",
      contact: "7506543210",
      username: "Operator",
      callTime: "10:10 AM",
      receiveTime: "10:20 AM",
      completeTime: "10:45 AM",
      status: "Cancelled",
    },
    {
      id: 3,
      dateTime: "2025-11-11 10:15 AM",
      token: "TK-003",
      mobile: "8899776655",
      category: "Emergency",
      subcategory: "Trauma",
      contact: "7012345678",
      username: "Doctor",
      callTime: "10:20 AM",
      receiveTime: "10:25 AM",
      completeTime: "11:00 AM",
      status: "Completed",
    },
    {
      id: 4,
      dateTime: "2025-11-11 11:30 AM",
      token: "TK-004",
      mobile: "7766554433",
      category: "OPD",
      subcategory: "Cardiology",
      contact: "7023456789",
      username: "Nurse",
      callTime: "11:35 AM",
      receiveTime: "11:40 AM",
      completeTime: "12:15 PM",
      status: "Completed",
    },
    {
      id: 5,
      dateTime: "2025-11-11 02:15 PM",
      token: "TK-005",
      mobile: "6655443322",
      category: "Diagnostics",
      subcategory: "Lab Tests",
      contact: "7034567890",
      username: "Lab Technician",
      callTime: "02:20 PM",
      receiveTime: "02:25 PM",
      completeTime: "03:00 PM",
      status: "Completed",
    },
    {
      id: 6,
      dateTime: "2025-11-12 08:45 AM",
      token: "TK-006",
      mobile: "5544332211",
      category: "Emergency",
      subcategory: "Pediatric",
      contact: "7045678901",
      username: "Pediatrician",
      callTime: "08:50 AM",
      receiveTime: "08:55 AM",
      completeTime: "09:30 AM",
      status: "Completed",
    },
    {
      id: 7,
      dateTime: "2025-11-12 09:20 AM",
      token: "TK-007",
      mobile: "4433221100",
      category: "OPD",
      subcategory: "Orthopedics",
      contact: "7056789012",
      username: "Reception",
      callTime: "09:25 AM",
      receiveTime: "09:30 AM",
      completeTime: "10:20 AM",
      status: "Completed",
    },
    {
      id: 8,
      dateTime: "2025-11-12 10:45 AM",
      token: "TK-008",
      mobile: "3322110099",
      category: "Diagnostics",
      subcategory: "Ultrasound",
      contact: "7067890123",
      username: "Radiologist",
      callTime: "10:50 AM",
      receiveTime: "10:55 AM",
      completeTime: "11:45 AM",
      status: "Cancelled",
    },
    {
      id: 9,
      dateTime: "2025-11-12 01:30 PM",
      token: "TK-009",
      mobile: "2211009988",
      category: "OPD",
      subcategory: "Dermatology",
      contact: "7078901234",
      username: "Dermatologist",
      callTime: "01:35 PM",
      receiveTime: "01:40 PM",
      completeTime: "02:15 PM",
      status: "Completed",
    },
    {
      id: 10,
      dateTime: "2025-11-13 08:00 AM",
      token: "TK-010",
      mobile: "1100998877",
      category: "Emergency",
      subcategory: "Cardiac",
      contact: "7089012345",
      username: "Cardiologist",
      callTime: "08:05 AM",
      receiveTime: "08:10 AM",
      completeTime: "09:00 AM",
      status: "Completed",
    },
    {
      id: 11,
      dateTime: "2025-11-13 09:45 AM",
      token: "TK-011",
      mobile: "9998887776",
      category: "OPD",
      subcategory: "ENT",
      contact: "7090123456",
      username: "ENT Specialist",
      callTime: "09:50 AM",
      receiveTime: "09:55 AM",
      completeTime: "10:40 AM",
      status: "Completed",
    },
    {
      id: 12,
      dateTime: "2025-11-13 11:15 AM",
      token: "TK-012",
      mobile: "8887776665",
      category: "Diagnostics",
      subcategory: "MRI",
      contact: "7101234567",
      username: "MRI Technician",
      callTime: "11:20 AM",
      receiveTime: "11:25 AM",
      completeTime: "12:30 PM",
      status: "Completed",
    },
    {
      id: 13,
      dateTime: "2025-11-13 02:00 PM",
      token: "TK-013",
      mobile: "7776665554",
      category: "OPD",
      subcategory: "Neurology",
      contact: "7112345678",
      username: "Neurologist",
      callTime: "02:05 PM",
      receiveTime: "02:10 PM",
      completeTime: "03:00 PM",
      status: "Cancelled",
    },
    {
      id: 14,
      dateTime: "2025-11-14 08:30 AM",
      token: "TK-014",
      mobile: "6665554443",
      category: "Emergency",
      subcategory: "Surgical",
      contact: "7123456789",
      username: "Surgeon",
      callTime: "08:35 AM",
      receiveTime: "08:40 AM",
      completeTime: "10:15 AM",
      status: "Completed",
    },
    {
      id: 15,
      dateTime: "2025-11-14 10:00 AM",
      token: "TK-015",
      mobile: "5554443332",
      category: "OPD",
      subcategory: "Gynecology",
      contact: "7134567890",
      username: "Gynecologist",
      callTime: "10:05 AM",
      receiveTime: "10:10 AM",
      completeTime: "11:00 AM",
      status: "Completed",
    },
    {
      id: 16,
      dateTime: "2025-11-14 11:45 AM",
      token: "TK-016",
      mobile: "4443332221",
      category: "Diagnostics",
      subcategory: "CT Scan",
      contact: "7145678901",
      username: "CT Technician",
      callTime: "11:50 AM",
      receiveTime: "11:55 AM",
      completeTime: "01:15 PM",
      status: "Completed",
    },
    {
      id: 17,
      dateTime: "2025-11-15 09:10 AM",
      token: "TK-017",
      mobile: "3332221110",
      category: "OPD",
      subcategory: "Psychiatry",
      contact: "7156789012",
      username: "Psychiatrist",
      callTime: "09:15 AM",
      receiveTime: "09:20 AM",
      completeTime: "10:30 AM",
      status: "Completed",
    },
    {
      id: 18,
      dateTime: "2025-11-15 10:30 AM",
      token: "TK-018",
      mobile: "2221110009",
      category: "Emergency",
      subcategory: "Respiratory",
      contact: "7167890123",
      username: "Pulmonologist",
      callTime: "10:35 AM",
      receiveTime: "10:40 AM",
      completeTime: "11:25 AM",
      status: "Cancelled",
    },
    {
      id: 19,
      dateTime: "2025-11-15 01:45 PM",
      token: "TK-019",
      mobile: "1110009998",
      category: "OPD",
      subcategory: "Ophthalmology",
      contact: "7178901234",
      username: "Ophthalmologist",
      callTime: "01:50 PM",
      receiveTime: "01:55 PM",
      completeTime: "02:45 PM",
      status: "Completed",
    },
    {
      id: 20,
      dateTime: "2025-11-16 08:20 AM",
      token: "TK-020",
      mobile: "9990001112",
      category: "Diagnostics",
      subcategory: "X-Ray",
      contact: "7189012345",
      username: "X-Ray Technician",
      callTime: "08:25 AM",
      receiveTime: "08:30 AM",
      completeTime: "09:00 AM",
      status: "Completed",
    },
    {
      id: 21,
      dateTime: "2025-11-16 10:10 AM",
      token: "TK-021",
      mobile: "8889990001",
      category: "OPD",
      subcategory: "Dental",
      contact: "7190123456",
      username: "Dentist",
      callTime: "10:15 AM",
      receiveTime: "10:20 AM",
      completeTime: "11:05 AM",
      status: "Completed",
    }
  ]);

  // const [filterDate, setFilterDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const uniqueCategories = Array.from(new Set(reports.map(r => r.category)));
  const uniqueSubcategories = Array.from(new Set(reports.map(r => r.subcategory)));
  const uniqueUsers = Array.from(new Set(reports.map(r => r.username)));
  const uniqueStatuses = Array.from(new Set(reports.map(r => r.status)));
  // const [reportType, setReportType] = useState<"summary" | "detailed">("summary");
  


  interface HeaderFilterProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }

  const HeaderFilter = ({
    label,
    value,
    options,
    onChange,
  }: HeaderFilterProps) => {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold tracking-wide">
          {label}
        </span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            bg-white/90
            text-gray-800
            text-[11px]
            px-2
            py-1
            rounded-md
            border border-gray-300
            shadow-sm
            focus:outline-none
            focus:ring-2 focus:ring-green-400
            hover:border-green-400
            transition
          "
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Function to calculate TAT
  const calculateTAT = (start: string, end: string): string => {
    const parseDateTime = (str: string): Date => {
      const datePartMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
      const timePartMatch = str.match(/(\d{1,2}:\d{2}\s?(AM|PM)?)/i);
      const datePart = datePartMatch ? datePartMatch[1] : "2025-11-10";
      const timePart = timePartMatch ? timePartMatch[1] : "00:00 AM";
      return new Date(`${datePart} ${timePart}`);
    };

    try {
      const startDate = parseDateTime(start);
      const endDate = parseDateTime(end);
      const diffMs = endDate.getTime() - startDate.getTime();
      if (diffMs < 0) return "Invalid";
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 60) return `${diffMinutes} min`;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } catch {
      return "N/A";
    }
  };

  // 🔹 Filter reports by selected date
  
  const handlePrint = () => {
  window.print();
};
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredReports);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
  XLSX.writeFile(workbook, "Reports.xlsx");
};


const filteredReports = reports.filter((r) => {
  const recordDate = r.dateTime.substring(0, 10);

  if (fromDate && recordDate < fromDate) return false;
  if (toDate && recordDate > toDate) return false;

  if (categoryFilter && r.category !== categoryFilter) return false;
  if (subcategoryFilter && r.subcategory !== subcategoryFilter) return false;
  if (userFilter && r.username !== userFilter) return false;
  if (statusFilter && r.status !== statusFilter) return false;

  return true;
});
const formatDateTime24 = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatTime24 = (value: string) => {
  if (!value) return "-";
  const d = new Date(`1970-01-01 ${value}`);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};



  return (
    // <div className="p-6 bg-gray-50 h-screen">
    <div className="p-6 bg-gray-50 h-screen overflow-hidden flex flex-col">

      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        Date Wise Report
      </h1>

      {/* 🔹 Date Filter Input */}
      
  <div className="mb-4 flex items-center justify-between">

  {/* LEFT SIDE — Calendar Filters */}
  <div className="flex items-center gap-4">

    {/* From Date */}
    <div>
      <label className="text-sm font-medium text-gray-700 mr-2">
        From:
      </label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
      />
    </div>

    {/* To Date */}
    <div>
      <label className="text-sm font-medium text-gray-700 mr-2">
        To:
      </label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
      />
    </div>

    {/* Clear Button */}
    {(fromDate || toDate) && (
      <button
        onClick={() => {
          setFromDate("");
          setToDate("");
        }}
        className="text-sm text-blue-600 underline"
      >
        Clear
      </button>
    )}

  </div>

  {/* RIGHT SIDE — Buttons */}
  <div className="flex space-x-3">
      {/* <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value as "summary" | "detailed")}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="summary">Summary Report</option>
        <option value="detailed">Detailed Report</option>
      </select> */}
    <button
      onClick={handlePrint}
      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
    >
      Print
    </button>

    <button
      onClick={exportToExcel}
      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
    >
      Export Excel
    </button>

    {/* PDF button if needed */}
    {/* <button
      onClick={exportToPDF}
      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
    >
      Export PDF
    </button> */}
  </div>
  

</div>

{/* SUMMARY BAR */}
<div className=" text-sm font-semibold text-gray-700">
  Total Tokens: {filteredReports.length} &nbsp; | &nbsp;
  Completed: {filteredReports.filter(r => r.status === "Completed").length} &nbsp; | &nbsp;
  Cancelled: {filteredReports.filter(r => r.status === "Cancelled").length}
</div>

  <div className="relative flex-1 overflow-y-auto overflow-x-auto rounded-lg shadow-md">


      <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
        
      {/* <thead className="bg-green-600 text-white text-center sticky top-0 z-10"> */}
      <thead className="sticky top-0 z-30 bg-green-600 text-white text-center">

      <tr>
        <th className="px-3 py-2">Sr.No</th>
        <th className="px-3 py-2">Date & Time (T1)</th>
        <th className="px-3 py-2">Token</th>
        <th className="px-3 py-2">Mob. No</th>

        <th className="px-3 py-2">
          <HeaderFilter
            label="Cat"
            value={categoryFilter}
            options={uniqueCategories}
            onChange={setCategoryFilter}
          />
        </th>

        <th className="px-3 py-2">
          <HeaderFilter
            label="Sub-Cat"
            value={subcategoryFilter}
            options={uniqueSubcategories}
            onChange={setSubcategoryFilter}
          />
        </th>

        <th className="px-3 py-2">
          <HeaderFilter
            label="User"
            value={userFilter}
            options={uniqueUsers}
            onChange={setUserFilter}
          />
        </th>

        <th className="px-3 py-2">Call Time (T2)</th>
        <th className="px-3 py-2">Receive Time (T3)</th>
        <th className="px-3 py-2">Complete Time (T4)</th>
        <th className="px-3 py-2">TAT1</th>
        <th className="px-3 py-2">TAT2</th>
        <th className="px-3 py-2">TAT3</th>

        <th className="px-3 py-2">Remarks</th>


        <th className="px-3 py-2">
          <HeaderFilter
            label="Status"
            value={statusFilter}
            options={uniqueStatuses}
            onChange={setStatusFilter}
          />
        </th>
      </tr>
    </thead>

    <tbody>
      {filteredReports.map((r, i) => (
        <tr
          key={r.id}
          className="border-b hover:bg-gray-100 text-center transition"
        >
          <td className="px-3 py-2">{i + 1}</td>
          {/* <td className="px-3 py-2">{r.dateTime}</td> */}
          <td className="px-3 py-2">{formatDateTime24(r.dateTime)}</td>
          <td className="px-3 py-2 font-medium text-gray-800">{r.token}</td>
          <td className="px-3 py-2">{r.mobile}</td>
          <td className="px-3 py-2">{r.category}</td>
          <td className="px-3 py-2">{r.subcategory}</td>
          <td className="px-3 py-2">{r.username}</td>
          {/* <td className="px-3 py-2">{r.callTime}</td>
          <td className="px-3 py-2">{r.receiveTime}</td>
          <td className="px-3 py-2">{r.completeTime}</td> */}
          <td  className="px-3 py-2">{formatTime24(r.callTime)}</td>
          <td  className="px-3 py-2">{formatTime24(r.receiveTime)}</td>
      <td  className="px-3 py-2">{formatTime24(r.completeTime)}</td>

          <td className="px-3 py-2">
            {calculateTAT(r.dateTime, r.callTime)}
          </td>
          <td className="px-3 py-2">
            {calculateTAT(r.dateTime, r.receiveTime)}
          </td>
          <td className="px-3 py-2">
            {calculateTAT(r.receiveTime, r.completeTime)}
          </td>
      <td className="px-3 py-2">
      {r.status === "Completed" ? "Service Done" : "Not Served"}
    </td>
<td
className={`px-3 py-2 rounded-md text-sm font-medium ${
r.status === "Completed"
      ? "bg-green-100 text-green-700 border border-green-400"
      : "bg-red-100 text-red-700 border border-red-400"
  }`}
>
  {r.status}
</td>

        </tr>
      ))}

      {filteredReports.length === 0 && (
        <tr>
          <td
            colSpan={14}
            className="text-center py-4 text-gray-500 italic"
          >
            No records found for selected date
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default DatewiseReport;