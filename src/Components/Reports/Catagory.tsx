
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { API } from "../../services/AllApiServices";
/* ===================== INTERFACES ===================== */

interface CategoryRow {
  id: number; 
  date: string;
  category: string;
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
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  /* ---------- API CALL ---------- */

  useEffect(() => {
    fetchReport();
  }, [categoryFilter, subcategoryFilter, pageNumber]);

 const fetchReport = async () => {
  try {
    setLoading(true);

    const res = await API.getReportByCategoryAndSubCategory({
      CategoryId: categoryFilter || undefined,
      SubCategoryId: subcategoryFilter || undefined,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

    const apiData = res.data?.data || [];

    setTotalRecords(res.data?.totalRecords || 0);

    const mapped: CategoryRow[] = apiData.map(
      (item: any, index: number) => ({
        id: index + 1,
        date: item.date,
        category: item.category,
        subcategory: item.subcategory,
        tokens: item.tokens,
        completed: item.completed, 
        cancelled: item.cancelled,
        autoClosed: item.autoClosed,
      })
    );

    setData(mapped);
  } catch (error) {
    console.error("Failed to fetch report", error);
  } finally {
    setLoading(false);
  }
};


  /* ---------- DROPDOWNS (derived) ---------- */

  const categories = Array.from(
    new Map(
      data.map((d: any) => [d.categoryId, d.category])
    ).entries()
  );

  const subcategories = Array.from(
    new Map(
      data.map((d: any) => [d.subCategoryId, d.subcategory])
    ).entries()
  );

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

  const handlePrint = () => window.print();

  const exportToExcel = () => {
    const exportData =
      reportType === "summary" ? summaryData : filteredData;

    const worksheet = XLSX.utils.json_to_sheet(exportData);
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
        {categories.map(([id, name]) => (
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
        {subcategories.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
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
            <td className="px-3 py-2">{row.date}</td>
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
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">Page {pageNumber}</span>

        <button
          disabled={pageNumber * pageSize >= totalRecords}
          onClick={() => setPageNumber(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CatagorywiseReport;