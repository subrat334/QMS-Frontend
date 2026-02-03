
import { useState, useEffect} from "react";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";
import { API } from "../../services/AllApiServices";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../assets/utkal.png";

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
 Status: "DONE" | "CANCELLED" | "AUTOCLOSED" | "CANCEL"; 
  UserTypeName: string;
  UserTypeId: string;
  UserId: string;
  TotalRowCount?: number;
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
  // const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const today = new Date().toISOString().split("T")[0];

  /* ================= DERIVED DATA ================= */

  const uniqueSubcategories = Array.from(new Set(reports.filter(r =>
      categoryFilter ? r.Category === categoryFilter : true
        )
        .map(r => r.SubCategory)
    )
);



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

 
  const handleGoClick = () => {
  if (!fromDate || !toDate) {
    alert("Please select both From and To dates");
    return;
  }

  fetchReports(fromDate, toDate);
};


  const categoryMap = Array.from(
  new Map(
    reports.map(r => [r.Category, r.CategoryId])
  )
);

// const uniqueCategories = categoryMap.map(([name]) => name);



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

  // =========================
  // TABLE HEADER
  // =========================
  body.push([
    "Sr.No",
    "Date(T1)",
    "Token",
    "Mobile",
    "Category",
    "Sub-Category",
    "User",
    "Call Time (T2)",
    "Receive Time (T3)",
    "Complete Time (T4)",
    "TAT1",
    "TAT2",
    "TAT3",
    "Remarks",
    "Status",
  ].map(h => ({ text: h, style: "tableHeader" })));

  // =========================
  // TABLE DATA
  // =========================
  filteredReports.forEach((r, i) => {
    body.push([
      i + 1,
      formatTime24(r.DateAndTime),
      r.Token,
      r.MobileNumber,
      r.Category,
      r.SubCategory,
      r.UserName,
      formatTime24(r.CallTime),
      formatTime24(r.ReceiveTime),
      formatTime24(r.CompleteTime),
      calculateTAT(r.DateAndTime, r.CallTime),
      calculateTAT(r.DateAndTime, r.ReceiveTime),
      calculateTAT(r.ReceiveTime, r.CompleteTime),
     {
  text:
    r.Remarks?.trim()
      ? r.Remarks
      : r.Status === "DONE"
      ? "Service Done"
      : r.Status === "AUTOCLOSED"
      ? "Token Auto Closed"
      : "Not Served",
  noWrap: false,
},

      {
        text: r.Status,
        bold: true,
        color: r.Status === "DONE" ? "#15803d" : "#b91c1c",
        alignment: "center",
      },
    ]);
  });

  const docDefinition: TDocumentDefinitions = {
    pageOrientation: "landscape",
    pageSize: "A4",

    pageMargins: [20, 95, 20, 40],

    header: {
      margin: [20, 20, 20, 0],
      columns: [
        { image: logoBase64, width: 90 },
        {
          stack: [
            {
              text: "UTKAL HEALTHCARE PRIVATE LIMITED",
              alignment: "center",
              bold: true,
              characterSpacing: 1.3,
              fontSize: 16,
            },
            {
              text:
                "C/3, NILADRI VIHAR, CHANDRASEKHARPUR, BHUBANESHWAR - 751021",
              alignment: "center",
              characterSpacing: 1.3,
              fontSize: 11,
            },
            {
              text:
                "CONTACT : 0674-2651200/201   MOB : +91 6370704001/4002",
              alignment: "center",
              fontSize: 11,
              characterSpacing: 1.3,
              margin: [0, 3, 0, 0],
            },
          ],
        },
      ],
    },

    content: [
      {
        text: `Date Wise Report (${fromDate} to ${toDate})`,
        style: "header",
        margin: [0, 8, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [
            15,   // Sr.No
            32,   // Date & Time
            30,   // Token
            50,   // Mobile
            50,   // Category
            50,   // Sub-Category
            50,   // User
            30,   // Call
            30,   // Receive
            30,   // Complete
            35,   // TAT1
            35,   // TAT2
            35,   // TAT3
            80,   // Remarks
            40,   // Status
          ],
          body,
        },
        layout: "lightHorizontalLines",
      },
    ],

    styles: {
      header: {
        fontSize: 14,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 8,
        fillColor: "#16a34a",
        color: "white",
        alignment: "center",
      },
    },

    defaultStyle: {
      fontSize: 8,
    },
  };

  pdfMake.createPdf(docDefinition).download("DatewiseReport.pdf");
};


const fetchReports = async (from: string, to: string) => {
  try {
    setLoading(true);

    const pageSize = 50;
    let allData: BackendReport[] = [];

    //  First call
    const firstResponse = await API.getReportByDate({
      From: from,
      To: to,
      PageNumber: 1,
      PageSize: pageSize,
    });

    const firstPageData: BackendReport[] = firstResponse.data ?? [];

    if (firstPageData.length === 0) {
      setReports([]);
      return;
    }

    //  Read TotalRowCount from first row
    const totalRows = firstPageData[0].TotalRowCount ?? firstPageData.length;

    allData = [...firstPageData];

    const totalPages = Math.ceil(totalRows / pageSize);

    //  Remaining pages
    for (let page = 2; page <= totalPages; page++) {
      const response = await API.getReportByDate({
        From: from,
        To: to,
        PageNumber: page,
        PageSize: pageSize,
      });

      allData.push(...(response.data ?? []));
    }

    //  Optional cleanup: remove TotalRowCount from rows
   const cleanedData = allData.map(({ TotalRowCount, Status, ...rest }) => ({
      ...rest,
      Status: Status === "CANCEL" ? "CANCELLED" : Status,
    }));

    setReports(cleanedData as BackendReport[]);

  } catch (error) {
    console.error("Failed to fetch all reports", error);
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
  if (!start || !end) return "N/A";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid";
  }

  const diffMs = endDate.getTime() - startDate.getTime();

  //  Prevent negative & -0 results
  if (diffMs <= 0) return "0 min";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} min`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};



  // 🔹 Filter reports by selected date
  
//   const handlePrint = () => {
//   window.print();
// };
const exportToExcel = () => {
  const excelData = filteredReports.map((r, index) => ({
    "Sr No": index + 1,
    "Date & Time (T1)": r.DateAndTime,
    "Token": r.Token,
    "Mobile No": r.MobileNumber,
    "Category": r.Category,
    "Sub Category": r.SubCategory,
    "User": r.UserName,
    // "Call Time (T2)": r.CallTime,
    // "Receive Time (T3)": r.ReceiveTime,
    // "Complete Time (T4)": r.CompleteTime,
     "Call Time (T2)":formatTime24(r.CallTime),
      "Receive Time (T3)":formatTime24(r.ReceiveTime),
      "Complete Time (T4)":formatTime24(r.CompleteTime),

    "TAT1": calculateTAT(r.DateAndTime, r.CallTime),
    "TAT2": calculateTAT(r.DateAndTime, r.ReceiveTime),
    "TAT3": calculateTAT(r.ReceiveTime, r.CompleteTime),
      "Remarks": r.Remarks?.trim()
      ? r.Remarks
      : r.Status === "DONE"
      ? "Service Done"
      : r.Status === "AUTOCLOSED"
      ? "Token Auto Closed"
      : "Not Served",

    "Status": r.Status,
  
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datewise Report");

  XLSX.writeFile(workbook, "Datewise_Report.xlsx");
};




const filteredReports = reports.filter((r) => {
  const recordDate = r.DateAndTime.substring(0, 10);

  if (fromDate && recordDate < fromDate) return false;
  if (toDate && recordDate > toDate) return false;

  if (categoryFilter && r.Category !== categoryFilter) return false;
  if (subcategoryFilter && r.SubCategory !== subcategoryFilter) return false;
  if (userFilter && r.UserName !== userFilter) return false;
  if (statusFilter && r.Status !== statusFilter) return false;

  return true;
});

useEffect(() => {
  setSubcategoryFilter("");
}, [categoryFilter]);


const formatTime24 = (value: string) => {
  if (!value) return "-";
  const d = new Date(value); // ISO string
  if (isNaN(d.getTime())) return "Invalid";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDateTime = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Invalid";

  // Format as "dd-mm-yyyy hh:mm"
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const formatDate = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Invalid";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


const selectedDateText = (() => {
  if (!fromDate && !toDate) {
    return `Showing data for: ${formatDate(today)}`;
  }

  if (fromDate && toDate && fromDate === toDate) {
    return `Showing data for: ${formatDate(fromDate)}`;
  }

  if (fromDate && toDate) {
    return `Showing data from: ${formatDate(fromDate)} to ${formatDate(toDate)}`;
  }

  if (fromDate) {
    return `Showing data from: ${formatDate(fromDate)}`;
  }

  return "";
})();






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
        max={today}   // restrict future dates
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
        min={fromDate || undefined} // already existing
        max={today}                  // restrict future dates
        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
      />
    </div>
    
    <button
  onClick={handleGoClick}
  disabled={!fromDate || !toDate}
  className={`px-4 py-1 rounded-md text-sm font-medium text-white
    ${fromDate && toDate
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
    }`}
>
  Go
</button>


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
<div className="mb-2 text-sm font-medium text-gray-600">
  {selectedDateText}
</div>


{/* SUMMARY BAR */}
<div className=" text-sm font-semibold text-gray-700">
  Total Tokens: {filteredReports.length} &nbsp; | &nbsp;
  Completed: {filteredReports.filter(r => r.Status === "DONE").length} &nbsp; | &nbsp;
  Cancelled: {filteredReports.filter(r => r.Status === "CANCELLED").length} &nbsp; | &nbsp;
  Auto Closed: {filteredReports.filter(r => r.Status === "AUTOCLOSED").length}
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
            options={categoryMap.map(([name]) => name)}
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
          {formatDateTime(r.DateAndTime)}
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

      <td className="px-3 py-2 text-left">
  {r.Remarks?.trim()
    ? r.Remarks
    : r.Status === "DONE"
    ? "Service Done"
    : r.Status === "AUTOCLOSED"
    ? "Token Auto Closed"
    : "Not Served"}
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