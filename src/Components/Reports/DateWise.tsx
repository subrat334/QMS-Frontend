

import { useState, useEffect} from "react";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";
import { API } from "../../services/AllApiServices";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../assets/Utkal_BW_Logo.png";

(pdfMake as any).vfs = pdfFonts.vfs;


interface BackendReport {
  SrNo: number;
  DateAndTime: string;
  MobileNumber: string;
  UserName: string;
  CallTime: string;
  ReceiveTime: string;
  CompleteTime: string;
  Category: string;
  CategoryId: number;
  SubCategory: string;
  SubCategoryId: number;
  Token: string;
  NoOfToken: number;
  TAT1: string;
  TAT2: string;
  TAT3: string;
  Status: "DONE" | "CANCELLED" | string;
  UserTypeName: string;
  UserTypeId: string;
  UserId: string;

  Remarks: string;
}

const DatewiseReport = () => {
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const uniqueCategories = Array.from(new Set(reports.map(r => r.Category)));
  const uniqueSubcategories = Array.from(new Set(reports.map(r => r.SubCategory)));
  const uniqueUsers = Array.from(new Set(reports.map(r => r.UserName)));
  const uniqueStatuses = Array.from(new Set(reports.map(r => r.Status)));

  


  interface HeaderFilterProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }
  useEffect(() => {
    // page load
    const today = new Date().toISOString().split("T")[0];
    fetchReports(today, today);
  }, []);

  useEffect(() => {
    // date change
    if (fromDate && toDate) {
      fetchReports(fromDate, toDate);
    }
  }, [fromDate, toDate]);



  const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};
 

const handlePdfDownload = async () => {
  const logoBase64 = await loadImageAsBase64(logo);

  const body: any[] = [];

  // TABLE HEADER
  body.push([
    { text: "Sr.No", style: "tableHeader" },
    { text: "Date & Time", style: "tableHeader" },
    { text: "Token", style: "tableHeader" },
    { text: "Mobile", style: "tableHeader" },
    { text: "Category", style: "tableHeader" },
    { text: "Sub-Category", style: "tableHeader" },
    { text: "User", style: "tableHeader" },
    { text: "TAT1", style: "tableHeader" },
    { text: "TAT2", style: "tableHeader" },
    { text: "TAT3", style: "tableHeader" },
    { text: "Status", style: "tableHeader" },
  ]);

  // TABLE DATA
  filteredReports.forEach((r, i) => {
    body.push([
      i + 1,
      formatDateTime24(r.DateAndTime),
      r.Token,
      r.MobileNumber,
      r.Category,
      r.SubCategory,
      r.UserName,
      r.TAT1 ?? calculateTAT(r.DateAndTime, r.CallTime),
      r.TAT2 ?? calculateTAT(r.DateAndTime, r.ReceiveTime),
      r.TAT3 ?? calculateTAT(r.ReceiveTime, r.CompleteTime),
      r.Status,
    ]);
  });

  const docDefinition: TDocumentDefinitions = {
    pageOrientation: "landscape",
    pageSize: "A4",

    header: {
      margin: [40, 20, 40, 0],
      columns: [
        { image: logoBase64, width: 120 },

        {
          stack: [
            {
              text: "UTKAL HEALTHCARE PRIVATE LIMITED",
              alignment: "center",
              bold: true,
              fontSize: 20,
              margin: [0, 0, 0, 10],
            },
            {
              text: "C/3, NILADRI VIHAR, CHANDRASEKHARPUR, BHUBANESHWAR - 751021",
              alignment: "center",
              bold: true,
              fontSize: 15,
              characterSpacing: 1.3,
              margin: [0, 0, 0, 5],
            },
            {
              text: "CONTACT : 0674-2651200/201   MOB : +91 6370704001/4002",
              alignment: "center",
              bold: true,
              fontSize: 15,
              characterSpacing: 1.3,
              margin: [0, 0, 0, 15],
            },
          ],
        },
      ],
    },

    content: [
      {
        text: `Date Wise Report (${fromDate} to ${toDate})`,
        style: "header",
        margin: [0, 0, 0, 15],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "*", "*", "*", "*", "auto", "auto", "auto", "auto"],
          body,
        },
        layout: "lightHorizontalLines",
      },
    ],

    styles: {
      header: { fontSize: 16, bold: true },
      tableHeader: {
        bold: true,
        fillColor: "#22c55e",
        color: "white",
        alignment: "center",
        fontSize: 10,
      },
    },

    pageMargins: [40, 100, 40, 60],
  };

  pdfMake.createPdf(docDefinition).download("DatewiseReport.pdf");
};

const fetchReports = async (from: string, to: string) => {
  try {
    setLoading(true);

    const response = await API.getReportByDate({
      From: from,
      To: to,
      // OrgId: orgId,
      PageNumber: 1,
      PageSize: 10,
    });

    setReports(response.data ?? []);
  } catch (error) {
    console.error("Failed to fetch date-wise report", error);
  } finally {
    setLoading(false);
  }
};


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
  
//   const handlePrint = () => {
//   window.print();
// };
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredReports);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
  XLSX.writeFile(workbook, "Reports.xlsx");
};


const filteredReports = reports.filter((r) => {
  const recordDate = r. DateAndTime.substring(0, 10);

  if (fromDate && recordDate < fromDate) return false;
  if (toDate && recordDate > toDate) return false;

  if (categoryFilter && r.Category !== categoryFilter) return false;
  if (subcategoryFilter && r.SubCategory !== subcategoryFilter) return false;
  if (userFilter && r.UserName !== userFilter) return false;
  if (statusFilter && r.Status !== statusFilter) return false;

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
      <button
        onClick={() => {
          setFromDate("");
          setToDate("");
          setReports([]);
        }}
        className="text-sm text-blue-600 underline"
      >
        Clear
      </button>

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
      onClick={handlePdfDownload}
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
  Completed: {filteredReports.filter(r => r.Status === "DONE").length} &nbsp; | &nbsp;
  Cancelled: {filteredReports.filter(r => r.Status === "CANCELLED").length}
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
  {/* 🔹 Loading state */}
  {loading && (
    <tr>
      <td
        colSpan={15}
        className="text-center py-4 text-gray-500 italic"
      >
        Loading report data...
      </td>
    </tr>
  )}

  {/* 🔹 Data rows */}
  {!loading &&
    filteredReports.map((r, i) => (
      <tr
        key={`${r.Token}-${i}`}
        className="border-b hover:bg-gray-100 text-center transition"
      >
        <td className="px-3 py-2">{i + 1}</td>

        <td className="px-3 py-2">
          {formatDateTime24(r.DateAndTime)}
        </td>

        <td className="px-3 py-2 font-medium text-gray-800">
          {r.Token}
        </td>

        <td className="px-3 py-2">{r.MobileNumber}</td>
        <td className="px-3 py-2">{r.Category}</td>
        <td className="px-3 py-2">{r.SubCategory}</td>
        <td className="px-3 py-2">{r.UserName}</td>

        <td className="px-3 py-2">{formatTime24(r.CallTime)}</td>
        <td className="px-3 py-2">{formatTime24(r.ReceiveTime)}</td>
        <td className="px-3 py-2">{formatTime24(r.CompleteTime)}</td>

        <td className="px-3 py-2">
          {calculateTAT(r.DateAndTime, r.CallTime)}
        </td>
        <td className="px-3 py-2">
          {calculateTAT(r.DateAndTime, r.ReceiveTime)}
        </td>
        <td className="px-3 py-2">
          {calculateTAT(r.ReceiveTime, r.CompleteTime)}
        </td>

        <td className="px-3 py-2">
          {r.Status === "DONE" ? "Service Done" : "Not Served"}
        </td>

        <td
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            r.Status === "DONE"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {r.Status}
        </td> 
      </tr>
    ))}

  {/* 🔹 Empty state */}
  {!loading && filteredReports.length === 0 && (
    <tr>
      <td
        colSpan={15}
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