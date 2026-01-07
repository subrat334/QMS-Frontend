
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { API } from "../../services/AllApiServices";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../assets/utkal.png";

(pdfMake as any).vfs = pdfFonts.vfs;




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



const loadImageAsBase64 = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
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
// const logoBase64 = await loadImageAsBase64(logo);

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

    const handlePrint = async () => {
      const logoBase64 = await loadImageAsBase64(logo);

      const body: any[] = [];

      body.push([
        { text: "Sr.No", style: "tableHeader" },
        { text: "User Name", style: "tableHeader" },
        { text: "User ID", style: "tableHeader" },
        { text: "Category", style: "tableHeader" },
        { text: "Subcategory", style: "tableHeader" },
        { text: "Numbers", style: "tableHeader" },
      ]);

      filteredData.forEach((row, i) => {
        body.push([
          i + 1,
          row.userName,
          row.userId,
          row.category,
          row.subcategory,
          row.numbers,
        ]);

        if (reportType === "detailed" && row.details) {
          row.details.forEach((d) => {
            body.push(["", d.date, d.service, "", "", ""]);
          });
        }
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
                characterSpacing:1.3,
                margin: [2, 0, 0, 5],
              },
              {
                text: "CONTACT : 0674-2651200/201   MOB : +91 6370704001/4002",
                alignment: "center",
                bold: true,
                fontSize: 15,
                characterSpacing:1.3,
                margin: [0, 0, 0, 15],
              },
            ],
          },
        ],
      },

      content: [
        { text: "User Wise Report:", style: "header", alignment: "left", margin: [0, 0, 0, 15] },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "*", "*", "*", "auto"],
            body,
          },
        },
      ],

      styles: {
        header: { fontSize: 16, bold: true },
        tableHeader: {
          bold: true,
          fillColor: "#22c55e",
          color: "white",
          alignment: "center",
        },
      },

      pageMargins: [40, 80, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download("UserwiseReport.pdf");
  };

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
        <h1 className="text-2xl font-semibold text-green-700 margin-left:-10px">User Wise Report:</h1>
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
