
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import "jspdf-autotable";

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

const CatagorywiseReport = () => {
  const [data] = useState<CategoryRow[]>([
    { id: 1, date: "2025-01-01", category: "OPD", subcategory: "General", tokens: 10, completed: 7, cancelled: 2, autoClosed: 1 },
    { id: 2, date: "2025-01-01", category: "OPD", subcategory: "Cardiology", tokens: 8, completed: 6, cancelled: 1, autoClosed: 1 },
    { id: 3, date: "2025-01-01", category: "Diagnostics", subcategory: "Lab", tokens: 6, completed: 5, cancelled: 1, autoClosed: 0 },
    { id: 4, date: "2025-01-01", category: "Emergency", subcategory: "Trauma", tokens: 4, completed: 3, cancelled: 1, autoClosed: 0 },
    { id: 5, date: "2025-01-01", category: "OPD", subcategory: "Orthopedics", tokens: 12, completed: 10, cancelled: 1, autoClosed: 1 },
    { id: 6, date: "2025-01-01", category: "Diagnostics", subcategory: "Radiology", tokens: 9, completed: 8, cancelled: 0, autoClosed: 1 },
    { id: 7, date: "2025-01-02", category: "OPD", subcategory: "General", tokens: 15, completed: 12, cancelled: 2, autoClosed: 1 },
    { id: 8, date: "2025-01-02", category: "OPD", subcategory: "Cardiology", tokens: 10, completed: 8, cancelled: 1, autoClosed: 1 },
    { id: 9, date: "2025-01-02", category: "Emergency", subcategory: "Trauma", tokens: 7, completed: 5, cancelled: 1, autoClosed: 1 },
    { id: 10, date: "2025-01-02", category: "Diagnostics", subcategory: "Lab", tokens: 14, completed: 12, cancelled: 1, autoClosed: 1 },
    { id: 11, date: "2025-01-02", category: "Surgery", subcategory: "General", tokens: 6, completed: 5, cancelled: 0, autoClosed: 1 },
    { id: 12, date: "2025-01-03", category: "OPD", subcategory: "General", tokens: 18, completed: 15, cancelled: 2, autoClosed: 1 },
    { id: 13, date: "2025-01-03", category: "OPD", subcategory: "Dermatology", tokens: 8, completed: 7, cancelled: 0, autoClosed: 1 },
    { id: 14, date: "2025-01-03", category: "Diagnostics", subcategory: "Radiology", tokens: 11, completed: 10, cancelled: 0, autoClosed: 1 },
    { id: 15, date: "2025-01-03", category: "Emergency", subcategory: "Pediatrics", tokens: 5, completed: 4, cancelled: 1, autoClosed: 0 },
    { id: 16, date: "2025-01-03", category: "Surgery", subcategory: "Orthopedics", tokens: 9, completed: 8, cancelled: 0, autoClosed: 1 },
    { id: 17, date: "2025-01-04", category: "OPD", subcategory: "General", tokens: 22, completed: 18, cancelled: 3, autoClosed: 1 },
    { id: 18, date: "2025-01-04", category: "OPD", subcategory: "Neurology", tokens: 7, completed: 6, cancelled: 0, autoClosed: 1 },
    { id: 19, date: "2025-01-04", category: "Diagnostics", subcategory: "Lab", tokens: 16, completed: 14, cancelled: 1, autoClosed: 1 },
    { id: 20, date: "2025-01-04", category: "Emergency", subcategory: "Trauma", tokens: 9, completed: 7, cancelled: 1, autoClosed: 1 },
    { id: 21, date: "2025-01-05", category: "OPD", subcategory: "General", tokens: 20, completed: 17, cancelled: 2, autoClosed: 1 },
    { id: 22, date: "2025-01-05", category: "OPD", subcategory: "ENT", tokens: 11, completed: 9, cancelled: 1, autoClosed: 1 },
    { id: 23, date: "2025-01-05", category: "Diagnostics", subcategory: "Cardiology", tokens: 13, completed: 12, cancelled: 0, autoClosed: 1 },
    { id: 24, date: "2025-01-05", category: "Surgery", subcategory: "General", tokens: 8, completed: 7, cancelled: 0, autoClosed: 1 },
    { id: 25, date: "2025-01-06", category: "OPD", subcategory: "General", tokens: 25, completed: 21, cancelled: 3, autoClosed: 1 },
    { id: 26, date: "2025-01-06", category: "OPD", subcategory: "Gastroenterology", tokens: 9, completed: 8, cancelled: 0, autoClosed: 1 },
    { id: 27, date: "2025-01-06", category: "Diagnostics", subcategory: "Lab", tokens: 18, completed: 16, cancelled: 1, autoClosed: 1 },
    { id: 28, date: "2025-01-06", category: "Emergency", subcategory: "Trauma", tokens: 12, completed: 10, cancelled: 1, autoClosed: 1 },
    { id: 29, date: "2025-01-07", category: "OPD", subcategory: "General", tokens: 19, completed: 16, cancelled: 2, autoClosed: 1 },
    { id: 30, date: "2025-01-07", category: "Surgery", subcategory: "Cardiac", tokens: 5, completed: 4, cancelled: 0, autoClosed: 1 },
  ]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [reportType, setReportType] = useState<"summary" | "detailed">("summary");

  const categories = Array.from(new Set(data.map(d => d.category)));
  const subcategories = Array.from(new Set(data.map(d => d.subcategory)));

  /* -------------------- FILTERED DATA -------------------- */
  const filteredData = useMemo(() => {
    return data.filter(d => {
      const categoryMatch = categoryFilter ? d.category === categoryFilter : true;
      const subcategoryMatch = subcategoryFilter ? d.subcategory === subcategoryFilter : true;
      return categoryMatch && subcategoryMatch;
    });
  }, [data, categoryFilter, subcategoryFilter]);

  /* -------------------- SUMMARY DATA -------------------- */
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

  /* -------------------- ACTIONS -------------------- */
  const handlePrint = () => window.print();

  const exportToExcel = () => {
    const exportData = reportType === "summary" ? summaryData : filteredData;
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "Category_Report.xlsx");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        Category Wise Report
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap justify-between gap-4">
      <div className="flex gap-4">
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="">All Categories</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={subcategoryFilter}
        onChange={e => setSubcategoryFilter(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="">All Subcategories</option>
        {subcategories.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      </div>

      <div className="flex gap-3">
        <select
          value={reportType}
          onChange={e => setReportType(e.target.value as "summary" | "detailed")}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        {reportType === "summary" ? (
          <table className="min-w-full text-sm text-gray-700 border border-gray-200">
            <thead className="bg-green-600 text-white text-center">
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
          </table>
        ) : (
          <table className="min-w-full text-sm text-gray-700 border border-gray-200">
          <thead className="bg-green-600 text-white text-center">
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
              <tr key={row.id} className="border-b hover:bg-gray-100 text-center transition">
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
          </table>
        )}
      </div>
    </div>
  );
};

export default CatagorywiseReport;