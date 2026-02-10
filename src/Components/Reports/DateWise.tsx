import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
  const [pdfLoading, setPdfLoading] = useState(false); // Separate loading state for PDF

  const today = new Date().toISOString().split("T")[0];

  /* ================= DERIVED DATA ================= */

  const uniqueSubcategories = Array.from(
    new Set(
      reports
        .filter((r) => (categoryFilter ? r.Category === categoryFilter : true))
        .map((r) => r.SubCategory)
        .filter((sc) => sc && sc.trim() !== "" && sc !== "-")
    )
  );

  const uniqueUsers = Array.from(
    new Set(
      reports
        .map((r) => r.UserName)
        .filter((u) => u && u.trim() !== "" && u !== "-")
    )
  );

  const uniqueStatuses = Array.from(
    new Set(reports.map((r) => r.Status).filter((s) => s && s.trim() !== ""))
  );

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
    new Map(reports.map((r) => [r.Category, r.CategoryId]))
  );

  // ========== PDF GENERATION UTILITIES ==========

  // Cache for logo to avoid repeated conversions
  let logoCache: { url: string; data: string; timestamp: number } | null = null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const createImageThumbnail = (
    url: string,
    maxWidth: number = 100
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        // Create smaller canvas for thumbnail
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(""); // Return empty string if canvas fails
          return;
        }

        // Draw image with reduced quality
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Use JPEG with lower quality for smaller size
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };

      img.onerror = () => {
        console.warn("Logo failed to load, continuing without it");
        resolve(""); // Return empty string instead of failing
      };

      img.src = url;
    });
  };

  const getCachedLogo = async (url: string): Promise<string> => {
    const now = Date.now();

    if (
      logoCache &&
      logoCache.url === url &&
      now - logoCache.timestamp < CACHE_DURATION
    ) {
      return logoCache.data;
    }

    const logoData = await createImageThumbnail(url);
    logoCache = { url, data: logoData, timestamp: now };
    return logoData;
  };

  // Format functions for PDF
  const formatTimeForPDF = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatTATForPDF = (tatString?: string): string => {
    if (!tatString) return "-";
    try {
      // Convert "hh:mm" string to "X min" or "Xh Ym"
      const [hh, mm] = tatString.split(":").map(Number);
      if (hh === 0 && mm === 0) return "0 min";
      if (hh === 0) return `${mm} min`;
      if (mm === 0) return `${hh}h`;
      return `${hh}h ${mm}m`;
    } catch {
      return "-";
    }
  };

  const displayValueForPDF = (value?: string): string => {
    return value || "-";
  };

  // MAIN OPTIMIZED PDF FUNCTION
 // MAIN OPTIMIZED PDF FUNCTION - COMPLETE VERSION
const handlePdfDownload = async () => {
  // Early validation
  if (!filteredReports || filteredReports.length === 0) {
    alert("No data to export");
    return;
  }

  try {
    // Show loading state
    setPdfLoading(true);

    // Start timing
    console.time("PDF Generation");

    // 1. Get logo in parallel with data processing
    const logoPromise = getCachedLogo(logo);

    // 2. Process data in optimized way
    const body: any[] = [];

    // Prepare headers once
    const headers = [
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
    ];

    // Add headers
    body.push(
      headers.map((h) => ({
        text: h,
        style: "tableHeader",
        fontSize: 7,
      }))
    );

    // 3. Process all rows at once (it's fast enough)
    filteredReports.forEach((r, j) => {
      // Pre-calculate values
      const remarksText = r.Remarks?.trim()
        ? r.Remarks
        : r.Status === "DONE"
        ? "Service Done"
        : r.Status === "AUTOCLOSED"
        ? "Token is Auto Closed"
        : "Not Served";

      const statusColor = r.Status === "DONE" ? "#15803d" : "#b91c1c";

      body.push([
        j + 1,
        formatTimeForPDF(r.DateAndTime),
        r.Token,
        r.MobileNumber,
        r.Category,
        r.SubCategory,
        displayValueForPDF(r.UserName),
        formatTimeForPDF(r.CallTime),
        formatTimeForPDF(r.ReceiveTime),
        formatTimeForPDF(r.CompleteTime),
        formatTATForPDF(r.TAT1),
        formatTATForPDF(r.TAT2),
        formatTATForPDF(r.TAT3),
        { text: remarksText, noWrap: false },
        {
          text: r.Status,
          bold: true,
          color: statusColor,
          alignment: "center",
        },
      ]);
    });

    // 4. Get logo
    const logoBase64 = await logoPromise;

    // 5. Create PDF definition - FIXED SYNTAX
    const docDefinition: TDocumentDefinitions = {
      pageOrientation: "landscape",
      pageSize: "A4",
      pageMargins: [15, 100, 15, 40], // Increased top margin for header

      header: logoBase64
        ? {
            columns: [
              { 
                image: logoBase64, 
                width: 120, 
                margin: [15, 10, 0, 0] 
              },
              {
                stack: [
                  {
                    text: "UTKAL HEALTHCARE PRIVATE LIMITED",
                    alignment: "center",
                     characterSpacing:1.3,
                    bold: true,
                    fontSize: 17, // Reduced from 20
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: "C/3, NILADRI VIHAR, CHANDRASEKHARPUR, BHUBANESHWAR - 751021",
                    alignment: "center",
                     bold: true,
                    fontSize: 15, // Reduced from 15
                     characterSpacing:1.3,
                    margin: [0, 0, 0, 3],
                  },
                  {
                    text: "CONTACT : 0674-2651200/201   MOB : +91 6370704001/4002",
                    alignment: "center",
                     characterSpacing:1.3,
                     bold: true,
                    fontSize: 15, // Reduced from 15
                    margin: [0, 0, 0, 0],
                  },
                ],
                width: "*",
              },
            ],
            margin: [0, 10, 0, 0],
          }
        : undefined,

      content: [
        {
          text: `Date Wise Report (${fromDate} to ${toDate})`,
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: "center",
        },
  //       {
  //   text: selectedDateText, // <-- ADD THIS LINE (use your existing selectedDateText)
  //   fontSize: 11,
  //   alignment: "center",
  //   color: "#555",
  //   margin: [0, 0, 0, 10], // Margin below date text
  // },
        {
          table: {
            headerRows: 1,
            dontBreakRows: false,
            widths: [
              '3%', '8%', '6%', '8%', '9%', '9%', '9%', '5%', '5%', '5%', '5%', '5%', '5%', '12%', '8%'
            ],
            body,
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === body.length ? 1 : 0.5),
            vLineWidth: () => 0.5,
            hLineColor: (i: number) => (i === 0 ? "#000" : "#aaa"),
            vLineColor: () => "#ccc",
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        },
      ],

      styles: {
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

    console.timeEnd("PDF Generation");
    console.time("PDF Download");

    // 6. Generate and trigger download
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    
    // Use a promise wrapper to ensure loading state is reset
    await new Promise<void>((resolve, reject) => {
      let downloadCompleted = false;
      let fallbackTriggered = false;
      
      // Set a timeout to reset loading state in case PDF generation hangs
      const timeoutId = setTimeout(() => {
        if (!downloadCompleted) {
          console.warn("PDF download timeout, resetting loading state");
          setPdfLoading(false);
        }
      }, 3000); // 30 second timeout
      
      try {
        // Method 1: Try download() first
        pdfDocGenerator.download(
          `Datewise_Report_${fromDate}_to_${toDate}.pdf`,
          () => {
            downloadCompleted = true;
            clearTimeout(timeoutId);
            console.timeEnd("PDF Download");
            resolve();
          }
        );
      } catch (error) {
        if (fallbackTriggered) {
          clearTimeout(timeoutId);
          reject(error);
          return;
        }
        
        console.error("PDF download() failed, trying blob method:", error);
        fallbackTriggered = true;
        
        // Method 2: Fallback to blob approach
        try {
          pdfDocGenerator.getBlob((blob: Blob) => {
            downloadCompleted = true;
            clearTimeout(timeoutId);
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Datewise_Report_${fromDate}_to_${toDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 100);
            
            console.timeEnd("PDF Download");
            resolve();
          });
        } catch (blobError) {
          clearTimeout(timeoutId);
          console.error("Blob method also failed:", blobError);
          reject(blobError);
        }
      }
    });
    
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Always reset loading state
    setPdfLoading(false);
  }
};

  const fetchReports = async (from: string, to: string) => {
    try {
      setLoading(true);

      const pageSize = 50;
      let allData: BackendReport[] = [];

      // First call
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

      // Read TotalRowCount from first row
      const totalRows = firstPageData[0].TotalRowCount ?? firstPageData.length;

      allData = [...firstPageData];

      const totalPages = Math.ceil(totalRows / pageSize);

      // Remaining pages
      for (let page = 2; page <= totalPages; page++) {
        const response = await API.getReportByDate({
          From: from,
          To: to,
          PageNumber: page,
          PageSize: pageSize,
        });

        allData.push(...(response.data ?? []));
      }

      // Optional cleanup: remove TotalRowCount from rows
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
        <span className="text-xs font-semibold tracking-wide">{label}</span>

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

  const exportToExcel = () => {
    const excelData = filteredReports.map((r, index) => ({
      "Sr No": index + 1,
      "Date & Time (T1)": formatDateTime(r.DateAndTime),
      Token: r.Token,
      "Mobile No": r.MobileNumber,
      Category: r.Category,
      "Sub Category": r.SubCategory,
      User: displayValue(r.UserName),
      "Call Time (T2)": formatTime(r.CallTime),
      "Receive Time (T3)": formatTime(r.ReceiveTime),
      "Complete Time (T4)": formatTime(r.CompleteTime),
      TAT1: formatTAT(r.TAT1),
      TAT2: formatTAT(r.TAT2),
      TAT3: formatTAT(r.TAT3),
      Remarks: r.Remarks?.trim()
        ? r.Remarks
        : r.Status === "DONE"
        ? "Service Done"
        : r.Status === "AUTOCLOSED"
        ? "Token  is Auto Closed"
        : "Not Served",
      Status: r.Status,
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

  // Format functions for UI display
  const formatTime = (value: string) => {
    if (!value) return "-";
    const d = new Date(value);
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
      return `Showing data from: ${formatDate(fromDate)} to ${formatDate(
        toDate
      )}`;
    }

    if (fromDate) {
      return `Showing data from: ${formatDate(fromDate)}`;
    }

    return "";
  })();

  const displayValue = (value?: string | null) => {
    if (!value || value.trim() === "" || value === "-") {
      return "Not Attended";
    }
    return value;
  };

  const formatTAT = (value?: string) => {
    if (!value) return "0 min";

    const [hh, mm] = value.split(":").map(Number);

    if (hh === 0 && mm === 0) return "0 min";
    if (hh === 0) return `${mm} min`;
    if (mm === 0) return `${hh}h`;

    return `${hh}h ${mm}m`;
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
              max={today}
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
              min={fromDate || undefined}
              max={today}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>

          <button
            onClick={handleGoClick}
            disabled={!fromDate || !toDate}
            className={`px-4 py-1 rounded-md text-sm font-medium text-white
              ${
                fromDate && toDate
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
            disabled={pdfLoading || filteredReports.length === 0}
            className={`bg-blue-600 text-white px-3 py-1 rounded-md text-sm ${
              pdfLoading || filteredReports.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {pdfLoading ? "Generating PDF..." : "Print"}
          </button>

          <button
            onClick={exportToExcel}
            disabled={filteredReports.length === 0}
            className={`bg-green-600 text-white px-3 py-1 rounded-md text-sm ${
              filteredReports.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="mb-2 text-sm font-medium text-gray-600">
        {selectedDateText}
      </div>

      {/* SUMMARY BAR */}
      <div className=" text-sm font-semibold text-gray-700">
        Total Tokens: {filteredReports.length} &nbsp; | &nbsp;
        Completed: {filteredReports.filter((r) => r.Status === "DONE").length}{" "}
        &nbsp; | &nbsp;
        Cancelled:{" "}
        {filteredReports.filter((r) => r.Status === "CANCELLED").length} &nbsp;
        | &nbsp;
        Auto Closed:{" "}
        {filteredReports.filter((r) => r.Status === "AUTOCLOSED").length}
      </div>

      <div className="relative flex-1 overflow-y-auto overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
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
                <td colSpan={15} className="text-center py-4 text-gray-500 italic">
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

                  <td className="px-3 py-2">{formatDateTime(r.DateAndTime)}</td>

                  <td className="px-3 py-2 font-medium text-gray-800">
                    {r.Token}
                  </td>

                  <td className="px-3 py-2">{r.MobileNumber}</td>
                  <td className="px-3 py-2">{r.Category}</td>
                  <td className="px-3 py-2">{r.SubCategory}</td>
                  <td className="px-3 py-2">{displayValue(r.UserName)}</td>

                  <td className="px-3 py-2">{formatTime(r.CallTime)}</td>
                  <td className="px-3 py-2">{formatTime(r.ReceiveTime)}</td>
                  <td className="px-3 py-2">{formatTime(r.CompleteTime)}</td>

                  <td className="px-3 py-2">{formatTAT(r.TAT1)}</td>
                  <td className="px-3 py-2">{formatTAT(r.TAT2)}</td>
                  <td className="px-3 py-2">{formatTAT(r.TAT3)}</td>

                  <td className="px-3 py-2 text-left">
                    {r.Remarks?.trim()
                      ? r.Remarks
                      : r.Status === "DONE"
                      ? "Service Done"
                      : r.Status === "AUTOCLOSED"
                      ? "Token  is Auto Closed"
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
                <td colSpan={15} className="text-center py-4 text-gray-500 italic">
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