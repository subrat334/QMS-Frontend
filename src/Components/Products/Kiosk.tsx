
// import { useState, useEffect, useRef } from "react";
// import Select, { components } from "react-select";
// import { Maximize2 } from "lucide-react";
// import logo from "../../assets/utkal.png";
// import { useNavigate } from "react-router-dom";

// interface Subcategory {
//   id: number;
//   name: string;
// }

// const allSubcategories: Subcategory[] = [
//   { id: 1, name: "X-RAY" },
//   { id: 2, name: "CT-SCAN" },
//   { id: 3, name: "ULTRASOUND" },
//   { id: 4, name: "MRI" },
//   { id: 5, name: "OPD BILLING" },
//   { id: 6, name: "GASTROENTEROLOGY" },
//   { id: 7, name: "NEUROLOGY" },
//   { id: 8, name: "ONCOLOGY OPD" },
//   { id: 9, name: "CARDIOLOGY" },
//   { id: 10, name: "ORTHOPEDICS" },
//   { id: 11, name: "ENT" },
//   { id: 12, name: "DERMATOLOGY" },
//   { id: 13, name: "PEDIATRICS" },
//   { id: 14, name: "OPHTHALMOLOGY" },
//   { id: 15, name: "GYNECOLOGY" },
//   { id: 16, name: "UROLOGY" },
// ];

// const Kiosk = () => {
//   const navigate = useNavigate();   // <-- ADDED
//   const [selectedSubs, setSelectedSubs] = useState<Subcategory[]>(allSubcategories);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCard, setSelectedCard] = useState<Subcategory | null>(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [cursorIndex, setCursorIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const handleSelectChange = (selectedOptions: any) => {
//     const selectedIds = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
//     const filtered = allSubcategories.filter((sub) => selectedIds.includes(sub.id));
//     setSelectedSubs(filtered);
//   };

//   const selectAll = () => setSelectedSubs(allSubcategories);
//   const unselectAll = () => setSelectedSubs([]);

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       containerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     }
//   };

//   useEffect(() => {
//     const exitHandler = () => {
//       if (!document.fullscreenElement) setIsFullscreen(false);
//     };
//     document.addEventListener("fullscreenchange", exitHandler);
//     return () => document.removeEventListener("fullscreenchange", exitHandler);
//   }, []);

//   const handleCardClick = (sub: Subcategory) => {
//     setSelectedCard(sub);
//     setPhoneNumber("");
//     setCursorIndex(0);
//     setShowModal(true);
//   };

//   const handleNumberClick = (num: string) => {
//     if (phoneNumber.length >= 10) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex) +
//       num +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex + 1);
//   };

//   const handleDelete = () => {
//     if (cursorIndex === 0) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex - 1) +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex - 1);
//   };

//   //  ✅ UPDATED — Now sends user to TokenPage
//   const handleConfirm = () => {
//   const regex = /^[6-9]\d{9}$/;
//   if (!regex.test(phoneNumber)) return;

//   navigate(`/TokenPage/${selectedCard?.id}`, {
//     state: {
//       subcategory: {
//         id: selectedCard?.id,
//         name: selectedCard?.name,
//         description: "",
//       },
//       phone: phoneNumber,
//     },
//   });

//   setPhoneNumber("");
//   setCursorIndex(0);
//   setShowModal(false);
// };


//   const renderPhoneNumber = () => {
//     let result = "";
//     for (let i = 0; i < phoneNumber.length; i++) {
//       if (i === cursorIndex) result += "|";
//       result += phoneNumber[i];
//     }
//     if (cursorIndex === phoneNumber.length) result += "|";
//     return result;
//   };

//   const handleTextClick = (e: any) => {
//     const box = e.currentTarget;
//     const clickX = e.clientX - box.getBoundingClientRect().left;
//     const approxIndex = Math.floor(clickX / (box.clientWidth / 11));
//     setCursorIndex(Math.min(approxIndex, phoneNumber.length));
//   };

//   const subcategoryOptions = allSubcategories.map((sub) => ({
//     value: sub.id,
//     label: sub.name,
//   }));

//   const CheckboxOption = (props: any) => {
//     const { isSelected } = props;

//     return (
//       <components.Option {...props}>
//         <div className="flex items-center gap-2">
//           <input type="checkbox" checked={isSelected} readOnly />
//           <label>{props.label}</label>
//         </div>
//       </components.Option>
//     );
//   };

//   const MenuList = (props: any) => (
//     <components.MenuList {...props}>
//       {/* <div className="px-3 py-2 border-b border-gray-300">
//         <label className="flex items-center gap-2 cursor-pointer mb-1">
//           <input
//             type="checkbox"
//             checked={selectedSubs.length === allSubcategories.length}
//             onChange={selectAll}
//           />
//           <span className="text-green-700 font-semibold text-sm">Select All</span>
//         </label>

//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={selectedSubs.length === 0}
//             onChange={unselectAll}
//           />
//           <span className="text-red-600 font-semibold text-sm">Unselect All</span>
//         </label>
//       </div> */}
//       <div className="px-3 py-2 border-b border-gray-300">
//   <label className="flex items-center gap-2 cursor-pointer">
//     <input
//       type="checkbox"
//       checked={selectedSubs.length === allSubcategories.length}
//       onChange={(e) => {
//         if (e.target.checked) selectAll();
//         else unselectAll();
//       }}
//     />
//     <span className="text-green-700 font-semibold text-sm">Select All</span>
//   </label>
// </div>


//       {props.children}
//     </components.MenuList>
//   );

//   return (
//     <div
//       ref={containerRef}
//       className={`w-full bg-gray-50 flex flex-col items-center justify-start ${isFullscreen ? "fixed inset-0 m-0" : "min-h-screen p-4"}`}
//     >

//       {!isFullscreen && (
//         <div className="flex justify-between items-center w-full max-w-5xl mb-6">
//           <h1 className="text-2xl font-bold text-green-800">Select Subcategories</h1>
//         </div>
//       )}

//       {!isFullscreen && (
//         <div className="w-full max-w-5xl mb-8 flex items-center gap-4">
//           <div className="flex-1">
//             <Select
//               options={subcategoryOptions}
//               value={subcategoryOptions.filter((o) =>
//                 selectedSubs.some((s) => s.id === o.value)
//               )}
//               isMulti
//               closeMenuOnSelect={false}
//               onChange={handleSelectChange}
//               className="w-full"
//               components={{ MenuList, Option: CheckboxOption }}
//               menuPortalTarget={document.body}
//               menuPlacement="auto"
//               menuPosition="fixed"
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   borderRadius: "0.75rem",
//                   borderColor: "#16a34a",
//                   boxShadow: "none",
//                   "&:hover": { borderColor: "#15803d" },
//                 }),
//                 menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//               }}
//             />
//           </div>

//           <button
//             onClick={handleFullscreen}
//             className="bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2
//             hover:bg-green-800 transition-colors duration-200 shadow-md whitespace-nowrap"
//           >
//             <Maximize2 size={18} /> Full Screen
//           </button>
//         </div>
//       )}

//       <div
//         className={`relative w-full h-full border-4 border-green-700 shadow-2xl 
//         bg-linear-to-br from-green-100 via-emerald-200 to-green-300 
//         ${isFullscreen ? "rounded-none" : "rounded-2xl"} 
//         flex flex-col overflow-hidden`}
//       >

//         <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
//           <img src={logo} alt="Hospital Logo" className="w-28 h-28 object-contain" />
//         </div>

//         {/* <div className="flex-1 mt-20 overflow-y-auto px-4 pb-6"> */}
//         <div
//             className={`flex-1 mt-20 px-4 pb-6 ${
//               isFullscreen ? "overflow-hidden" : "overflow-y-auto"
//             }`}
//           >
//           {/* <div className="w-full flex flex-wrap justify-center gap-6"> */}
//           <div
//             className="
//               grid
//               w-full
//               h-full
//               place-items-center
//               gap-5
//               p-5
//             "
//             style={{
//               gridTemplateColumns: "repeat(auto-fit, minmax(clamp(150px, 20vw, 300px), 1fr))",
//             }}
//           >

//             {selectedSubs.map((sub) => (
        
//               <div
//                 key={sub.id}
//                 onClick={() => handleCardClick(sub)}
//                 className="
//                   relative flex flex-col justify-center items-center
//                   bg-linear-to-b from-white via-green-50 to-green-100
//                   text-green-900 border-2 border-green-600 shadow-md rounded-2xl
//                   hover:shadow-xl cursor-pointer transition-all
//                 "
//                 style={{
//                   width: "clamp(150px, 20vw, 300px)",
//                   height: "clamp(150px, 18vh, 220px)",
//                 }}
//               >

//                 <div className="text-lg sm:text-xl font-semibold text-center">
//                   {sub.name}
//                 </div>
//                 <div className="w-12 h-1 bg-green-400 rounded-full my-2"></div>
//                 <p className="text-sm text-gray-700 text-center px-2">
//                   {/* Token management and patient handling for {sub.name}. */}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex-none w-full text-center py-4 bg-green-800 text-white text-lg font-semibold">
//           Thank you for visiting Utkal Hospital
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-3xl shadow-2xl w-[350px] p-6 relative flex flex-col items-center">

//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//               {selectedCard?.name || "Enter Number"}
//             </h2>

//             <div
//               className="w-full bg-gray-100 border text-center text-4xl font-semibold rounded-2xl py-4 mb-6 cursor-text relative"
//               onClick={handleTextClick}
//             >
//               {renderPhoneNumber()}
//             </div>

//             <div className="grid grid-cols-3 w-full rounded-2xl overflow-hidden shadow-xl border border-green-200 bg-linear-to-b from-green-50 to-teal-50">
//               {["1","2","3","4","5","6","7","8","9","←","0","✔"].map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => {
//                     if (num === "←") handleDelete();
//                     else if (num === "✔") handleConfirm();
//                     else handleNumberClick(num);
//                   }}
//                   className={`h-24 text-3xl font-bold flex items-center justify-center
//                     hover:bg-green-100 active:scale-95 active:bg-green-200
//                     ${num === "✔"
//                       ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg"
//                       : num === "←"
//                         ? "bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600"
//                         : "bg-white text-green-700"
//                     }
//                   `}
//                 >
//                   {num === "←" ? "⌫" : num === "✔" ? "OK" : num}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="mt-6 px-6 py-2 rounded-xl bg-red-500 text-white text-lg font-semibold"
//             >
//               Cancel
//             </button>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Kiosk;


// import { useState, useEffect, useRef } from "react";
// // import Select, { components } from "react-select";
// import { Maximize2 } from "lucide-react";
// import logo from "../../assets/utkal.png";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";
// import { toast } from "react-hot-toast";

// interface Subcategory {
//   id: number;
//   name: string;
//   categoryId: number;
//   categoryName: string;
//   counters: any[];
// }

// const Kiosk = () => {
//   const navigate = useNavigate();
//   const { user, privileges } = useAuth();

//   const [selectedSubs, setSelectedSubs] = useState<Subcategory[]>([]);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCard, setSelectedCard] = useState<Subcategory | null>(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [cursorIndex, setCursorIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loadingToken, setLoadingToken] = useState(false);

//   // 🔹 Initialize subcategories from user privileges
//   useEffect(() => {
//   if (privileges?.categories) {
//     const formattedSubs: Subcategory[] = privileges.categories.flatMap((cat: any) =>
//       (cat.SubCategories || []).map((sub: any) => ({
//         id: Number(sub.SubCategoryId),
//         name: sub.SubCategoryName,
//         categoryId: Number(cat.CategoryId),  // ← from parent category
//         categoryName: cat.CategoryName,
//         counters: sub.Counters || [],
//       }))
//     );
//     setSelectedSubs(formattedSubs);
//   }
// }, [privileges]);


//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       containerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     }
//   };

//   const handleCardClick = (sub: Subcategory) => {
//     setSelectedCard(sub);
//     setPhoneNumber("");
//     setCursorIndex(0);
//     setShowModal(true);
//   };

//   const handleNumberClick = (num: string) => {
//     if (phoneNumber.length >= 10) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex) +
//       num +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex + 1);
//   };

//   const handleDelete = () => {
//     if (cursorIndex === 0) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex - 1) +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex - 1);
//   };

//   const renderPhoneNumber = () => {
//     let result = "";
//     for (let i = 0; i < phoneNumber.length; i++) {
//       if (i === cursorIndex) result += "|";
//       result += phoneNumber[i];
//     }
//     if (cursorIndex === phoneNumber.length) result += "|";
//     return result;
//   };

//   const handleTextClick = (e: any) => {
//     const box = e.currentTarget;
//     const clickX = e.clientX - box.getBoundingClientRect().left;
//     const approxIndex = Math.floor(clickX / (box.clientWidth / 11));
//     setCursorIndex(Math.min(approxIndex, phoneNumber.length));
//   };

//   // 🔹 POST token API
//  const handleConfirm = async () => {
  
//   if (!selectedCard) return;
//   const regex = /^[6-9]\d{9}$/;
//   if (!regex.test(phoneNumber)) {
//     toast.error("Enter valid 10-digit mobile number");
//     return;
//   }

//   if (!selectedCard.counters?.length) {
//     toast.error("No counters assigned to this subcategory");
//     return;
//   }

//   setLoadingToken(true);

//   try {
//     const payload = {
//       CategoryId: selectedCard.categoryId,
//       SubCategoryId: selectedCard.id,
//       MobileNumber: phoneNumber,
//       DeliveryMethod: "Counter",
//     };

//     const res = await api.post("/Patient/generateToken", payload);

//     toast.success("Token generated successfully!");

//     // // ⭐ NAVIGATE TO TOKEN PAGE
//     // navigate(`/TokenPage/${selectedCard.id}`, {
//     //   state: {
//     //     subcategory: selectedCard,
//     //     tokenData: res.data,     // optional
//     //     mobile: phoneNumber,     // optional
//     //   },
//     // });
//     navigate(`/TokenPage/${selectedCard.id}`, {
//   state: {
//     subcategory: selectedCard,
//     tokenResponse: res.data,   // ✅ CORRECT
//     mobile: phoneNumber,
//   },
// });


//   } catch (err: any) {
//     console.error(err);
//     toast.error(err?.response?.data?.message || "Failed to generate token");
//   } finally {
//     setLoadingToken(false);
//     setShowModal(false);
//     setPhoneNumber("");
//     setCursorIndex(0);
//   }
// };


//   return (
//     <div
//       ref={containerRef}
//       className={`w-full bg-gray-50 flex flex-col items-center justify-start ${isFullscreen ? "fixed inset-0 m-0" : "min-h-screen p-4"}`}
//     >
//       {!isFullscreen && (
//         <div className="flex justify-between items-center w-full max-w-5xl mb-6">
//           <h1 className="text-2xl font-bold text-green-800">Select Subcategories</h1>
//         </div>
//       )}

//       {!isFullscreen && (
//         <div className="w-full max-w-5xl mb-8 flex items-center gap-4">
//           <button
//             onClick={handleFullscreen}
//             className="bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2
//             hover:bg-green-800 transition-colors duration-200 shadow-md whitespace-nowrap"
//           >
//             <Maximize2 size={18} /> Full Screen
//           </button>
//         </div>
//       )}

//       <div
//         className={`relative w-full h-full border-4 border-green-700 shadow-2xl 
//         bg-linear-to-br from-green-100 via-emerald-200 to-green-300 
//         ${isFullscreen ? "rounded-none" : "rounded-2xl"} 
//         flex flex-col overflow-hidden`}
//       >
//         <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
//           <img src={logo} alt="Hospital Logo" className="w-28 h-28 object-contain" />
//         </div>

//         <div
//           className={`flex-1 mt-20 px-4 pb-6 ${
//             isFullscreen ? "overflow-hidden" : "overflow-y-auto"
//           }`}
//         >
//           <div
//             className="grid w-full h-full place-items-center gap-5 p-5"
//             style={{
//               gridTemplateColumns: "repeat(auto-fit, minmax(clamp(150px, 20vw, 300px), 1fr))",
//             }}
//           >
//             {selectedSubs.map((sub) => (
//               <div
//                 key={sub.id}
//                 onClick={() => handleCardClick(sub)}
//                 className="
//                   relative flex flex-col justify-center items-center
//                   bg-linear-to-b from-white via-green-50 to-green-100
//                   text-green-900 border-2 border-green-600 shadow-md rounded-2xl
//                   hover:shadow-xl cursor-pointer transition-all
//                 "
//                 style={{
//                   width: "clamp(150px, 20vw, 300px)",
//                   height: "clamp(150px, 18vh, 220px)",
//                 }}
//               >
//                 <div className="text-lg sm:text-xl font-semibold text-center">{sub.name}</div>
//                 <div className="w-12 h-1 bg-green-400 rounded-full my-2"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex-none w-full text-center py-4 bg-green-800 text-white text-lg font-semibold">
//           Thank you for visiting Utkal Hospital
//         </div>
//       </div>

//       {/* Modal for mobile number */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-3xl shadow-2xl w-[350px] p-6 relative flex flex-col items-center">

//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//               {selectedCard?.name || "Enter Number"}
//             </h2>

//             <div
//               className="w-full bg-gray-100 border text-center text-4xl font-semibold rounded-2xl py-4 mb-6 cursor-text relative"
//               onClick={handleTextClick}
//             >
//               {renderPhoneNumber()}
//             </div>

//             <div className="grid grid-cols-3 w-full rounded-2xl overflow-hidden shadow-xl border border-green-200 bg-linear-to-b from-green-50 to-teal-50">
//               {["1","2","3","4","5","6","7","8","9","←","0","✔"].map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => {
//                     if (num === "←") handleDelete();
//                     else if (num === "✔") handleConfirm();
//                     else handleNumberClick(num);
//                   }}
//                   className={`h-24 text-3xl font-bold flex items-center justify-center
//                     hover:bg-green-100 active:scale-95 active:bg-green-200
//                     ${num === "✔"
//                       ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg"
//                       : num === "←"
//                         ? "bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600"
//                         : "bg-white text-green-700"
//                     }
//                   `}
//                 >
//                   {num === "←" ? "⌫" : num === "✔" ? "OK" : num}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="mt-6 px-6 py-2 rounded-xl bg-red-500 text-white text-lg font-semibold"
//             >
//               Cancel
//             </button>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Kiosk;



// import { useState, useEffect, useRef } from "react";
// import { Maximize2 } from "lucide-react";
// import logo from "../../assets/utkal.png";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";
// import { toast } from "react-hot-toast";

// interface Subcategory {
//   id: number;
//   name: string;
//   categoryId: number;
//   categoryName: string;
//   counters: any[];
// }

// const Kiosk = () => {
//   const navigate = useNavigate();
//   const { user, privileges } = useAuth();

//   const [selectedSubs, setSelectedSubs] = useState<Subcategory[]>([]);
//   const [visibleSubs, setVisibleSubs] = useState<number[]>([]); // <-- NEW
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCard, setSelectedCard] = useState<Subcategory | null>(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [cursorIndex, setCursorIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loadingToken, setLoadingToken] = useState(false);

//   // Load subcategories
//   useEffect(() => {
//     if (privileges?.categories) {
//       const formattedSubs: Subcategory[] = privileges.categories.flatMap(
//         (cat: any) =>
//           (cat.SubCategories || []).map((sub: any) => ({
//             id: Number(sub.SubCategoryId),
//             name: sub.SubCategoryName,
//             categoryId: Number(cat.CategoryId),
//             categoryName: cat.CategoryName,
//             counters: sub.Counters || [],
//           }))
//       );

//       setSelectedSubs(formattedSubs);
//       setVisibleSubs(formattedSubs.map((s) => s.id)); // <-- ALL selected by default
//     }
//   }, [privileges]);

//   const toggleVisible = (id: number) => {
//     setVisibleSubs((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       containerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     }
//   };

//   const handleCardClick = (sub: Subcategory) => {
//     setSelectedCard(sub);
//     setPhoneNumber("");
//     setCursorIndex(0);
//     setShowModal(true);
//   };

//   const handleNumberClick = (num: string) => {
//     if (phoneNumber.length >= 10) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex) +
//       num +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex + 1);
//   };

//   const handleDelete = () => {
//     if (cursorIndex === 0) return;

//     const newNumber =
//       phoneNumber.slice(0, cursorIndex - 1) +
//       phoneNumber.slice(cursorIndex);

//     setPhoneNumber(newNumber);
//     setCursorIndex(cursorIndex - 1);
//   };

//   const renderPhoneNumber = () => {
//     let result = "";
//     for (let i = 0; i < phoneNumber.length; i++) {
//       if (i === cursorIndex) result += "|";
//       result += phoneNumber[i];
//     }
//     if (cursorIndex === phoneNumber.length) result += "|";
//     return result;
//   };

//   const handleTextClick = (e: any) => {
//     const box = e.currentTarget;
//     const clickX = e.clientX - box.getBoundingClientRect().left;
//     const approxIndex = Math.floor(clickX / (box.clientWidth / 11));
//     setCursorIndex(Math.min(approxIndex, phoneNumber.length));
//   };

//   const handleConfirm = async () => {
//     if (!selectedCard) return;
//     const regex = /^[6-9]\d{9}$/;
//     if (!regex.test(phoneNumber)) {
//       toast.error("Enter valid 10-digit mobile number");
//       return;
//     }

//     if (!selectedCard.counters?.length) {
//       toast.error("No counters assigned to this subcategory");
//       return;
//     }

//     setLoadingToken(true);

//     try {
//       const payload = {
//         CategoryId: selectedCard.categoryId,
//         SubCategoryId: selectedCard.id,
//         MobileNumber: phoneNumber,
//         DeliveryMethod: "Counter",
//       };

//       const res = await api.post("/Patient/generateToken", payload);

//       toast.success("Token generated successfully!");

//       navigate(`/TokenPage/${selectedCard.id}`, {
//         state: {
//           subcategory: selectedCard,
//           tokenResponse: res.data,
//           mobile: phoneNumber,
//         },
//       });
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to generate token");
//     } finally {
//       setLoadingToken(false);
//       setShowModal(false);
//       setPhoneNumber("");
//       setCursorIndex(0);
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className={`w-full bg-gray-50 flex flex-col items-center justify-start ${
//         isFullscreen ? "fixed inset-0 m-0" : "min-h-screen p-4"
//       }`}
//     >
//       {!isFullscreen && (
//         <div className="flex justify-between items-center w-full max-w-5xl mb-6">
//           <h1 className="text-2xl font-bold text-green-800">Select Subcategories</h1>
//         </div>
//       )}

//       {/* ✅ NEW FILTER BOX WITH CHECKBOXES */}
//       {!isFullscreen && (
//         <div className="w-full max-w-5xl bg-white border p-3 rounded-xl shadow mb-4">
//           <h3 className="font-semibold text-green-800 mb-2">Show Subcategories:</h3>

//           <div className="flex flex-wrap gap-4">
//             {selectedSubs.map((sub) => (
//               <label key={sub.id} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={visibleSubs.includes(sub.id)}
//                   onChange={() => toggleVisible(sub.id)}
//                 />
//                 <span>{sub.name}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       <div
//         className={`relative w-full h-full border-4 border-green-700 shadow-2xl 
//         bg-linear-to-br from-green-100 via-emerald-200 to-green-300 
//         ${isFullscreen ? "rounded-none" : "rounded-2xl"} 
//         flex flex-col overflow-hidden`}
//       >
//         <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
//           <img src={logo} alt="Hospital Logo" className="w-28 h-28 object-contain" />
//         </div>

//         <div
//           className={`flex-1 mt-20 px-4 pb-6 ${
//             isFullscreen ? "overflow-hidden" : "overflow-y-auto"
//           }`}
//         >
//           <div
//             className="grid w-full h-full place-items-center gap-5 p-5"
//             style={{
//               gridTemplateColumns:
//                 "repeat(auto-fit, minmax(clamp(150px, 20vw, 300px), 1fr))",
//             }}
//           >
//             {selectedSubs
//               .filter((s) => visibleSubs.includes(s.id)) // <-- ONLY SHOW SELECTED
//               .map((sub) => (
//                 <div
//                   key={sub.id}
//                   onClick={() => handleCardClick(sub)}
//                   className="
//                   relative flex flex-col justify-center items-center
//                   bg-linear-to-b from-white via-green-50 to-green-100
//                   text-green-900 border-2 border-green-600 shadow-md rounded-2xl
//                   hover:shadow-xl cursor-pointer transition-all
//                 "
//                   style={{
//                     width: "clamp(150px, 20vw, 300px)",
//                     height: "clamp(150px, 18vh, 220px)",
//                   }}
//                 >
//                   <div className="text-lg sm:text-xl font-semibold text-center">
//                     {sub.name}
//                   </div>
//                   <div className="w-12 h-1 bg-green-400 rounded-full my-2"></div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className="flex-none w-full text-center py-4 bg-green-800 text-white text-lg font-semibold">
//           Thank you for visiting Utkal Hospital
//         </div>
//       </div>

//       {/* ------ MODAL (unchanged) ------ */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
//           <div className="bg-white rounded-3xl shadow-2xl w-[350px] p-6 relative flex flex-col items-center">
//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
//               {selectedCard?.name || "Enter Number"}
//             </h2>

//             <div
//               className="w-full bg-gray-100 border text-center text-4xl font-semibold rounded-2xl py-4 mb-6 cursor-text relative"
//               onClick={handleTextClick}
//             >
//               {renderPhoneNumber()}
//             </div>

//             <div className="grid grid-cols-3 w-full rounded-2xl overflow-hidden shadow-xl border border-green-200 bg-linear-to-b from-green-50 to-teal-50">
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "←", "0", "✔"].map(
//                 (num) => (
//                   <button
//                     key={num}
//                     onClick={() => {
//                       if (num === "←") handleDelete();
//                       else if (num === "✔") handleConfirm();
//                       else handleNumberClick(num);
//                     }}
//                     className={`h-24 text-3xl font-bold flex items-center justify-center
//                     hover:bg-green-100 active:scale-95 active:bg-green-200
//                     ${
//                       num === "✔"
//                         ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg"
//                         : num === "←"
//                         ? "bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600"
//                         : "bg-white text-green-700"
//                     }
//                   `}
//                   >
//                     {num === "←" ? "⌫" : num === "✔" ? "OK" : num}
//                   </button>
//                 )
//               )}
//             </div>

//             <button
//               onClick={() => {
//                 setPhoneNumber("");
//                 setCursorIndex(0);
//                 setShowModal(false);
//               }}
//               className="mt-6 px-6 py-2 rounded-xl bg-red-500 text-white text-lg font-semibold"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Kiosk;











import { useState, useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";
import logo from "../../assets/utkal.png";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { API } from "../../services/AllApiServices";

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  counters: any[];
}

const Kiosk = () => {
  // const navigate = useNavigate();
  // const { privileges } = useAuth();

  const [selectedSubs, setSelectedSubs] = useState<Subcategory[]>([]);
  const [visibleSubs, setVisibleSubs] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Subcategory | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  // const [ setLoadingToken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [printing, setPrinting] = useState(false);
const [generatedToken, setGeneratedToken] = useState<string | null>(null);
const [, setPrintFailed] = useState(false);

    const getGridColumns = (count: number) => {
    if (count <= 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 9) return 3;
    return 4;
  };

    const visibleSubcategories = selectedSubs.filter((s) =>
      visibleSubs.includes(s.id)
    );

    const columnCount = getGridColumns(visibleSubcategories.length);





  // Listen for exit fullscreen
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Load user subcategories
  // useEffect(() => {
  //   if (privileges?.categories) {
  //     const formattedSubs: Subcategory[] = privileges.categories.flatMap(
  //       (cat: any) =>
  //         (cat.SubCategories || []).map((sub: any) => ({
  //           id: Number(sub.SubCategoryId),
  //           name: sub.SubCategoryName,
  //           categoryId: Number(cat.CategoryId),
  //           categoryName: cat.CategoryName,
  //           counters: sub.Counters || [],
  //         }))
  //     );

  //     setSelectedSubs(formattedSubs);
  //     setVisibleSubs(formattedSubs.map((s) => s.id));
  //   }
  // }, [privileges]);

  useEffect(() => {
  const loadSubcategories = async () => {
    try {
      setLoadingSubs(true);

      const user = JSON.parse(localStorage.getItem("AppUser") || "{}");
      if (!user?.id) {
        setSelectedSubs([]);
        setVisibleSubs([]);
        return;
      }

      // ✅ Call API via your service
      const res = await API.getUserPrivilegesById(user.id);

      const categories = res.data?.Categories || [];

      const formattedSubs: Subcategory[] = categories.flatMap((cat: any) =>
        (cat.SubCategories || []).map((sub: any) => ({
          id: Number(sub.SubCategoryId),
          name: sub.SubCategoryName,
          categoryId: Number(cat.CategoryId),
          categoryName: cat.CategoryName,
          counters: sub.Counters || [],
        }))
      );

      setSelectedSubs(formattedSubs);
      setVisibleSubs(formattedSubs.map((s) => s.id));
    } catch (err) {
      console.error("Failed to load kiosk subcategories:", err);
      toast.error("Failed to load services");
      setSelectedSubs([]);
      setVisibleSubs([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  loadSubcategories();
}, []);


const silentPrint = async (
  subcategory: string,
  token: string,
  datetime: string
) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-KEY": "KIOSK123",
      },
      body: JSON.stringify({ subcategory, token, datetime }),
    });
 
    return await res.json();
  } catch (err) {
    // Printer service not reachable → fallback
    return {
      printed: false,
      token,
      subcategory,
      datetime: new Date().toLocaleString("en-GB", { hour12: false }),
      printer_error: "Service not reachable",
    };
  }
};
 


  // Fullscreen handler
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  // Card click -> open number modal
  const handleCardClick = (sub: Subcategory) => {
    setSelectedCard(sub);
    setPhoneNumber("");
    setCursorIndex(0);
    setShowModal(true);
  };

  // Typing logic
  const handleNumberClick = (num: string) => {
    if (phoneNumber.length >= 10) return;

    const newNumber =
      phoneNumber.slice(0, cursorIndex) +
      num +
      phoneNumber.slice(cursorIndex);

    setPhoneNumber(newNumber);
    setCursorIndex(cursorIndex + 1);
  };

  const handleDelete = () => {
    if (cursorIndex === 0) return;

    const newNumber =
      phoneNumber.slice(0, cursorIndex - 1) +
      phoneNumber.slice(cursorIndex);

    setPhoneNumber(newNumber);
    setCursorIndex(cursorIndex - 1);
  };

  const handleTextClick = (e: any) => {
    const box = e.currentTarget;
    const clickX = e.clientX - box.getBoundingClientRect().left;
    const approxIndex = Math.floor(clickX / (box.clientWidth / 11));
    setCursorIndex(Math.min(approxIndex, phoneNumber.length));
  };

  const renderPhoneNumber = () => {
    let result = "";
    for (let i = 0; i < phoneNumber.length; i++) {
      if (i === cursorIndex) result += "|";
      result += phoneNumber[i];
    }
    if (cursorIndex === phoneNumber.length) result += "|";
    return result;
  };

  // Confirm Token
//   const handleConfirm = async () => {
//     if (!selectedCard) return;

//     const regex = /^[6-9]\d{9}$/;
//     if (!regex.test(phoneNumber)) {
//       toast.error("Enter valid 10-digit mobile number");
//       return;
//     }

//     // if (!selectedCard.counters?.length) {
//     //   toast.error("No counters assigned to this subcategory");
//     //   return;
//     // }

//     // setLoadingToken(true);

//      setPrinting(true);

//     try {
//       const payload = {
//         CategoryId: selectedCard.categoryId,
//         SubCategoryId: selectedCard.id,
//         MobileNumber: phoneNumber,
//         DeliveryMethod: "Counter",
//       };

//      const res = await api.post("/Patient/generateToken", payload);
//     const token = res.data?.Token;
//     const now = new Date().toLocaleString("en-GB", { hour12: false });
 
//     // 2️⃣ Attempt silent print
//     const printResult = await silentPrint(selectedCard.name, token, now);
 
//     if (!printResult.printed) {
//       // Print failed → show token to user
//       setGeneratedToken(token);
//       setPrintFailed(true);
//     } else {
//       // Print succeeded → auto-close modal
//       setShowModal(false);
//       setPhoneNumber("");
//       setCursorIndex(0);
//       setSelectedCard(null);
//       setGeneratedToken(null);
//       setPrintFailed(false);
//     }
//   } catch (err) {
//     // API failure → show toast (staff only), patient sees nothing broken
//     toast.error("Unable to generate token");
//   } finally {
//     setPrinting(false);
//   }
// };
const handleConfirm = async () => {
  if (!selectedCard) return;

  const regex = /^[6-9]\d{9}$/;
  if (!regex.test(phoneNumber)) {
    toast.error("Enter valid 10-digit mobile number");
    return;
  }

  setPrinting(true);

  try {
    const payload = {
      CategoryId: selectedCard.categoryId,
      SubCategoryId: selectedCard.id,
      MobileNumber: phoneNumber,
      DeliveryMethod: "Counter",
    };

    const res = await api.post("/Patient/generateToken", payload);
    const token = res.data?.Token;
    const now = new Date().toLocaleString("en-GB", { hour12: false });

    // Attempt silent print
    const printResult = await silentPrint(selectedCard.name, token, now);

    if (!printResult.printed) {
      // ❌ Print failed → show token
      setGeneratedToken(token);
      setPrintFailed(true);
    } else {
      // ✅ Print success → brief confirmation then close
      setTimeout(() => {
        setShowModal(false);
        setPhoneNumber("");
        setCursorIndex(0);
        setSelectedCard(null);
        setGeneratedToken(null);
        setPrintFailed(false);
      }, 800); // ⏱ small UX delay
    }
  } catch (err) {
    toast.error("Unable to generate token");
  } finally {
    setPrinting(false);
  }
};

 

  return (
    <div
      ref={containerRef}
      className={`w-full bg-gray-50 flex flex-col items-center justify-start ${
        isFullscreen ? "fixed inset-0 m-0" : "min-h-screen p-4"
      }`}
    >
      {/* ------- FILTER BOX + FULLSCREEN BUTTON -------- */}
      {!isFullscreen && (
        <div className="w-full max-w-5xl bg-white border p-3 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-green-800">Show Subcategories:</h3>

            {/* FULLSCREEN BUTTON HERE */}
            <button
              onClick={handleFullscreen}
              className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow transition"
            >
              <Maximize2 size={20} />
            </button>
          </div>

                  <div className="relative">
              {/* Multi-select input */}
              <div
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="min-h-12max-w-xl
                          border border-green-500 rounded-lg
                          px-3 py-2 flex flex-wrap gap-2 items-center
                          cursor-pointer bg-white"
              >
                {visibleSubs.length === 0 && (
                  <span className="text-gray-400">
                    Select subcategories
                  </span>
                )}

                {selectedSubs
                  .filter((s) => visibleSubs.includes(s.id))
                  .map((sub) => (
                    <span
                      key={sub.id}
                      className="flex items-center gap-1
                                bg-green-600 text-white
                                px-3 py-1 rounded-full text-sm"
                      onClick={(e) => e.stopPropagation()} // IMPORTANT
                    >
                      {sub.name}
                      <button
                        onClick={() =>
                          setVisibleSubs((prev) =>
                            prev.filter((id) => id !== sub.id)
                          )
                        }
                        className="ml-1 font-bold hover:text-red-200"
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                <span className="ml-auto text-green-700">▼</span>
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute z-30 mt-1 w-full max-w-xl
                            bg-white border border-green-300
                            rounded-lg shadow-lg max-h-64 overflow-y-auto"
                >
                  {/* Select All */}
                  <label className="flex items-center gap-2 px-4 py-2 border-b font-semibold">
                    <input
                      type="checkbox"
                      checked={
                        selectedSubs.length > 0 &&
                        visibleSubs.length === selectedSubs.length
                      }
                      onChange={(e) =>
                        setVisibleSubs(
                          e.target.checked
                            ? selectedSubs.map((s) => s.id)
                            : []
                        )
                      }
                    />
                    Select All
                  </label>

                  {/* Subcategories */}
            {selectedSubs.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2 px-4 py-2 hover:bg-green-50">
                <input
                  type="checkbox"
                  checked={visibleSubs.includes(sub.id)}
                        onChange={() =>
                          setVisibleSubs((prev) =>
                            prev.includes(sub.id)
                              ? prev.filter((id) => id !== sub.id)
                              : [...prev, sub.id]
                          )
                        }
                      />
                      {sub.name}
              </label>
            ))}
          </div>
              )}
            </div>


        </div>
      )}

      {/* -------- MAIN UI FRAME -------- */}
      <div
        className={`relative w-full h-full border-4 border-green-700 shadow-2xl 
        bg-linear-to-br from-green-100 via-emerald-200 to-green-300 
        ${isFullscreen ? "rounded-none" : "rounded-2xl"} 
        flex flex-col overflow-hidden`}
      >
        {/* Logo + Welcome Message */}
        <div className="flex flex-col items-center mt-6 md:mt-0 ">
                  <img
                    src={logo}
                    alt="Hospital Logo"
                    className="w-[clamp(80px,15vw,200px)] h-auto object-contain"
                  />

                 <div className="mt-4 text-center">
                <div className="font-bold text-green-700 text-[19px]">
                  Welcome to Utkal Hospital, Bhubaneswar
                </div>
                <div className="font-bold text-green-800 mt-1 text-[14px]">
                  (To generate token click on the below button)
                </div>
              </div>

                </div>

        {/* Service Cards */}
        <div
          className={`flex-1 mt-6 px-4 pb-6 ${isFullscreen ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          {loadingSubs && (
            <div className="w-full text-center text-green-700 font-semibold py-6">
              Loading services...
            </div>
          )}

          <div
            className="grid gap-6 place-items-center mx-auto transition-all duration-300"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(260px, 1fr))`,
              maxWidth: columnCount * 320,
            }}
          >
              {visibleSubcategories.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleCardClick(sub)}
                  className="flex flex-col justify-center items-center
                  bg-linear-to-b from-white via-green-50 to-green-100
                  text-green-900 border-2 border-green-600
                  shadow-md rounded-2xl
                  hover:shadow-xl cursor-pointer transition-all
                  active:scale-95"
                  style={{
                    width: "260px",
                    height: "180px",
                  }}
                >
                  <div className="text-lg font-semibold text-center px-3">
                    {sub.name}
                  </div>
                  <div className="w-12 h-1 bg-green-400 rounded-full my-2"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none w-full text-center py-4 bg-green-800 text-white text-lg font-semibold">
          Thank you for visiting Utkal Hospital
        </div>
      </div>

      {/* ------------ MODAL ------------ */}
   {showModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-white rounded-3xl shadow-2xl w-[350px] p-6 relative flex flex-col items-center">
      {/* ---------- LOADER ---------- */}
{printing && (
  <div className="absolute inset-0 bg-white/90 rounded-3xl flex flex-col 
                  justify-center items-center z-50">
    <div className="w-14 h-14 border-4 border-green-300 
                    border-t-green-600 rounded-full animate-spin mb-4" />
    <p className="text-lg font-semibold text-green-700">
      Please wait…
    </p>
    <p className="text-sm text-gray-500 mt-1">
      Token is being generated
    </p>
  </div>
)}

      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        {selectedCard?.name || ""}
      </h2>
 
      {/* ---------- TOKEN DISPLAY ---------- */}
      {generatedToken && (
        <div className="w-full text-center my-4">
          <div className="text-lg font-semibold text-gray-700 mb-2">Token No</div>
          <div className="text-5xl font-extrabold text-green-700 bg-green-50 border-2 border-green-600 rounded-2xl py-6 mb-4">
            {generatedToken}
          </div>
 
          <div className="text-sm text-gray-500">
            {new Date().toLocaleString("en-GB", { hour12: false })}
          </div>
 
          <button
            onClick={() => {
              // Close modal and reset everything
              setShowModal(false);
              setPhoneNumber("");
              setCursorIndex(0);
              setSelectedCard(null);
              setGeneratedToken(null);
              setPrintFailed(false);
            }}
            className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl"
          >
            OK
          </button>
        </div>
      )}
 
      {/* ---------- MOBILE INPUT ---------- */}
      {!generatedToken && (
        <div
          className="w-full bg-gray-100 border text-center text-4xl font-semibold rounded-2xl py-4 mb-6 cursor-text relative"
          onClick={handleTextClick}
        >
          {renderPhoneNumber()}
        </div>
      )}
 
      {/* Number Pad */}
      {!generatedToken && (
        // <div className="grid grid-cols-3 w-full rounded-2xl overflow-hidden shadow-xl border border-green-200 bg-linear-to-b from-green-50 to-teal-50">
        <div className="grid grid-cols-3 gap-px w-full rounded-2xl overflow-hidden shadow-xl 
                bg-green-300 border border-green-300">

          {["1","2","3","4","5","6","7","8","9","←","0","✔"].map((num) => (
            <button
              key={num}
              disabled={printing}
              onClick={() => {
                if (printing) return;
                if (num === "←") handleDelete();
                else if (num === "✔") handleConfirm();
                else handleNumberClick(num);
              }}
              className={`h-24 text-3xl font-bold flex items-center justify-center
                hover:bg-green-100 active:scale-95 active:bg-green-200
                ${num === "✔" ? "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg"
                  : num === "←" ? "bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600"
                  : "bg-white text-green-700"}`}
            >
              {num === "←" ? "⌫" : num === "✔" ? "OK" : num}
            </button>
          ))}
        </div>
      )}
 
      {/* Cancel button */}
      {!generatedToken && (
        <button
          disabled={printing}
          onClick={() => {
            setShowModal(false);
            setPhoneNumber("");
            setCursorIndex(0);
            setSelectedCard(null);
            setGeneratedToken(null);
            setPrintFailed(false);
          }}
          className="mt-4 px-6 py-2 rounded-xl bg-red-500 text-white text-lg font-semibold"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
)}
 
    </div>
  );
};
 

export default Kiosk;
