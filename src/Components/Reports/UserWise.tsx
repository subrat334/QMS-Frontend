
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

interface UserDetailRow {
  UserId: string;
  UserName: string;
  Category: string;
  SubCategory: string;
  Date: string | null;
  SequenceNo: number;
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
  const [detailData, setDetailData] = useState<UserDetailRow[]>([]);
  const [reportType, setReportType] = useState<"summary" | "detailed">("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [appliedFromDate, setAppliedFromDate] = useState(today);
  const [appliedToDate, setAppliedToDate] = useState(today);


const fetchDetailedReport = async () => {
  let allRows: UserDetailRow[] = [];
  let pageNumber = 1;
  let totalRowCount = 0;
  const pageSize = 50;

  try {
    setLoading(true);
    setError("");

    do {
    const res = await API.getReportUserByDetail({
      UserId: filters.userId || "",
      UserName: filters.userName || "",
      Category: filters.category || "",
      SubCategory: filters.subcategory || "",
      Numbers: Number(filters.numbers) || 0,
        StartDate: appliedFromDate || undefined,
        EndDate: appliedToDate || undefined,
        pageNumber,
        pageSize,
      });

      const pageData: UserDetailRow[] = Array.isArray(res.data)
        ? res.data
        : res.data?.Data ?? [];

      //  READ TOTAL COUNT FROM FIRST ROW
      if (totalRowCount === 0 && pageData.length > 0) {
        totalRowCount =
          (pageData as any)[0]?.TotalRowCount ?? pageData.length;
      }

      if (pageData.length === 0) break;

      allRows.push(...pageData);
      pageNumber++;

      //  DO NOT BREAK ON ARRAY RESPONSE

    } while (allRows.length < totalRowCount);

    setDetailData(allRows);
  } catch (error) {
    setError("Failed to fetch detailed report");
    setDetailData([]);
  } finally {
    setLoading(false);
  }
};
const handleGo = () => {
  setAppliedFromDate(fromDate);
  setAppliedToDate(toDate);
};




const groupedDetailData = detailData.reduce((acc, curr) => {
  const key = `${curr.UserId}-${curr.Category}-${curr.SubCategory}`;

  if (!acc[key]) {
    acc[key] = {
      userId: curr.UserId,
      userName: curr.UserName,
      category: curr.Category,
      subcategory: curr.SubCategory,
      details: [],
    };
  }

  acc[key].details.push(curr);
  return acc;
}, {} as Record<string, any>);

const detailedRows = Object.values(groupedDetailData);



  // const handleFilterChange = (field: string, value: string) => {
  //   setFilters((prev) => ({ ...prev, [field]: value }));
  // };

  const handleFilterChange = (field: string, value: string) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
    ...(field === "category" ? { subcategory: "" } : {}),
  }));
};


  const fetchReport = async () => {
    let allRows: any[] = [];
    let pageNumber = 1;
    let totalRowCount = 0;
    const pageSize = 20;

    try {
      setLoading(true);
      setError("");

    do {
      const res = await API.getReportByUser({
        UserId: filters.userId || "",
        UserName: filters.userName || "",
        Category: filters.category || "",
        SubCategory: filters.subcategory || "",
        Numbers: Number(filters.numbers) || 0,
        StartDate: appliedFromDate,
        EndDate: appliedToDate,
        pageNumber,
        pageSize,
      });

      const pageData = Array.isArray(res.data)
        ? res.data
        : res.data?.Data ?? [];

      //  READ TotalRowCount FROM FIRST ROW
      if (totalRowCount === 0 && pageData.length > 0) {
        totalRowCount =
          pageData[0]?.TotalRowCount ?? pageData.length;
      }

      if (pageData.length === 0) break;

      allRows.push(...pageData);
      pageNumber++;

      //  STOP ONLY WHEN ALL ROWS ARE FETCHED
    } while (allRows.length < totalRowCount);

    const mappedRows: PatientRow[] = allRows.map((r: any, idx: number) => ({
        id: idx + 1,
        userName: r.UserName,
        userId: r.UserId,
        category: r.Category,
        subcategory: r.SubCategory,
        numbers: r.Numbers,
    }));

      setData(mappedRows);
    } catch (err) {
      setError("Failed to fetch summary report");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (reportType === "summary") {
    fetchReport();
  }
}, [reportType,appliedFromDate, appliedToDate]);

useEffect(() => {
  if (reportType === "detailed") {
    fetchDetailedReport();
  }
}, [reportType, appliedFromDate, appliedToDate]);


const filteredDetailedRows = detailedRows.filter((row: any) => {
  const userNameMatch =
    row.userName?.toLowerCase().includes(filters.userName.toLowerCase()) ?? false;

  const userIdMatch =
    row.userId?.toLowerCase().includes(filters.userId.toLowerCase()) ?? false;

  const categoryMatch = filters.category
    ? row.category === filters.category
    : true;

  const subcategoryMatch = filters.subcategory
    ? row.subcategory === filters.subcategory
    : true;

  return userNameMatch && userIdMatch && categoryMatch && subcategoryMatch;
});

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




    const handlePrint = async () => {
      const logoBase64 = await loadImageAsBase64(logo);

      const body: any[] = [];

      body.push([
        { text: "Sl.No", style: "tableHeader" },
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

      pageMargins: [40, 100, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download("UserwiseReport.pdf");
  };

  const exportToExcel = () => {
    const exportData: any[] = [];

  if (reportType === "summary") {
    filteredData.forEach((row, i) => {
      exportData.push({
        SrNo: i + 1,
        UserName: row.userName,
        UserID: row.userId,
        Category: row.category,
        Subcategory: row.subcategory,
        Numbers: row.numbers,
      });
    });
  } else {
    // detailed
    filteredDetailedRows.forEach((row: any, i: number) => {
      exportData.push({
        SrNo: i + 1,
        UserName: row.userName,
        UserID: row.userId,
        Category: row.category,
        Subcategory: row.subcategory,
        Numbers: row.details.length,
      });

      // add child rows
        row.details.forEach((d: any) => {
          exportData.push({
            SrNo: "",
            UserName: d.Date ? new Date(d.Date).toLocaleString() : "-",
            UserID: `Sequence No: ${d.SequenceNo}`,
            Category: "",
            Subcategory: "",
            Numbers: "",
          });
        });
    });
  }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "Reports.xlsx");
  };

  const categories = Array.from(new Set(data.map((d) => d.category)));
const subcategories = Array.from(
  new Set(
    data
      .filter((d) =>
        filters.category ? d.category === filters.category : true
      )
      .map((d) => d.subcategory)
  )
);


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

        <div className="flex items-center gap-4 mb-4">

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
          onClick={handleGo}
          disabled={!fromDate || !toDate}
          className="bg-green-600 text-white px-4 py-1 rounded-md text-sm disabled:opacity-50"
        >
          Go
        </button>


        {/* Clear Button */}
       <button
  onClick={() => {
    setFromDate("today");
    setToDate("today");
    setAppliedFromDate("today");
    setAppliedToDate("today");
  }}
  className="text-sm text-blue-600 underline"
>
  Clear
</button>


      </div>
      <div className="mb-2 text-sm font-medium text-gray-600">
  {selectedDateText}
  </div>


      {/* Summary Info */}
      <div className="mb-4 text-sm text-gray-600">
        {loading ? (
          "Loading..."
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : (
          <>
    Showing{" "}
    <span className="font-semibold">
      {reportType === "summary"
        ? filteredData.length
        : filteredDetailedRows.length}
    </span>
    {" "}records
  </>

        )}
      </div>

      {/* Table */}
      {/* <div className="overflow-x-auto rounded-lg shadow-md"> */}
      <div className="overflow-auto rounded-lg shadow-md max-h-[700px]">

        <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
          {/* <thead className="bg-green-600 text-white text-center"> */}
          <thead className="bg-green-600 text-white text-center sticky top-0 z-20">

            <tr>
              <th className="px-3 py-2">Sl.No</th>
              <th className="px-3 py-2">User Name</th>
              <th className="px-3 py-2">User ID</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subcategory</th>
              <th className="px-3 py-2">Numbers</th>
            </tr>
            {/* Filters */}
            {/* <tr className="bg-green-50 text-gray-700 text-center"> */}
            <tr className="bg-green-50 text-gray-700 text-center sticky top-10 z-10">

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
                {/* <input
                  type="text"
                  value={filters.numbers}
                  onChange={(e) => handleFilterChange("numbers", e.target.value)}
                  placeholder="Search no."
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                /> */}
              </td>
            </tr>
          </thead>

            <tbody>
        {/* SUMMARY REPORT */}
        {reportType === "summary" && !loading && !error && filteredData.length > 0 && (
          filteredData.map((row, i) => (
            <tr key={row.id} className="border-b text-center">
              <td className="px-3 py-2">{i + 1}</td>
              <td className="px-3 py-2">{row.userName}</td>
              <td className="px-3 py-2">{row.userId}</td>
              <td className="px-3 py-2">{row.category}</td>
              <td className="px-3 py-2">{row.subcategory}</td>
              <td className="px-3 py-2 font-semibold text-green-700">
                {row.numbers}
              </td>
            </tr>
          ))
        )}

        {/* DETAILED REPORT */}
      {reportType === "detailed" && !loading && !error && filteredDetailedRows.length > 0 && (
  filteredDetailedRows.map((row: any, i: number) => (

            <React.Fragment key={i}>
              {/* Parent row */}
              <tr className="border-b text-center font-medium bg-white">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{row.userName}</td>
                <td className="px-3 py-2">{row.userId}</td>
                <td className="px-3 py-2">{row.category}</td>
                <td className="px-3 py-2">{row.subcategory}</td>
                <td className="px-3 py-2 font-semibold text-green-700">
                  {row.details.length}
                </td>
              </tr>

              {/* Child detail rows */}
              {row.details.map((d: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b text-center bg-gray-50 text-gray-600"
                >
                  <td></td>
                  <td colSpan={2} className="px-3 py-2">
                    {d.Date ? new Date(d.Date).toLocaleString() : "-"}
                  </td>
                  <td colSpan={3} className="px-3 py-2">
                    Sequence No: {d.SequenceNo}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))
        )}

        {/* EMPTY / ERROR STATE */}
        {!loading &&
          !error &&
          ((reportType === "summary" && filteredData.length === 0) ||
            (reportType === "detailed" && filteredDetailedRows.length === 0)
) && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500 italic">
                No records found for selected filters
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
