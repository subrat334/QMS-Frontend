// import { useState } from "react";

// const ManageTokens = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
//   const [selectedStatus, setSelectedStatus] = useState<string>("");
//   const [calledTokens, setCalledTokens] = useState<number[]>([]);
//   const [tokenData, setTokenData] = useState([
//     { id: 1, type: "Normal", category: "General OPD", subcategory: "Consultation", number: "T-101", status: "Running", hold: false },
//     { id: 2, type: "Emergency", category: "Cardiology", subcategory: "Emergency", number: "T-202", status: "Upcoming", hold: false },
//     { id: 3, type: "Follow-up", category: "ENT", subcategory: "Follow-Up", number: "T-303", status: "Done", hold: false },
//     { id: 4, type: "Normal", category: "Orthopedics", subcategory: "Consultation", number: "T-404", status: "Running", hold: false },
//     { id: 5, type: "Priority", category: "Pediatrics", subcategory: "Emergency", number: "T-505", status: "Running", hold: false },
//     { id: 6, type: "Normal", category: "Dermatology", subcategory: "Consultation", number: "T-606", status: "Upcoming", hold: false },
//     { id: 7, type: "Follow-up", category: "Cardiology", subcategory: "Follow-Up", number: "T-707", status: "Upcoming", hold: false},
//     { id: 8, type: "Emergency", category: "General OPD", subcategory: "Emergency", number: "T-808", status: "Running", hold: false },
//     { id: 9, type: "Normal", category: "Dental", subcategory: "Consultation", number: "T-909", status: "Done", hold: false },
//     { id: 10, type: "Normal", category: "Ophthalmology", subcategory: "Checkup", number: "T-1010", status: "Upcoming", hold: false },
//   ]);

//   const categoryData: Record<string, string[]> = {
//     "General OPD": ["Consultation", "Emergency"],
//     "Cardiology": ["Consultation", "Emergency", "Follow-Up"],
//     "ENT": ["Consultation", "Follow-Up", "Procedure"],
//     "Orthopedics": ["Consultation", "Review", "Checkup"],
//     "Dermatology": ["Consultation", "Follow-Up"],
//     "Pediatrics": ["Consultation", "Emergency"],
//     "Dental": ["Consultation", "Procedure"],
//     "Ophthalmology": ["Checkup", "Review"],
//   };

//   const handleCallPatient = (id: number) => {
//     if (!calledTokens.includes(id)) setCalledTokens([...calledTokens, id]);
//   };

//   const handleProcessDone = (id: number) => {
//     setCalledTokens(calledTokens.filter((t) => t !== id));
//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, status: "Done" } : t))
//     );
//   };

//   const handleCancel = (id: number) => {
//     setCalledTokens(calledTokens.filter((t) => t !== id));
//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
//     );
//   };
//   const handleHold = (id: number) => {
//   setTokenData((prev) =>
//     prev.map((t) =>
//       t.id === id ? { ...t, hold: true } : t
//     )
//   );
// };

// const handleRecall = (id: number) => {
//   setTokenData((prev) =>
//     prev.map((t) =>
//       t.id === id ? { ...t, hold: false } : t
//     )
//   );

//   // Optional: You want RE-Call to also call the patient?
//   handleCallPatient(id);
// };


//   // 🔽 Apply filters: Category + Subcategory + Status
//   const filteredTokens = tokenData.filter(
//     (t) =>
//       (!selectedCategory || t.category === selectedCategory) &&
//       (!selectedSubcategory || t.subcategory === selectedSubcategory) &&
//       (!selectedStatus || t.status === selectedStatus)
//   );

//   const statusOptions = ["Running", "Upcoming", "Done", "Cancelled"];

//   const clearFilters = () => {
//     setSelectedCategory("");
//     setSelectedSubcategory("");
//     setSelectedStatus("");
//   };

//   return (
//     <div className="min-h-screen bg--to-br from-green-50 to-green-100 flex flex-col items-center py-10">
//       {/* Token Table with Integrated Filters */}
//       <div className="w-11/12 max-w-6xl animate-fadeIn">
//         <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-green-200 max-h-[600px] overflow-y-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-green-700 text-white text-sm uppercase sticky top-0">
//               <tr>
//                 <th className="px-4 py-3">Sr. No</th>
                
//                 {/* Token Type Column */}
//                 <th className="px-4 py-3">Token Type</th>
                
//                 {/* Main Category Column with Filter */}
//                 <th className="px-4 py-3">
//                   <div className="flex flex-col">
//                     <span className="mb-2">Main Category</span>
//                     <select
//                       className="w-full bg-green-600 border border-green-500 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
//                       value={selectedCategory}
//                       onChange={(e) => {
//                         setSelectedCategory(e.target.value);
//                         setSelectedSubcategory("");
//                       }}
//                     >
//                       <option value="">All Categories</option>
//                       {Object.keys(categoryData).map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </th>
                
//                 {/* Subcategory Column with Filter */}
//                 <th className="px-4 py-3">
//                   <div className="flex flex-col">
//                     <span className="mb-2">Subcategory</span>
//                     <select
//                       className="w-full bg-green-600 border border-green-500 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
//                       value={selectedSubcategory}
//                       onChange={(e) => setSelectedSubcategory(e.target.value)}
//                       disabled={!selectedCategory}
//                     >
//                       <option value="">All Subcategories</option>
//                       {selectedCategory &&
//                         categoryData[selectedCategory].map((sub) => (
//                           <option key={sub} value={sub}>
//                             {sub}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                 </th>
                
//                 {/* Token Number Column */}
//                 <th className="px-4 py-3">Token Number</th>
                
//                 {/* Status Column with Filter */}
//                 <th className="px-4 py-3">
//                   <div className="flex flex-col">
//                     <span className="mb-2">Token Status</span>
//                     <select
//                       className="w-full bg-green-600 border border-green-500 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                     >
//                       <option value="">All Statuses</option>
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </th>
                
//                 {/* Action Column with Clear Filter */}
//                 <th className="px-4 py-3">
//                   <div className="flex flex-col items-center">
//                     <span className="mb-2">Action</span>
//                     <button
//                       onClick={clearFilters}
//                       className="bg-green-800 hover:bg-green-900 text-white text-xs px-2 py-1 rounded transition-colors"
//                     >
//                       Clear Filters
//                     </button>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTokens.map((token, index) => (
//                 <tr
//                   key={token.id}
//                   className={`transition-all hover:bg-green-50 ${
//                     token.status === "Running"
//                       ? "bg-pink-50"
//                       : token.status === "Upcoming"
//                       ? "bg-yellow-50"
//                       : token.status === "Done"
//                       ? "bg-gray-50"
//                       : "bg-red-50"
//                   }`}
//                 >
//                   <td className="px-4 py-3 border-t">{index + 1}</td>
//                   <td className="px-4 py-3 border-t">{token.type}</td>
//                   <td className="px-4 py-3 border-t">{token.category}</td>
//                   <td className="px-4 py-3 border-t">{token.subcategory}</td>
//                   <td className="px-4 py-3 border-t font-semibold">{token.number}</td>
//                   <td className="px-4 py-3 border-t">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         token.status === "Running"
//                           ? "bg-pink-200 text-pink-800"
//                           : token.status === "Upcoming"
//                           ? "bg-yellow-200 text-yellow-800"
//                           : token.status === "Done"
//                           ? "bg-green-200 text-green-800"
//                           : "bg-red-200 text-red-800"
//                       }`}
//                     >
//                       {token.status}
//                     </span>
//                   </td>
//                   {/* <td className="px-4 py-3 border-t">
//                     {!calledTokens.includes(token.id) && token.status !== "Cancelled" ? (
//                       <button
//                         className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition"
//                         onClick={() => handleCallPatient(token.id)}
//                       >
//                         Call Patient
//                       </button>
//                     ) : token.status === "Cancelled" ? (
//                       <span className="text-red-600 font-semibold">Cancelled</span>
//                     ) : (
//                       <div className="flex gap-2">
//                         <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
//                           Hold
//                         </button>
//                         <button
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                           onClick={() => handleCancel(token.id)}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//                           onClick={() => handleProcessDone(token.id)}
//                         >
//                           Process Done
//                         </button>
//                       </div>
//                     )}
//                   </td> */}
//                   <td className="px-4 py-3 border-t">
//   {!calledTokens.includes(token.id) && token.status !== "Cancelled" ? (
//     <button
//       className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition"
//       onClick={() => handleCallPatient(token.id)}
//     >
//       Call Patient
//     </button>
//   ) : token.status === "Cancelled" ? (
//     <span className="text-red-600 font-semibold">Cancelled</span>
//   ) : (
//     <div className="flex gap-2">

//       {/* HOLD OR RE-CALL BUTTON */}
//       {!token.hold ? (
//         <button
//           className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
//           onClick={() => handleHold(token.id)}
//         >
//           Hold
//         </button>
//       ) : (
//         <button
//           className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
//           onClick={() => handleRecall(token.id)}
//         >
//           RE-Call
//         </button>
//       )}

//       <button
//         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//         onClick={() => handleCancel(token.id)}
//       >
//         Cancel
//       </button>

//       <button
//         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//         onClick={() => handleProcessDone(token.id)}
//       >
//         Process Done
//       </button>
//     </div>
//   )}
// </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* No Results Message */}
//           {filteredTokens.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               No tokens found matching the selected filters.
//             </div>
//           )}
//         </div>

//         {/* Summary Section */}
//         <div className="bg-white/90 p-4 rounded-xl shadow-md mt-6 border border-green-200">
//           <h4 className="text-lg font-semibold text-green-700 mb-4">Token Summary</h4>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <div className="bg-pink-100 p-3 rounded-lg text-center">
//               <p className="text-pink-800 font-bold text-2xl">
//                 {tokenData.filter((t) => t.status === "Running").length}
//               </p>
//               <p className="text-pink-600">Running</p>
//             </div>
//             <div className="bg-yellow-100 p-3 rounded-lg text-center">
//               <p className="text-yellow-800 font-bold text-2xl">
//                 {tokenData.filter((t) => t.status === "Upcoming").length}
//               </p>
//               <p className="text-yellow-600">Upcoming</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg text-center">
//               <p className="text-green-800 font-bold text-2xl">
//                 {tokenData.filter((t) => t.status === "Done").length}
//               </p>
//               <p className="text-green-600">Completed</p>
//             </div>
//             <div className="bg-red-100 p-3 rounded-lg text-center">
//               <p className="text-red-800 font-bold text-2xl">
//                 {tokenData.filter((t) => t.status === "Cancelled").length}
//               </p>
//               <p className="text-red-600">Cancelled</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg text-center">
//               <p className="text-blue-800 font-bold text-2xl">{tokenData.length}</p>
//               <p className="text-blue-600">Total</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageTokens;




import { useState } from "react";

const ManageTokens = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedCounter, setSelectedCounter] = useState<string>("");

  const [calledTokens, setCalledTokens] = useState<number[]>([]);
  const [tokenData, setTokenData] = useState([
    { id: 1, type: "Normal", category: "General OPD", subcategory: "Consultation", number: "T-101", status: "Running", hold: false, counter: "Counter 1" },
    { id: 2, type: "Emergency", category: "Cardiology", subcategory: "Emergency", number: "T-202", status: "Upcoming", hold: false, counter: "Counter 2" },
    { id: 3, type: "Follow-up", category: "ENT", subcategory: "Follow-Up", number: "T-303", status: "Done", hold: false, counter: "Counter 3" },
    { id: 4, type: "Normal", category: "Orthopedics", subcategory: "Consultation", number: "T-404", status: "Running", hold: false, counter: "Counter 1" },
    { id: 5, type: "Priority", category: "Pediatrics", subcategory: "Emergency", number: "T-505", status: "Running", hold: false, counter: "Counter 2" },
    { id: 6, type: "Normal", category: "Dermatology", subcategory: "Consultation", number: "T-606", status: "Upcoming", hold: false, counter: "Counter 3" },
    { id: 7, type: "Follow-up", category: "Cardiology", subcategory: "Follow-Up", number: "T-707", status: "Upcoming", hold: false, counter: "Counter 1" },
    { id: 8, type: "Emergency", category: "General OPD", subcategory: "Emergency", number: "T-808", status: "Running", hold: false, counter: "Counter 2" },
    { id: 9, type: "Normal", category: "Dental", subcategory: "Consultation", number: "T-909", status: "Done", hold: false, counter: "Counter 3" },
    { id: 10, type: "Normal", category: "Ophthalmology", subcategory: "Checkup", number: "T-1010", status: "Upcoming", hold: false, counter: "Counter 1" },
  ]);

  const categoryData: Record<string, string[]> = {
    "General OPD": ["Consultation", "Emergency"],
    "Cardiology": ["Consultation", "Emergency", "Follow-Up"],
    "ENT": ["Consultation", "Follow-Up", "Procedure"],
    "Orthopedics": ["Consultation", "Review", "Checkup"],
    "Dermatology": ["Consultation", "Follow-Up"],
    "Pediatrics": ["Consultation", "Emergency"],
    "Dental": ["Consultation", "Procedure"],
    "Ophthalmology": ["Checkup", "Review"],
  };

  // Counter options
  const counterMap: Record<string, string[]> = {
    "General OPD": ["Counter 1", "Counter 2"],
    Cardiology: ["Counter 1", "Counter 2"],
    ENT: ["Counter 1"],
    Orthopedics: ["Counter 1", "Counter 2", "Counter 3"],
    Dermatology: ["Counter 1"],
    Pediatrics: ["Counter 1", "Counter 2"],
    Dental: ["Counter 1"],
    Ophthalmology: ["Counter 1", "Counter 2"],
  };

  const handleCallPatient = (id: number) => {
    if (!calledTokens.includes(id)) setCalledTokens([...calledTokens, id]);
  };

  const handleProcessDone = (id: number) => {
    setCalledTokens(calledTokens.filter((t) => t !== id));
    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Done" } : t))
    );
  };

  const handleCancel = (id: number) => {
    setCalledTokens(calledTokens.filter((t) => t !== id));
    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
    );
  };

  const handleHold = (id: number) => {
    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hold: true } : t))
    );
  };

  const handleRecall = (id: number) => {
    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hold: false } : t))
    );
    handleCallPatient(id);
  };

  // Show table only when all three filters selected
  const canShowTable =
    selectedCategory && selectedSubcategory && selectedCounter;

  const filteredTokens = canShowTable
    ? tokenData.filter(
        (t) =>
          t.category === selectedCategory &&
          t.subcategory === selectedSubcategory &&
          t.counter === selectedCounter
      )
    : [];

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCounter("");
  };

  return (
    <div className="min-h-screen bg--to-br from-green-50 to-green-100 flex flex-col items-center py-10">
      <div className="w-11/12 max-w-6xl animate-fadeIn">

        {/* TOP FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow mb-4 border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Filter Tokens</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Category */}
            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                  setSelectedCounter("");
                }}
              >
                <option value="">Select Category</option>
                {Object.keys(categoryData).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="font-semibold text-gray-700">Subcategory</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedCounter("");
                }}
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {selectedCategory &&
                  categoryData[selectedCategory].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>

            {/* COUNTER */}
            <div>
              <label className="font-semibold text-gray-700">Counter</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedCounter}
                onChange={(e) => setSelectedCounter(e.target.value)}
                disabled={!selectedSubcategory}
              >
                <option value="">Select Counter</option>
                {selectedCategory &&
                  counterMap[selectedCategory].map((counter) => (
                    <option key={counter} value={counter}>
                      {counter}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="bg-green-700 text-white px-4 py-1 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        {canShowTable ? (
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-green-200 max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-700 text-white text-sm uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Sl. No</th>
                  <th className="px-4 py-3">Token Type</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subcategory</th>

                  {/* NEW COUNTER COLUMN */}
                  <th className="px-4 py-3">Counter</th>

                  <th className="px-4 py-3">Token Number</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTokens.map((token, index) => (
                  <tr
                    key={token.id}
                    className="hover:bg-green-50 transition-all"
                  >
                    <td className="px-4 py-3 border-t">{index + 1}</td>
                    <td className="px-4 py-3 border-t">{token.type}</td>
                    <td className="px-4 py-3 border-t">{token.category}</td>
                    <td className="px-4 py-3 border-t">{token.subcategory}</td>

                    {/* SHOW COUNTER */}
                    <td className="px-4 py-3 border-t">{token.counter}</td>

                    <td className="px-4 py-3 border-t">{token.number}</td>
                    <td className="px-4 py-3 border-t">{token.status}</td>

                    <td className="px-4 py-3 border-t">
                      {!calledTokens.includes(token.id) &&
                      token.status !== "Cancelled" ? (
                        <button
                          className="bg-green-700 text-white px-3 py-1 rounded"
                          onClick={() => handleCallPatient(token.id)}
                        >
                          Call
                        </button>
                      ) : token.status === "Cancelled" ? (
                        <span className="text-red-600">Cancelled</span>
                      ) : (
                        <div className="flex gap-2">

                          {!token.hold ? (
                            <button
                              className="bg-yellow-500 text-white px-3 py-1 rounded"
                              onClick={() => handleHold(token.id)}
                            >
                              Hold
                            </button>
                          ) : (
                            <button
                              className="bg-purple-600 text-white px-3 py-1 rounded"
                              onClick={() => handleRecall(token.id)}
                            >
                              RE-Call
                            </button>
                          )}

                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded"
                            onClick={() => handleCancel(token.id)}
                          >
                            Cancel
                          </button>

                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                            onClick={() => handleProcessDone(token.id)}
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-8 text-gray-500">
            Please select Category, Subcategory and Counter to view tokens.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTokens;
