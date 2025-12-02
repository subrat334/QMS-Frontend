
import { useState } from "react";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";

interface CategoryRow {
  id: number;
  from: string;
  to: string;
  category: string;
  subcategory: string;
  tokens: number;
}

const CatagorywiseReport = () => {
  const [data] = useState<CategoryRow[]>([
    { id: 1, from: "09:00 AM", to: "10:00 AM", category: "OPD", subcategory: "General", tokens: 5 },
    { id: 2, from: "10:00 AM", to: "11:00 AM", category: "Diagnostics", subcategory: "Radiology", tokens: 3 },
    { id: 3, from: "11:00 AM", to: "12:00 PM", category: "OPD", subcategory: "Cardiology", tokens: 4 },
    { id: 4, from: "12:00 PM", to: "01:00 PM", category: "Diagnostics", subcategory: "Lab Test", tokens: 6 },
    { id: 5, from: "01:00 PM", to: "02:00 PM", category: "Emergency", subcategory: "Trauma", tokens: 2 },
    { id: 6, from: "02:00 PM", to: "03:00 PM", category: "OPD", subcategory: "Neurology", tokens: 3 },
    { id: 7, from: "03:00 PM", to: "04:00 PM", category: "Diagnostics", subcategory: "MRI", tokens: 5 },
    { id: 8, from: "04:00 PM", to: "05:00 PM", category: "Emergency", subcategory: "Cardiac", tokens: 4 },
    // Additional data entries
    { id: 9, from: "05:00 PM", to: "06:00 PM", category: "OPD", subcategory: "Pediatrics", tokens: 7 },
    { id: 10, from: "06:00 PM", to: "07:00 PM", category: "Diagnostics", subcategory: "Ultrasound", tokens: 4 },
    { id: 11, from: "07:00 PM", to: "08:00 PM", category: "Emergency", subcategory: "Orthopedic", tokens: 3 },
    { id: 12, from: "08:00 PM", to: "09:00 PM", category: "OPD", subcategory: "Dermatology", tokens: 6 },
    { id: 13, from: "09:00 PM", to: "10:00 PM", category: "Diagnostics", subcategory: "CT Scan", tokens: 2 },
    { id: 14, from: "10:00 PM", to: "11:00 PM", category: "Emergency", subcategory: "Respiratory", tokens: 5 },
    { id: 15, from: "11:00 PM", to: "12:00 AM", category: "OPD", subcategory: "Ophthalmology", tokens: 4 },
    { id: 16, from: "08:00 AM", to: "09:00 AM", category: "Diagnostics", subcategory: "Blood Test", tokens: 8 },
    { id: 17, from: "09:00 AM", to: "10:00 AM", category: "Emergency", subcategory: "General", tokens: 3 },
    { id: 18, from: "10:00 AM", to: "11:00 AM", category: "OPD", subcategory: "ENT", tokens: 5 },
    { id: 19, from: "11:00 AM", to: "12:00 PM", category: "Diagnostics", subcategory: "X-Ray", tokens: 6 },
    { id: 20, from: "12:00 PM", to: "01:00 PM", category: "Emergency", subcategory: "Pediatric", tokens: 2 },
    { id: 21, from: "01:00 PM", to: "02:00 PM", category: "OPD", subcategory: "Gastroenterology", tokens: 4 },
    { id: 22, from: "02:00 PM", to: "03:00 PM", category: "Diagnostics", subcategory: "ECG", tokens: 7 },
    { id: 23, from: "03:00 PM", to: "04:00 PM", category: "Emergency", subcategory: "Neurological", tokens: 3 },
  ]);

  const handlePrint = () => {
    window.print();
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "Reports.xlsx");
  };
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("");

  const categories = Array.from(new Set(data.map(d => d.category)));
  const subcategories = Array.from(new Set(data.map(d => d.subcategory)));

  // Filter logic
  const filteredData = data.filter(d => {
    const categoryMatch = categoryFilter ? d.category === categoryFilter : true;
    const subcategoryMatch = subcategoryFilter ? d.subcategory === subcategoryFilter : true;
    return categoryMatch && subcategoryMatch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
         Category Wise Report
      </h1>

      {/* Filters */}
     <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

  {/* LEFT SIDE: Category + Subcategory */}
  <div className="flex flex-col sm:flex-row gap-4">
    <div>
      <label className="text-sm text-gray-700 font-medium">Category:</label>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="ml-2 border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-sm text-gray-700 font-medium">Subcategory:</label>
      <select
        value={subcategoryFilter}
        onChange={(e) => setSubcategoryFilter(e.target.value)}
        className="ml-2 border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="">All</option>
        {subcategories.map((sub) => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
    </div>
  </div>

  {/* RIGHT SIDE: Buttons */}
  <div className="flex space-x-3">
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


      {/* Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
        <span className="font-semibold">{data.length}</span> records
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200">
          <thead className="bg-green-600 text-white text-center">
            <tr>
              <th className="px-3 py-2">Sr.No</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subcategory</th>
              <th className="px-3 py-2">No. of Tokens</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-100 text-center transition"
              >
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{row.from}</td>
                <td className="px-3 py-2">{row.to}</td>
                <td className="px-3 py-2">{row.category}</td>
                <td className="px-3 py-2">{row.subcategory}</td>
                <td className="px-3 py-2 font-semibold text-green-700">
                  {row.tokens}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500 italic"
                >
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

export default CatagorywiseReport;