
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { API } from "../../services/AllApiServices";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import type { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../assets/utkal.png";

(pdfMake as any).vfs = pdfFonts.vfs;

/* ===================== INTERFACES ===================== */


interface CategoryRow {
  id: number;
  date: string;
  categoryId: number;
  category: string;
  subCategoryId: number;
  subcategory: string;
  tokens: number;
  completed: number;
  cancelled: number;
  autoClosed: number;
}


interface SummaryRow {
  category: string;
  tokens: number;
  completed: number;
  cancelled: number;
  autoClosed: number;
}
/* ===================== COMPONENT ===================== */

const CatagorywiseReport = () => {
  /* ---------- STATE ---------- */
  const [data, setData] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<number | "">("");

  const [reportType, setReportType] =
    useState<"summary" | "detailed">("summary");

  const [pageNumber, setPageNumber] = useState(1);
  const [allCategories, setAllCategories] = useState<[number, string][]>([]);
  const [allSubcategories, setAllSubcategories] = useState<
    { subCategoryId: number; subCategory: string; categoryId: number }[]
  >([]);

  useEffect(() => {
    loadMasters();
  }, []);


  const loadMasters = async () => {
    try {
      const res = await API.getReportByCategoryAndSubCategory({
        PageNumber: 1,
        PageSize: 1000,
      });

      const apiData = Array.isArray(res.data) ? res.data : [];

      const catMap = new Map<number, string>();
      const subMap = new Map<number, any>();

      apiData.forEach((d: any) => {
        catMap.set(d.CategoryId, d.Category);

        subMap.set(d.SubCategoryId, {
          subCategoryId: d.SubCategoryId,
          subCategory: d.SubCategory,
          categoryId: d.CategoryId,
        });
      });

      setAllCategories(Array.from(catMap.entries()));
      setAllSubcategories(Array.from(subMap.values()));
    } catch (e) {
      console.error("Failed loading masters", e);
    }
  };



  useEffect(() => {
  setPageNumber(1); // reset page when mode/filter changes
}, [categoryFilter, subcategoryFilter, reportType]);

useEffect(() => {
  if (reportType === "summary") {
    fetchSummaryReport();
  } else {
    fetchDetailedReport();
  }
}, [categoryFilter, subcategoryFilter, pageNumber, reportType]);


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

const handlePrint = async () => {
  const logoBase64 = await loadImageAsBase64(logo);

  const body: any[] = [];

  // ================= HEADER ROW =================
  if (reportType === "summary") {
    body.push([
      { text: "Sr.No", style: "tableHeader" },
      { text: "Category", style: "tableHeader" },
      { text: "Tokens", style: "tableHeader" },
      { text: "Completed", style: "tableHeader" },
      { text: "Cancelled", style: "tableHeader" },
      { text: "Auto Closed", style: "tableHeader" },
    ]);

    summaryData.forEach((row, i) => {
      body.push([
        i + 1,
        row.category,
        row.tokens,
        row.completed,
        row.cancelled,
        row.autoClosed,
      ]);
    });

    // GRAND TOTAL
    body.push([
      { text: "", bold: true },
      { text: "Grand Total", bold: true },
      grandTotal.tokens,
      grandTotal.completed,
      grandTotal.cancelled,
      grandTotal.autoClosed,
    ]);
  } else {
    body.push([
      { text: "Sr.No", style: "tableHeader" },
      { text: "Date", style: "tableHeader" },
      { text: "Category", style: "tableHeader" },
      { text: "Subcategory", style: "tableHeader" },
      { text: "Tokens", style: "tableHeader" },
      { text: "Completed", style: "tableHeader" },
      { text: "Cancelled", style: "tableHeader" },
      { text: "Auto Closed", style: "tableHeader" },
    ]);

    filteredData.forEach((row, i) => {
      body.push([
        i + 1,
        new Date(row.date).toLocaleDateString("en-GB"),
        row.category,
        row.subcategory,
        row.tokens,
        row.completed,
        row.cancelled,
        row.autoClosed,
      ]);
    });

    // GRAND TOTAL
    body.push([
      "",
      "",
      { text: "Grand Total", bold: true },
      "",
      grandTotal.tokens,
      grandTotal.completed,
      grandTotal.cancelled,
      grandTotal.autoClosed,
    ]);
  }

  // ================= PDF DEFINITION =================
  const docDefinition: any = {
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
        text:
          reportType === "summary"
            ? "Category Wise Summary Report:"
            : "Category Wise Detailed Report:",
        style: "header",
        alignment: "left",
        margin: [0, 0, 0, 15],
      },
      {
        table: {
          headerRows: 1,
          widths:
            reportType === "summary"
              ? ["auto", "*", "auto", "auto", "auto", "auto"]
              : ["auto", "*", "*", "*", "auto", "auto", "auto", "auto"],
          body,
        },
      },
    ],

    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fillColor: "#22c55e",
        color: "white",
        alignment: "center",
      },
    },

    pageMargins: [40, 100, 40, 60],
  };

  pdfMake
    .createPdf(docDefinition)
    .download(
      reportType === "summary"
        ? "CategoryWiseSummaryReport.pdf"
        : "CategoryWiseDetailedReport.pdf"
    );
};




const fetchDetailedReport = async () => {
  try {
    setLoading(true);

  const PAGE_SIZE = 50;
  let page = 1;
  let allData: CategoryRow[] = [];
  let totalRowCount = 0;

  do {
    const res = await API.getReportbyCategoryAndSubCategoryDetail({
      CategoryId: categoryFilter || undefined,
      SubCategoryId: subcategoryFilter || undefined,
      PageNumber: page,
      PageSize: PAGE_SIZE,
    });

    const apiData = Array.isArray(res.data) ? res.data : [];
    if (apiData.length === 0) break;

    //  NEW: Read total count from backend
    totalRowCount = apiData[0]?.TotalRowCount ?? 0;

    const mapped: CategoryRow[] = apiData.map(
      (item: any, index: number) => ({
        id: allData.length + index + 1,
        date: item.Date,
        categoryId: item.CategoryId,
        category: item.Category,
        subCategoryId: item.SubCategoryId,
        subcategory: item.SubCategory,
        tokens: Number(item.Numbers ?? 0),
        completed: Number(item.Completed ?? 0),
        cancelled: Number(item.Cancelled ?? 0),
        autoClosed: Number(item.AutoClosed ?? 0),
      })
);


      allData = [...allData, ...mapped];
      page++;

    } while (allData.length < totalRowCount);

    setData(allData);
    // setTotalRecords(totalRowCount);

  } catch (error) {
    console.error("Failed to fetch detailed report", error);
  } finally {
    setLoading(false);
  }
};




const fetchSummaryReport = async () => {
  try {
    setLoading(true);

  const PAGE_SIZE = 50; // Number of rows per API call
  let page = 1;
  let allData: CategoryRow[] = [];
  let totalRowCount = 0;

  do {
    const res = await API.getReportByCategoryAndSubCategory({
      CategoryId: categoryFilter || undefined,
      SubCategoryId: subcategoryFilter || undefined,
      PageNumber: page,
      PageSize: PAGE_SIZE,
    });

      const apiData = Array.isArray(res.data) ? res.data : [];
      if (apiData.length === 0) break;

      //  Read TotalRowCount from backend (same for all rows)
      totalRowCount = apiData[0]?.TotalRowCount ?? apiData.length;

    const mapped: CategoryRow[] = apiData.map(
      (item: any, index: number) => ({
        id: allData.length + index + 1,
        date: "",
        categoryId: item.CategoryId,
        category: item.Category,
        subCategoryId: item.SubCategoryId ?? 0,
        subcategory: item.SubCategory ?? "",
        tokens: Number(item.Numbers ?? 0),
        completed: Number(item.Completed ?? 0),
        cancelled: Number(item.Cancelled ?? 0),
        autoClosed: Number(item.AutoClosed ?? 0),
      })
    );


      allData = [...allData, ...mapped]; // accumulate data
      page++; // next page

    } while (allData.length < totalRowCount); // stop when we have all rows

    setData(allData);
    // setTotalRecords(totalRowCount);

  } catch (error) {
    console.error("Failed to fetch summary report", error);
  } finally {
    setLoading(false);
  }
};


const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  /* ---------- DROPDOWNS (derived) ---------- */

  const subcategories = useMemo(() => {
    if (!categoryFilter) return allSubcategories;

    return allSubcategories.filter(
      s => s.categoryId === categoryFilter
    );
  }, [categoryFilter, allSubcategories]);

  useEffect(() => {
    setSubcategoryFilter("");
  }, [categoryFilter]);



  /* ---------- FILTERED DATA ---------- */

  const filteredData = useMemo(() => data, [data]);

  /* ---------- SUMMARY DATA ---------- */
  const summaryData: SummaryRow[] = useMemo(() => {
    const map: Record<string, SummaryRow> = {};

    filteredData.forEach(row => {
      if (!map[row.category]) {
        map[row.category] = {
          category: row.category,
          tokens: 0,
          completed: 0,
          cancelled: 0,
          autoClosed: 0,
        };
      }

      map[row.category].tokens += row.tokens;
      map[row.category].completed += row.completed;
      map[row.category].cancelled += row.cancelled;
      map[row.category].autoClosed += row.autoClosed;
    });

    return Object.values(map);
  }, [filteredData]);

  /* ---------- TOTALS ---------- */

   const grandTotal = useMemo(() => {
  return filteredData.reduce(
    (acc, row) => {
      acc.tokens += row.tokens;
      acc.completed += row.completed;
      acc.cancelled += row.cancelled;
      acc.autoClosed += row.autoClosed;
      return acc;
    },
    { tokens: 0, completed: 0, cancelled: 0, autoClosed: 0 }
  );
}, [filteredData]);

  /* ---------- ACTIONS ---------- */

  // const handlePrint = () => window.print();

  const exportToExcel = () => {
    let exportData: any[];

    if (reportType === "summary") {
      exportData = summaryData.map((row, index) => ({
        "Sl.No": index + 1,
        Category: row.category,
        Tokens: row.tokens,
        Completed: row.completed,
        Cancelled: row.cancelled,
        AutoClosed: row.autoClosed,
      }));
    } else {
      exportData = filteredData.map((row, index) => ({
        "Sl.No": index + 1,
        Date: row.date ? new Date(row.date) : "",
        Category: row.category,
        Subcategory: row.subcategory,
        Tokens: row.tokens,
        Completed: row.completed,
        Cancelled: row.cancelled,
        AutoClosed: row.autoClosed,
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      cellDates: true,
    });

    // Apply date+time format (Date column = index 1)
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
    for (let R = 1; R <= range.e.r; R++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: 1 });
      const cell = worksheet[cellAddress];
      if (cell && cell.t === "d") {
        cell.z = "dd-mm-yyyy hh:mm AM/PM";
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "Category_Report.xlsx");
  };

  /* ===================== UI ===================== */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        Category Wise Report
      </h1>

      {/* FILTERS */}
      <div className="mb-6 flex flex-wrap justify-between gap-4">
    <div className="flex gap-4">
      <select
        value={categoryFilter}
        onChange={e =>
        setCategoryFilter(
          e.target.value ? Number(e.target.value) : ""
        )
      }
      className="border px-3 py-1 rounded-md text-sm"
      >
        <option value="">All Categories</option>
        {allCategories.map(([id, name]) => (

          <option key={id} value={id}>
          {name}
        </option>
        ))}
      </select>

      <select
        value={subcategoryFilter}
        onChange={e =>
        setSubcategoryFilter(
          e.target.value ? Number(e.target.value) : ""
        )
      }
      className="border px-3 py-1 rounded-md text-sm"
      >
        <option value="">All Subcategories</option>
        {subcategories.map(s => (
          <option key={s.subCategoryId} value={s.subCategoryId}>
            {s.subCategory}
          </option>
        ))}
      </select>
      </div>

      <div className="flex gap-3">
        <select
          value={reportType}
          onChange={e =>
        setReportType(e.target.value as any)
      }
      className="border px-3 py-1 rounded-md text-sm"
        >
          <option value="summary">Summary Report</option>
          <option value="detailed">Detailed Report</option>
        </select>

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
  </div>
        </div>
{/* LOADING */}
{loading && (
  <div className="text-center py-6 text-gray-500">
    Loading report...
        </div>
      )}

      {/* TABLE */}
{!loading && (
<div className="overflow-x-auto bg-white rounded-lg shadow">
  {reportType === "summary" ? (
    <table className="min-w-full text-sm border">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="px-3 py-2">Sr.No</th>
          <th className="px-3 py-2">Category</th>
          <th className="px-3 py-2">Tokens</th>
          <th className="px-3 py-2">Completed</th>
          <th className="px-3 py-2">Cancelled</th>
          <th className="px-3 py-2">Auto Closed</th>
        </tr>
      </thead>

      <tbody>
        {summaryData.map((row, i) => (
          <tr key={row.category} className="border-b hover:bg-gray-100 text-center transition">
            <td className="px-3 py-2">{i + 1}</td>
            <td className="px-3 py-2">{row.category}</td>
            <td className="px-3 py-2 font-semibold text-green-700">{row.tokens}</td>
            <td className="px-3 py-2">{row.completed}</td>
            <td className="px-3 py-2">{row.cancelled}</td>
            <td className="px-3 py-2">{row.autoClosed}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="font-bold text-center bg-gray-100">
          <td />
          <td className="px-3 py-2">Grand Total</td>
          <td className="px-3 py-2">{grandTotal.tokens}</td>
          <td className="px-3 py-2">{grandTotal.completed}</td>
          <td className="px-3 py-2">{grandTotal.cancelled}</td>
          <td className="px-3 py-2">{grandTotal.autoClosed}</td>
        </tr>
      </tfoot>
    </table>
  ) : (
    <table className="min-w-full text-sm border">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="px-3 py-2">Sr.No</th>
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2">Category</th>
          <th className="px-3 py-2">Subcategory</th>
          <th className="px-3 py-2">Tokens</th>
          <th className="px-3 py-2">Completed</th>
          <th className="px-3 py-2">Cancelled</th>
          <th className="px-3 py-2">Auto Closed</th>
        </tr>
      </thead>

      <tbody>
        {filteredData.map((row, i) => (
          <tr key={row.id} className="text-center border-b">
            <td className="px-3 py-2">{i + 1}</td>
            {/* <td className="px-3 py-2">{row.date}</td> */}
            <td>{formatDate(row.date)}</td>

            <td className="px-3 py-2">{row.category}</td>
            <td className="px-3 py-2">{row.subcategory}</td>
            <td className="px-3 py-2 font-semibold text-green-700">{row.tokens}</td>
            <td className="px-3 py-2">{row.completed}</td>
            <td className="px-3 py-2">{row.cancelled}</td>
            <td className="px-3 py-2">{row.autoClosed}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="font-bold text-center bg-gray-100">
          <td />
          <td />
          <td>Grand Total</td>
          <td />
          <td className="px-3 py-2">{grandTotal.tokens}</td>
          <td className="px-3 py-2">{grandTotal.completed}</td>
          <td className="px-3 py-2">{grandTotal.cancelled}</td>
          <td className="px-3 py-2">{grandTotal.autoClosed}</td>
        </tr>
      </tfoot>
    </table>
  )}
</div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-end gap-3 mt-4">
        {/* <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button> */}

        {/* <span className="text-sm">Page {pageNumber}</span> */}

        {/* <button
          disabled={pageNumber * pageSize >= totalRecords}
          onClick={() => setPageNumber(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button> */}
      </div>
    </div>
  );
};

export default CatagorywiseReport;