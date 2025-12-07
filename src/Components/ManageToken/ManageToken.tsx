
// import { useEffect, useMemo, useState, useRef } from "react";
// import { API } from "../../services/AllApiServices";
// import { useAuth } from "../../context/AuthContext";
// import { TOKEN_STATUS } from "../../constants/AllConstants";

// declare var jQuery: any;



// type RawCategory = {
//   CategoryId: string;
//   CategoryName: string;
//   SubCategories?: {
//     SubCategoryId: string;
//     SubCategoryName: string;
//     Counters?: { CounterId: string; CounterName: string }[];
//   }[];
// };

// type TokenItem = {
//   id: number;
//   type: string;
//   categoryId?: string;
//   category?: string;
//   subcategoryId?: string;
//   subcategory?: string;
//   counterId?: string;
//   counter?: string;
//   number: string;
//   status: string;
//   hold?: boolean;
// };

// const $ = (window as any).jQuery;

// const ManageTokens = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
//   const [selectedCounter, setSelectedCounter] = useState<string>("");
 

//   const [calledTokens, setCalledTokens] = useState<number[]>([]);
//   const [tokenData, setTokenData] = useState<TokenItem[]>([]);
//   const [loadingTokens, setLoadingTokens] = useState(false);
//   const [loadingPrivileges, setLoadingPrivileges] = useState(false);

//   const { user, privileges, ensurePrivilegesForUser } = useAuth();

//   const [categories, setCategories] = useState<RawCategory[]>([]);

//    const counterRef = useRef(selectedCounter);
//   useEffect(() => {
//   counterRef.current = selectedCounter;
// }, [selectedCounter]);
  

//   // -------------------------------
//   // LOAD PRIVILEGES
//   // -------------------------------
//   useEffect(() => {
//     const loadPrivileges = async () => {
//       setLoadingPrivileges(true);

//       if (privileges?.categories?.length) {
//         setCategories(privileges.categories as RawCategory[]);
//       } else if (user) {
//         await ensurePrivilegesForUser(user.id);

//         const stored = localStorage.getItem("UserPrivileges");
//         if (stored) {
//           try {
//             const p = JSON.parse(stored);
//             setCategories(p.categories || []);
//           } catch {
//             setCategories([]);
//           }
//         }
//       }

//       setLoadingPrivileges(false);
//     };

//     loadPrivileges();
//   }, [user, privileges, ensurePrivilegesForUser]);

//   // -------------------------------
//   // FILTERS → SUBCATEGORIES + COUNTERS
//   // -------------------------------
//   const subcategories = useMemo(() => {
//     const cat = categories.find((c) => c.CategoryId === selectedCategory);
//     return cat?.SubCategories || [];
//   }, [categories, selectedCategory]);

//   const counters = useMemo(() => {
//     const sub = subcategories.find((s) => s.SubCategoryId === selectedSubcategory);
//     return sub?.Counters || [];
//   }, [subcategories, selectedSubcategory]);

//   // -------------------------------
//   // FETCH TOKENS (API)
//   // -------------------------------
// const fetchTokens = async () => {
//   if (!selectedCategory || !selectedSubcategory) {
//     setTokenData([]);
//     return;
//   }

//   setLoadingTokens(true);

//   try {
//     const res = await API.getTokensByFilter(
//       selectedCategory,
//       selectedSubcategory,
//       1,
//       50
//     );

//     const tokensFromServer = res.data?.Tokens || [];

//     const mapped: TokenItem[] = tokensFromServer.map((t: any) => ({
//       id: t.Id,
//       number: t.Token,
//       categoryId: String(t.CategoryId),
//       category: t.CategoryName,
//       subcategoryId: String(t.SubCategoryId),
//       subcategory: t.SubCategoryName,
//       counterId: String(t.CounterId),
//       counter: "", // backend does not return counter name
//       status: t.StatusName,
//       hold: false,
//       mobile: t.MobileNumber,
//       createdOn: t.CreatedOn,
//     }));

//     setTokenData(mapped);
//   } catch (err) {
//     console.error("Error fetching tokens:", err);
//     setTokenData([]);
//   } finally {
//     setLoadingTokens(false);
//   }
// };


//   useEffect(() => {
//     fetchTokens();
//   }, [selectedCategory, selectedSubcategory, selectedCounter]);

  

// useEffect(() => {
//   console.log("Connecting to SignalR...");

//   const connection = ($ as any).hubConnection("http://13.202.228.79/backend/signalr");
//   const hub = connection.createHubProxy("notificationHub");

//   // -------------------------------
//   // REGISTER CLIENT CALLBACKS
//   // -------------------------------
//   hub.on("receiveToken", (data: any) => {
//     console.log("🔥 SignalR Data Received:", data);

//     const tokenPayload = Array.isArray(data) ? data[0] : data;
//     if (!tokenPayload) return;

//     const currentCounterId = String(counterRef.current);
//     if (currentCounterId === String(tokenPayload.CounterId)) {
//       const newToken: TokenItem = {
//         id: Date.now(),
//         type: "Regular",
//         number: tokenPayload.Token,
//         categoryId: String(tokenPayload.CategoryId),
//         category: tokenPayload.CategoryName,
//         subcategoryId: String(tokenPayload.SubCategoryId),
//         subcategory: tokenPayload.SubCategoryName,
//         counterId: String(tokenPayload.CounterId),
//         counter: tokenPayload.CounterName,
//         status: "PENDING",
//         hold: false,
//       };

//       setTokenData(prev =>
//         prev.some(t => t.number === newToken.number) ? prev : [...prev, newToken]
//       );
//     }
//   });

//   hub.on("BroadcastCall", (data: any) => {
//     if (!data?.Token) return;
//     console.log("📣 BroadcastCall:", data);

//     setTokenData(prev =>
//       prev.map(t => t.number === data.Token ? { ...t, status: "CALL" } : t)
//     );
//   });

//   hub.on("BroadcastToken", (data: any) => {
//     if (!data?.Token) return;
//     console.log("🔄 BroadcastToken:", data);

//     setTokenData(prev =>
//       prev.map(t =>
//         t.number === data.Token
//           ? {
//               ...t,
//               status: data.StatusName || t.status,
//               hold: data.StatusName === "HOLD"
//                 ? true
//                 : data.StatusName === "CALL"
//                 ? false
//                 : t.hold,
//             }
//           : t
//       )
//     );
//   });

//   // -------------------------------
//   // START CONNECTION
//   // -------------------------------
//   connection.start()
//     .done(() => {
//       console.log("✅ SignalR Connected");

//       if (counterRef.current) {
//         hub.invoke("JoinCounterGroup", Number(counterRef.current));
//         console.log("📌 Joined CounterGroup:", counterRef.current);
//       }

//       if (selectedSubcategory) {
//         hub.invoke("JoinSubCategoryGroup", Number(selectedSubcategory));
//         console.log("📌 Joined SubCategoryGroup:", selectedSubcategory);
//       }
//     })
//     .fail((err: any) => console.error("❌ SignalR Connection Failed:", err));

//   // -------------------------------
//   // CLEANUP
//   // -------------------------------
//   return () => connection.stop();
// }, []);

// // Empty array ensures this runs only once on mount

// //  EMPTY array → runs only once
//   // MUST BE EMPTY


//   // -------------------------------
//   // SEND STATUS UPDATE
//   // -------------------------------




// const sendTokenStatusUpdate = async (
//   token: TokenItem,
//   action: keyof typeof TOKEN_STATUS
// ) => {
//   const payload = {
//     CategoryId: Number(token.categoryId),
//     SubCategoryId: Number(token.subcategoryId),
//     CounterId: Number(token.counterId),
//     Token: token.number,
//     StatusId: TOKEN_STATUS[action],
//     Remarks: "",
//   };

//   await API.updateTokenStatus(payload);
// };

  

//   // -------------------------------
//   // BUTTON HANDLERS
//   // -------------------------------
//   const handleCallPatient = async (id: number) => {
//     const token = tokenData.find(t => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "CALL");

//     if (!calledTokens.includes(id)) {
//       setCalledTokens((prev) => [...prev, id]);
//     }
//   };

//   const handleHold = async (id: number) => {
//     const token = tokenData.find(t => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "HOLD");

//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, hold: true } : t))
//     );
//   };

//   const handleRecall = async (id: number) => {
//     const token = tokenData.find(t => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "RECALL");

//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, hold: false } : t))
//     );

//     handleCallPatient(id);
//   };

//   const handleCancel = async (id: number) => {
//     const token = tokenData.find(t => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "CANCEL");

//     setCalledTokens((prev) => prev.filter((t) => t !== id));
//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
//     );
//   };

//   // const handleProcessDone = async (id: number) => {
//   //   const token = tokenData.find(t => t.id === id);
//   //   if (!token) return;

//   //   await sendTokenStatusUpdate(token, "DONE");

//   //   setCalledTokens((prev) => prev.filter((t) => t !== id));
//   //   setTokenData((prev) =>
//   //     prev.map((t) => (t.id === id ? { ...t, status: "Done" } : t))
//   //   );
//   // };
//     const handleProcessDone = async (id: number) => {
//   const token = tokenData.find((t) => t.id === id);
//   if (!token) return;

//   // Send update to backend
//   await sendTokenStatusUpdate(token, "DONE");

//   // Instant local update so UI reacts immediately
//   setTokenData((prev) => prev.filter((t) => t.id !== id));

//   // Also clean the called list
//   setCalledTokens((prev) => prev.filter((t) => t !== id));
// };


//   const clearFilters = () => {
//     setSelectedCategory("");
//     setSelectedSubcategory("");
//     setSelectedCounter("");
//     setTokenData([]);
//   };

//   const canShowTable = selectedCategory && selectedSubcategory && selectedCounter;

//   // -------------------------------
//   // UI
//   // -------------------------------
//   return (
//     <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex flex-col items-center py-10">
//       <div className="w-11/12 max-w-6xl animate-fadeIn">

//         {/* FILTER BLOCK */}
//         <div className="bg-white p-4 rounded-xl shadow mb-4 border border-green-200">
//           <h3 className="text-lg font-semibold text-green-700 mb-4">
//             Filter Tokens
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* CATEGORY */}
//             <div>
//               <label className="font-semibold text-gray-700">Category</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedCategory}
//                 onChange={(e) => {
//                   setSelectedCategory(e.target.value);
//                   setSelectedSubcategory("");
//                   setSelectedCounter("");
//                 }}
//                 disabled={loadingPrivileges}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.CategoryId} value={cat.CategoryId}>
//                     {cat.CategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* SUBCATEGORY */}
//             <div>
//               <label className="font-semibold text-gray-700">Subcategory</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedSubcategory}
//                 onChange={(e) => {
//                   setSelectedSubcategory(e.target.value);
//                   setSelectedCounter("");
//                 }}
//                 disabled={!selectedCategory}
//               >
//                 <option value="">Select Subcategory</option>
//                 {subcategories.map((s) => (
//                   <option key={s.SubCategoryId} value={s.SubCategoryId}>
//                     {s.SubCategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* COUNTER */}
//             <div>
//               <label className="font-semibold text-gray-700">Counter</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedCounter}
//                 onChange={(e) => setSelectedCounter(e.target.value)}
//                 disabled={!selectedSubcategory}
//               >
//                 <option value="">Select Counter</option>
//                 {counters.map((c) => (
//                   <option key={c.CounterId} value={c.CounterId}>
//                     {c.CounterName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={clearFilters}
//               className="bg-green-700 text-white px-4 py-1 rounded"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         {canShowTable ? (
//           <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-green-200 max-h-[600px] overflow-y-auto">
//             {loadingTokens ? (
//               <div className="p-6 text-center">Loading tokens...</div>
//             ) : (
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-green-700 text-white text-sm uppercase sticky top-0">
//                   <tr>
//                     <th className="px-4 py-3">Sl. No</th>
//                     <th className="px-4 py-3">Token Type</th>
//                     <th className="px-4 py-3">Category</th>
//                     <th className="px-4 py-3">Subcategory</th>
//                     <th className="px-4 py-3">Counter</th>
//                     <th className="px-4 py-3">Token Number</th>
//                     <th className="px-4 py-3">Status</th>
//                     <th className="px-4 py-3">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {tokenData.length === 0 ? (
//                     <tr>
//                       <td colSpan={8} className="p-6 text-center text-gray-500">
//                         No tokens found for selected filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     tokenData.map((token, index) => (
//                       <tr
//                         key={token.id}
//                         className="hover:bg-green-50 transition-all"
//                       >
//                         <td className="px-4 py-3 border-t">{index + 1}</td>
//                         <td className="px-4 py-3 border-t">{token.type}</td>
//                         <td className="px-4 py-3 border-t">{token.category}</td>
//                         <td className="px-4 py-3 border-t">{token.subcategory}</td>
//                         <td className="px-4 py-3 border-t">{token.counter}</td>
//                         <td className="px-4 py-3 border-t">{token.number}</td>
//                         <td className="px-4 py-3 border-t">{token.status}</td>

//                         <td className="px-4 py-3 border-t">
//                           {!calledTokens.includes(token.id) &&
//                           token.status !== "Cancelled" ? (
//                             <button
//                               className="bg-green-700 text-white px-3 py-1 rounded"
//                               onClick={() => handleCallPatient(token.id)}
//                             >
//                               Call
//                             </button>
//                           ) : token.status === "Cancelled" ? (
//                             <span className="text-red-600">Cancelled</span>
//                           ) : (
//                             <div className="flex gap-2">
//                               {!token.hold ? (
//                                 <button
//                                   className="bg-yellow-500 text-white px-3 py-1 rounded"
//                                   onClick={() => handleHold(token.id)}
//                                 >
//                                   Hold
//                                 </button>
//                               ) : (
//                                 <button
//                                   className="bg-purple-600 text-white px-3 py-1 rounded"
//                                   onClick={() => handleRecall(token.id)}
//                                 >
//                                   RE-Call
//                                 </button>
//                               )}

//                               <button
//                                 className="bg-red-600 text-white px-3 py-1 rounded"
//                                 onClick={() => handleCancel(token.id)}
//                               >
//                                 Cancel
//                               </button>

//                               <button
//                                 className="bg-blue-600 text-white px-3 py-1 rounded"
//                                 onClick={() => handleProcessDone(token.id)}
//                               >
//                                 Done
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         ) : (
//           <div className="text-center mt-8 text-gray-500">
//             Please select Category, Subcategory and Counter to view tokens.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageTokens;



// import { useEffect, useMemo, useState, useRef } from "react";
// import { API } from "../../services/AllApiServices";
// import { useAuth } from "../../context/AuthContext";
// import { TOKEN_STATUS } from "../../constants/AllConstants";

// declare var jQuery: any;

// type RawCategory = {
//   CategoryId: string;
//   CategoryName: string;
//   SubCategories?: {
//     SubCategoryId: string;
//     SubCategoryName: string;
//     Counters?: { CounterId: string; CounterName: string }[];
//   }[];
// };

// type TokenItem = {
//   id: number;
//   type: string;
//   categoryId?: string;
//   category?: string;
//   subcategoryId?: string;
//   subcategory?: string;
//   counterId?: string;
//   counter?: string;
//   number: string;
//   status: string;
//   hold?: boolean;
// };

// const $ = (window as any).jQuery;

// const ManageTokens = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
//   const [selectedCounter, setSelectedCounter] = useState<string>("");

//   const [calledTokens, setCalledTokens] = useState<number[]>([]);
//   const [tokenData, setTokenData] = useState<TokenItem[]>([]);
//   const [loadingTokens, setLoadingTokens] = useState(false);
//   const [loadingPrivileges, setLoadingPrivileges] = useState(false);

//   const { user, privileges, ensurePrivilegesForUser } = useAuth();
//   const [categories, setCategories] = useState<RawCategory[]>([]);

//   const counterRef = useRef(selectedCounter);
//   useEffect(() => {
//     counterRef.current = selectedCounter;
//   }, [selectedCounter]);

//   // -------------------------------
//   // LOAD PRIVILEGES
//   // -------------------------------
//   useEffect(() => {
//     const loadPrivileges = async () => {
//       setLoadingPrivileges(true);

//       if (privileges?.categories?.length) {
//         setCategories(privileges.categories as RawCategory[]);
//       } else if (user) {
//         await ensurePrivilegesForUser(user.id);

//         const stored = localStorage.getItem("UserPrivileges");
//         if (stored) {
//           try {
//             const p = JSON.parse(stored);
//             setCategories(p.categories || []);
//           } catch {
//             setCategories([]);
//           }
//         }
//       }

//       setLoadingPrivileges(false);
//     };

//     loadPrivileges();
//   }, [user, privileges, ensurePrivilegesForUser]);

//   // -------------------------------
//   // FILTERS → SUBCATEGORIES + COUNTERS
//   // -------------------------------
//   const subcategories = useMemo(() => {
//     const cat = categories.find((c) => c.CategoryId === selectedCategory);
//     return cat?.SubCategories || [];
//   }, [categories, selectedCategory]);

//   const counters = useMemo(() => {
//     const sub = subcategories.find(
//       (s) => s.SubCategoryId === selectedSubcategory
//     );
//     return sub?.Counters || [];
//   }, [subcategories, selectedSubcategory]);

//   // -------------------------------
//   // FETCH TOKENS (API)
//   // -------------------------------
//   const fetchTokens = async () => {
//     if (!selectedCategory || !selectedSubcategory|| !selectedCounter) {
//       setTokenData([]);
//       return;
//     }

//     setLoadingTokens(true);
//     console.log("CATAGORY:selectedCategory",selectedCounter);

//     try {
//       const res = await API.getTokensByFilter(
//         selectedCategory,
//         selectedSubcategory,
//         selectedCounter,
//         1,
//         50
//       );

//       const tokensFromServer = res.data?.Tokens || [];

//       const mapped: TokenItem[] = tokensFromServer.map((t: any) => ({
//         id: t.Id,
//         number: t.Token,
//         categoryId: String(t.CategoryId),
//         category: t.CategoryName,
//         subcategoryId: String(t.SubCategoryId),
//         subcategory: t.SubCategoryName,
//         counterId: String(t.CounterId),
//         // counter: "", // backend does not return counter name
//         status: t.StatusName,
//         hold: false,
//         mobile: t.MobileNumber,
//         createdOn: t.CreatedOn,
//       }));

//       setTokenData(mapped);
//     } catch (err) {
//       console.error("Error fetching tokens:", err);
//       setTokenData([]);
//     } finally {
//       setLoadingTokens(false);
//     }
//   };

//   useEffect(() => {
//     fetchTokens();
//   }, [selectedCategory, selectedSubcategory, selectedCounter]);

//   // -------------------------------
//   // SIGNALR INTEGRATION
//   // -------------------------------
//   useEffect(() => {
//   console.log("🔄 useEffect Triggered. Values:", {
//     counter: counterRef.current,
//     subCategory: selectedSubcategory
//   });

//   // ❗ Do NOT connect until both values are ready
//   if (!counterRef.current || !selectedSubcategory) {
//     console.log("⏳ Waiting for counter & subcategory…");
//     return;
//   }

//   console.log("🔌 Connecting to SignalR…");

//   const connection = ($ as any).hubConnection(
//     "http://13.202.228.79/backend/signalr",
//     { useDefaultPath: false }
//   );

//   const hub = connection.createHubProxy("notificationHub");

//   // CLIENT CALLBACKS
// hub.on("receiveToken", (data: any) => {
//   const tokenPayload = Array.isArray(data) ? data[0] : data;
//   if (!tokenPayload) return;

//   // ❗ IGNORE refresh messages
//   if (tokenPayload.RefreshDisplay) {
//     console.log("🔄 RefreshDisplay received → ignoring row creation");
//     return;
//   }

//   // ❗ IGNORE if token number not present
//   if (!tokenPayload.Token) {
//     console.log("⚠ receiveToken without Token → ignoring");
//     return;
//   }

//   // FILTER → only if subcategory matches
//   if (String(tokenPayload.SubCategoryId) !== String(selectedSubcategory)) {
//     return;
//   }

//   const newToken: TokenItem = {
//     id: Date.now(),
//     type: "Regular",
//     number: tokenPayload.Token,
//     categoryId: String(tokenPayload.CategoryId),
//     category: tokenPayload.CategoryName,
//     subcategoryId: String(tokenPayload.SubCategoryId),
//     subcategory: tokenPayload.SubCategoryName,
//     counterId: String(tokenPayload.CounterId || ""),
//     counter: tokenPayload.CounterName || "",
//     status: "PENDING",
//     hold: false,
//   };

//   // PREVENT DUPLICATE TOKENS
//   setTokenData((prev) =>
//     prev.some((t) => t.number === newToken.number) ? prev : [...prev, newToken]
//   );
// });



//   // hub.on("receiveToken", (data: any) => {
//   //   console.log("🔥 receiveToken:", data);

//   //   const tokenPayload = Array.isArray(data) ? data[0] : data;
//   //   if (!tokenPayload) return;

//   //   if (String(tokenPayload.CounterId) === String(counterRef.current)) {
//   //     const newToken: TokenItem = {
//   //       id: Date.now(),
//   //       type: "Regular",
//   //       number: tokenPayload.Token,
//   //       categoryId: String(tokenPayload.CategoryId),
//   //       category: tokenPayload.CategoryName,
//   //       subcategoryId: String(tokenPayload.SubCategoryId),
//   //       subcategory: tokenPayload.SubCategoryName,
//   //       counterId: String(selectedCounter),
//   //       counter: tokenPayload.CounterName,
//   //       status: "PENDING",
//   //       hold: false,
//   //     };

//   //     setTokenData((prev) =>
//   //       prev.some((t) => t.number === newToken.number) ? prev : [...prev, newToken]
//   //     );
//   //   }
//   // });

//   hub.on("BroadcastCall", (data: any) => {
//   console.log("📣 BroadcastCall:", data);
//   if (!data?.Token) return;

//   setTokenData((prev) => {
//     let updated = prev.map((t) =>
//       t.number === data.Token
//         ? {
//             ...t,
//             status: "CALL",
//             counterId: String(data.CounterId)
//           }
//         : t
//     );

//     // APPLY FILTER
//     return updated.filter((t) => {
//       if (t.status === "CALL") {
//         return t.counterId === selectedCounter; // show only at YOUR counter
//       }
//       return true; // show others normally
//     });
//   });
// });
// hub.on("BroadcastToken", (data: any) => {
//   console.log("🔄 BroadcastToken:", data);
//   if (!data?.Token) return;

//   setTokenData((prev) => {
//     let updated = prev.map((t) =>
//       t.number === data.Token
//         ? {
//             ...t,
//             status: data.StatusName || t.status,
//             counterId: String(data.CounterId),
//             hold: data.StatusName === "HOLD"
//           }
//         : t
//     );

//     return updated.filter((t) => {
//       if (t.status === "CALL") {
//         return t.counterId === selectedCounter;
//       }
//       return true;
//     });
//   });
// });

//   // START CONNECTION
//   connection
//     .start()
//     .done(() => {
//       console.log("✅ SignalR Connected");

//       console.log("📌 Joining groups:", {
//         counter: counterRef.current,
//         subCategory: selectedSubcategory,
//       });

//       hub.invoke("JoinCounterGroup", Number(counterRef.current));
//       hub.invoke("JoinSubCategoryGroup", Number(selectedSubcategory));
//     })
//     .fail((err: any) => {
//       console.error("❌ SignalR Connection Failed:", err);
//     });

//   // CLEANUP
//   return () => {
//     console.log("🛑 Stopping SignalR connection…");
//     connection.stop();
//   };
// }, [counterRef.current, selectedSubcategory]);


//   // -------------------------------
//   // SEND STATUS UPDATE
//   // -------------------------------
//  const sendTokenStatusUpdate = async (
//   token: TokenItem,
//   action: keyof typeof TOKEN_STATUS
// ) => {
//   console.log("Sending token status for:", token);

//   const payload = {
//     CategoryId: Number(token.categoryId),
//     SubCategoryId: Number(token.subcategoryId),
//     CounterId: selectedCounter, // fallback to 0 if missing
//     Token: token.number,
//     StatusId: TOKEN_STATUS[action],
//     Remarks: "",
//   };

//   console.log("Payload:", payload);

//   try {
//     await API.updateTokenStatus(payload);
//   } catch (err) {
//     console.error("Error updating token status:", err);
//   }
// };


//   // -------------------------------
//   // BUTTON HANDLERS
//   // -------------------------------
//   const handleCallPatient = async (id: number) => {
//     const token = tokenData.find((t) => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "CALL");

//     if (!calledTokens.includes(id)) {
//       setCalledTokens((prev) => [...prev, id]);
//     }
//   };

//   const handleHold = async (id: number) => {
//     const token = tokenData.find((t) => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "HOLD");

//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, hold: true } : t))
//     );
//   };

//   const handleRecall = async (id: number) => {
//     const token = tokenData.find((t) => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "RECALL");

//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, hold: false } : t))
//     );

//     handleCallPatient(id);
//   };

//   const handleCancel = async (id: number) => {
//     const token = tokenData.find((t) => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "CANCEL");

//     setCalledTokens((prev) => prev.filter((t) => t !== id));
//     setTokenData((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
//     );
//   };

//   const handleProcessDone = async (id: number) => {
//     const token = tokenData.find((t) => t.id === id);
//     if (!token) return;

//     await sendTokenStatusUpdate(token, "DONE");

//     setTokenData((prev) => prev.filter((t) => t.id !== id));
//     setCalledTokens((prev) => prev.filter((t) => t !== id));
//   };

//   const clearFilters = () => {
//     setSelectedCategory("");
//     setSelectedSubcategory("");
//     setSelectedCounter("");
//     setTokenData([]);
//   };

//   const canShowTable =
//     selectedCategory && selectedSubcategory && selectedCounter;

//   // -------------------------------
//   // UI
//   // -------------------------------
//   return (
//     <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex flex-col items-center py-10">
//       <div className="w-11/12 max-w-6xl animate-fadeIn">
//         {/* FILTER BLOCK */}
//         <div className="bg-white p-4 rounded-xl shadow mb-4 border border-green-200">
//           <h3 className="text-lg font-semibold text-green-700 mb-4">
//             Filter Tokens
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* CATEGORY */}
//             <div>
//               <label className="font-semibold text-gray-700">Category</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedCategory}
//                 onChange={(e) => {
//                   setSelectedCategory(e.target.value);
//                   setSelectedSubcategory("");
//                   setSelectedCounter("");
//                 }}
//                 disabled={loadingPrivileges}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.CategoryId} value={cat.CategoryId}>
//                     {cat.CategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* SUBCATEGORY */}
//             <div>
//               <label className="font-semibold text-gray-700">Subcategory</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedSubcategory}
//                 onChange={(e) => {
//                   setSelectedSubcategory(e.target.value);
//                   setSelectedCounter("");
//                 }}
//                 disabled={!selectedCategory}
//               >
//                 <option value="">Select Subcategory</option>
//                 {subcategories.map((s) => (
//                   <option key={s.SubCategoryId} value={s.SubCategoryId}>
//                     {s.SubCategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* COUNTER */}
//             <div>
//               <label className="font-semibold text-gray-700">Counter</label>
//               <select
//                 className="w-full border border-green-500 rounded px-2 py-1 mt-1"
//                 value={selectedCounter}
//                 onChange={(e) => setSelectedCounter(e.target.value)}
//                 disabled={!selectedSubcategory}
//               >
//                 <option value="">Select Counter</option>
//                 {counters.map((c) => (
//                   <option key={c.CounterId} value={c.CounterId}>
//                     {c.CounterName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={clearFilters}
//               className="bg-green-700 text-white px-4 py-1 rounded"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         {canShowTable ? (
//           <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-green-200 max-h-[600px] overflow-y-auto">
//             {loadingTokens ? (
//               <div className="p-6 text-center">Loading tokens...</div>
//             ) : (
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-green-700 text-white text-sm uppercase sticky top-0">
//                   <tr>
//                     <th className="px-4 py-3">Sl. No</th>
//                     <th className="px-4 py-3">Token Type</th>
//                     <th className="px-4 py-3">Category</th>
//                     <th className="px-4 py-3">Subcategory</th>
//                     <th className="px-4 py-3">Counter</th>
//                     <th className="px-4 py-3">Token Number</th>
//                     <th className="px-4 py-3">Status</th>
//                     <th className="px-4 py-3">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {tokenData.length === 0 ? (
//                     <tr>
//                       <td colSpan={8} className="p-6 text-center text-gray-500">
//                         No tokens found for selected filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     tokenData.map((token, index) => (
//                       <tr
//                         key={token.id}
//                         className="hover:bg-green-50 transition-all"
//                       >
//                         <td className="px-4 py-3 border-t">{index + 1}</td>
//                         <td className="px-4 py-3 border-t">{token.type}</td>
//                         <td className="px-4 py-3 border-t">{token.category}</td>
//                         <td className="px-4 py-3 border-t">{token.subcategory}</td>
//                         <td className="px-4 py-3 border-t">{token.counter}</td>
//                         <td className="px-4 py-3 border-t">{token.number}</td>
//                         <td className="px-4 py-3 border-t">{token.status}</td>

//                         <td className="px-4 py-3 border-t">
//                           {!calledTokens.includes(token.id) &&
//                           token.status !== "Cancelled" ? (
//                             <button
//                               className="bg-green-700 text-white px-3 py-1 rounded"
//                               onClick={() => handleCallPatient(token.id)}
//                             >
//                               Call
//                             </button>
//                           ) : token.status === "Cancelled" ? (
//                             <span className="text-red-600">Cancelled</span>
//                           ) : (
//                             <div className="flex gap-2">
//                               {!token.hold ? (
//                                 <button
//                                   className="bg-yellow-500 text-white px-3 py-1 rounded"
//                                   onClick={() => handleHold(token.id)}
//                                 >
//                                   Hold
//                                 </button>
//                               ) : (
//                                 <button
//                                   className="bg-purple-600 text-white px-3 py-1 rounded"
//                                   onClick={() => handleRecall(token.id)}
//                                 >
//                                   RE-Call
//                                 </button>
//                               )}

//                               <button
//                                 className="bg-red-600 text-white px-3 py-1 rounded"
//                                 onClick={() => handleCancel(token.id)}
//                               >
//                                 Cancel
//                               </button>

//                               <button
//                                 className="bg-blue-600 text-white px-3 py-1 rounded"
//                                 onClick={() => handleProcessDone(token.id)}
//                               >
//                                 Done
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         ) : (
//           <div className="text-center mt-8 text-gray-500">
//             Please select Category, Subcategory and Counter to view tokens.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageTokens;




import { useEffect, useMemo, useState, useRef } from "react";
import { API } from "../../services/AllApiServices";
import { useAuth } from "../../context/AuthContext";
import { TOKEN_STATUS } from "../../constants/AllConstants";

declare var jQuery: any;

type RawCategory = {
  CategoryId: string;
  CategoryName: string;
  SubCategories?: {
    SubCategoryId: string;
    SubCategoryName: string;
    Counters?: { CounterId: string; CounterName: string }[];
  }[];
};

type TokenItem = {
  id: number;
  type: string;
  categoryId?: string;
  category?: string;
  subcategoryId?: string;
  subcategory?: string;
  counterId?: string;
  counter?: string;
  number: string;
  status: string;
  hold?: boolean;
};

const $ = (window as any).jQuery;

const ManageTokens = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedCounter, setSelectedCounter] = useState<string>("");

  const [calledTokens, setCalledTokens] = useState<number[]>([]);
  const [tokenData, setTokenData] = useState<TokenItem[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false);

  const { user, privileges, ensurePrivilegesForUser } = useAuth();
  const [categories, setCategories] = useState<RawCategory[]>([]);

  const counterRef = useRef(selectedCounter);
  useEffect(() => {
    counterRef.current = selectedCounter;
  }, [selectedCounter]);

  // -------------------------------
  // LOAD PRIVILEGES
  // -------------------------------
  useEffect(() => {
    const loadPrivileges = async () => {
      setLoadingPrivileges(true);

      if (privileges?.categories?.length) {
        setCategories(privileges.categories as RawCategory[]);
      } else if (user) {
        await ensurePrivilegesForUser(user.id);

        const stored = localStorage.getItem("UserPrivileges");
        if (stored) {
          try {
            const p = JSON.parse(stored);
            setCategories(p.categories || []);
          } catch {
            setCategories([]);
          }
        }
      }

      setLoadingPrivileges(false);
    };

    loadPrivileges();
  }, [user, privileges, ensurePrivilegesForUser]);

  // -------------------------------
  // FILTERS → SUBCATEGORIES + COUNTERS
  // -------------------------------
  const subcategories = useMemo(() => {
    const cat = categories.find((c) => c.CategoryId === selectedCategory);
    return cat?.SubCategories || [];
  }, [categories, selectedCategory]);

  const counters = useMemo(() => {
    const sub = subcategories.find(
      (s) => s.SubCategoryId === selectedSubcategory
    );
    return sub?.Counters || [];
  }, [subcategories, selectedSubcategory]);

  // -------------------------------
  // FETCH TOKENS (API)
  // -------------------------------
  const fetchTokens = async () => {
    if (!selectedCategory || !selectedSubcategory || !selectedCounter) {
      setTokenData([]);
      return;
    }

    setLoadingTokens(true);

    try {
      const res = await API.getTokensByFilter(
        selectedCategory,
        selectedSubcategory,
        selectedCounter,
        1,
        50
      );

      const tokensFromServer = res.data?.Tokens || [];

      const mapped: TokenItem[] = tokensFromServer.map((t: any) => ({
        id: t.Id,
        number: t.Token,
        categoryId: String(t.CategoryId),
        category: t.CategoryName,
        subcategoryId: String(t.SubCategoryId),
        subcategory: t.SubCategoryName,
        counterId: String(t.CounterId),
        status: t.StatusName,
        hold: false,
        mobile: t.MobileNumber,
        createdOn: t.CreatedOn,
      }));

      setTokenData(mapped);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setTokenData([]);
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [selectedCategory, selectedSubcategory, selectedCounter]);

  // -------------------------------
  // SIGNALR INTEGRATION
  // -------------------------------
  useEffect(() => {
    if (!counterRef.current || !selectedSubcategory) return;

    const connection = ($ as any).hubConnection(
      "http://13.202.228.79/backend/signalr",
      { useDefaultPath: false }
    );
    const hub = connection.createHubProxy("notificationHub");

    // NEW TOKENS
    hub.on("receiveToken", (data: any) => {
      const tokenPayload = Array.isArray(data) ? data[0] : data;
      if (!tokenPayload || tokenPayload.RefreshDisplay || !tokenPayload.Token)
        return;

      if (String(tokenPayload.SubCategoryId) !== String(selectedSubcategory))
        return;

      const newToken: TokenItem = {
        id: Date.now(),
        type: "Regular",
        number: tokenPayload.Token,
        categoryId: String(tokenPayload.CategoryId),
        category: tokenPayload.CategoryName,
        subcategoryId: String(tokenPayload.SubCategoryId),
        subcategory: tokenPayload.SubCategoryName,
        // counterId: String(tokenPayload.CounterId || ""),
        counter: tokenPayload.CounterName || "",
        status: "PENDING",
        hold: false,
      };

      setTokenData((prev) =>
        prev.some((t) => t.number === newToken.number) ? prev : [...prev, newToken]
      );
    });

    // STATUS UPDATE
    hub.on("receiveTokenStatus", (data: any) => {
      if (!data?.Token) return;

      const tokenStatus = data.A ? data.A[0] : data;
      if (!tokenStatus) return;

      setTokenData((prev) => {
        return prev
          .map((t) => {
            if (t.number === tokenStatus.Token) {
              return {
                ...t,
                status:
                  tokenStatus.StatusId === TOKEN_STATUS.HOLD
                    ? "HOLD"
                    : tokenStatus.StatusId === TOKEN_STATUS.CALL
                    ? "CALL"
                    : tokenStatus.StatusId === TOKEN_STATUS.DONE
                    ? "DONE"
                    : tokenStatus.StatusId === TOKEN_STATUS.CANCEL
                    ? "Cancelled"
                    : t.status,
                counterId: String(tokenStatus.CounterId),
                hold: tokenStatus.StatusId === TOKEN_STATUS.HOLD,
              };
            }
            return t;
          })
          .filter((t) => {
            // ❌ REMOVE token if it is called on another counter
            if (
              t.status === "CALL" &&
              String(t.counterId) !== String(selectedCounter)
            ) {
              return false;
            }
            // ❌ REMOVE completed/done tokens from all other counters
            if (t.status === "DONE") {
              return false;
            }
            return true;
          });
      });
    });

    // START CONNECTION
    connection
      .start()
      .done(() => {
        hub.invoke("JoinCounterGroup", Number(counterRef.current));
        hub.invoke("JoinSubCategoryGroup", Number(selectedSubcategory));
      })
      .fail((err: any) => {
        console.error("SignalR Connection Failed:", err);
      });

    return () => {
      connection.stop();
    };
  }, [selectedSubcategory, selectedCounter]);

  // -------------------------------
  // SEND STATUS UPDATE
  // -------------------------------
  const sendTokenStatusUpdate = async (
    token: TokenItem,
    action: keyof typeof TOKEN_STATUS
  ) => {
    const payload = {
      CategoryId: Number(token.categoryId),
      SubCategoryId: Number(token.subcategoryId),
      CounterId: Number(selectedCounter),
      Token: token.number,
      StatusId: TOKEN_STATUS[action],
      Remarks: "",
    };

    try {
      await API.updateTokenStatus(payload);
    } catch (err) {
      console.error("Error updating token status:", err);
    }
  };

  // -------------------------------
  // BUTTON HANDLERS
  // -------------------------------
  const handleCallPatient = async (id: number) => {
    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "CALL");

    if (!calledTokens.includes(id)) {
      setCalledTokens((prev) => [...prev, id]);
    }
  };

  const handleHold = async (id: number) => {
    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "HOLD");

    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hold: true } : t))
    );
  };

  const handleRecall = async (id: number) => {
    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "RECALL");

    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hold: false } : t))
    );

    handleCallPatient(id);
  };

  const handleCancel = async (id: number) => {
    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "CANCEL");

    setCalledTokens((prev) => prev.filter((t) => t !== id));
    setTokenData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t))
    );
  };

  const handleProcessDone = async (id: number) => {
    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "DONE");

    setTokenData((prev) => prev.filter((t) => t.id !== id));
    setCalledTokens((prev) => prev.filter((t) => t !== id));
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCounter("");
    setTokenData([]);
  };

  const canShowTable =
    selectedCategory && selectedSubcategory && selectedCounter;

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex flex-col items-center py-10">
      <div className="w-11/12 max-w-6xl animate-fadeIn">
        {/* FILTER BLOCK */}
        <div className="bg-white p-4 rounded-xl shadow mb-4 border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Filter Tokens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CATEGORY */}
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
                disabled={loadingPrivileges}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.CategoryId} value={cat.CategoryId}>
                    {cat.CategoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBCATEGORY */}
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
                {subcategories.map((s) => (
                  <option key={s.SubCategoryId} value={s.SubCategoryId}>
                    {s.SubCategoryName}
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
                {counters.map((c) => (
                  <option key={c.CounterId} value={c.CounterId}>
                    {c.CounterName}
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

        {/* TABLE */}
        {canShowTable ? (
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-green-200 max-h-[600px] overflow-y-auto">
            {loadingTokens ? (
              <div className="p-6 text-center">Loading tokens...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-700 text-white text-sm uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Sl. No</th>
                    {/* <th className="px-4 py-3">Token Type</th> */}
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Subcategory</th>
                    {/* <th className="px-4 py-3">Counter</th> */}
                    <th className="px-4 py-3">Token Number</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tokenData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-500">
                        No tokens found for selected filters.
                      </td>
                    </tr>
                  ) : (
                    tokenData.map((token, index) => (
                      <tr
                        key={token.id}
                        className="hover:bg-green-50 transition-all"
                      >
                        <td className="px-4 py-3 border-t">{index + 1}</td>
                        {/* <td className="px-4 py-3 border-t">{token.type}</td> */}
                        <td className="px-4 py-3 border-t">{token.category}</td>
                        <td className="px-4 py-3 border-t">{token.subcategory}</td>
                        {/* <td className="px-4 py-3 border-t">{token.counter}</td> */}
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
                    ))
                  )}
                </tbody>
              </table>
            )}
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
