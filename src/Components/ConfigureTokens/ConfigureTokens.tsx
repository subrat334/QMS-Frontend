
// import { useState, useEffect } from "react";
// import { API } from "../../services/AllApiServices";
// import { CONSECUTIVE_BASIS } from "../../constants/AllConstants";
// import type { ConsecutiveBasisType } from "../../constants/AllConstants"; // ✅ type-only


// // ---------- Types ----------
// interface CategoryType {
//   id: number;
//   categoryname: string;
// }

// interface SubcategoryType {
//   id: number;
//   name: string;
// }

// interface TokenConfig {
//   prefix: string;
//   suffix: string;
//   initializeNumber: number;
//   consecutiveBasis: ConsecutiveBasisType; // string type now
// }

// const ConfigureTokens = () => {
//   const [categories, setCategories] = useState<CategoryType[]>([]);
//   const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);

//   const [selectedCategory, setSelectedCategory] = useState<number | "">("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<number | "">("");

//   const [config, setConfig] = useState<TokenConfig>({
//     prefix: "",
//     suffix: "",
//     initializeNumber: 1,
//     consecutiveBasis: CONSECUTIVE_BASIS.DAILY,
//   });

//   // ---------- Load All Categories ----------
//   useEffect(() => {
//     API.getAllCategories()
//       .then((res) => {
//         const mapped = (res.data || []).map((c: any) => ({
//           id: c.CategoryId,
//           categoryname: c.Categoryname,
//         }));
//         setCategories(mapped);
//       })
//       .catch(() => setCategories([]));
//   }, []);

//   // ---------- On Category Change → Load Subcategories ----------
//   const handleCategoryChange = async (id: number | "") => {
//     setSelectedCategory(id);
//     setSelectedSubcategory("");
//     setSubcategories([]);

//     if (!id) return;

//     try {
//       const res = await API.getSubCategoriesByCategoryId(Number(id));
//       const mapped = (res.data || []).map((s: any) => ({
//         id: s.SubCategoryId,
//         name: s.SubCategoryname,
//       }));
//       setSubcategories(mapped);
//     } catch {
//       setSubcategories([]);
//     }
//   };

//   // ---------- Save Final Settings ----------
//   const handleSave = async () => {
//     if (!selectedCategory || !selectedSubcategory) {
//       alert("❌ Please select both category and subcategory.");
//       return;
//     }

//     const payload = {
//       Id: 0, // 0 or null for new entry
//       CategoryId: selectedCategory,
//       SubCategoryId: selectedSubcategory,
//       Prefix: config.prefix,
//       InitializeNo: config.initializeNumber,
//       CurrentNo: config.initializeNumber, // same as initialize
//       ResetType: config.consecutiveBasis, // string directly
//       LastResetDate: new Date().toISOString(),
//     };

//     try {
//       const res = await API.saveTokenConfig(payload);
//       console.log("API Response:", res.data);
//       alert("✅ Token configuration saved successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to save configuration!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-100 to-green-200 p-8">
//       <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200 p-10 transition-all duration-300 hover:shadow-green-200/70">
//         <h2 className="text-3xl font-bold text-green-700 mb-8 text-center tracking-tight">
//           Configure Token Settings
//         </h2>

//         {/* Category + Subcategory Selection */}
//         <div className="flex flex-col md:flex-row items-center gap-4 bg-linear-to-r from-emerald-500 to-green-600 p-5 rounded-2xl shadow-md mb-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
//           <div className="flex flex-col w-full md:w-1/2">
//             <label className="text-green-50 text-sm mb-2 font-medium">Select Category</label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => handleCategoryChange(Number(e.target.value))}
//               className="block p-3 rounded-lg bg-emerald-700/80 text-green-50 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
//             >
//               <option value="">-- Choose Category --</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.categoryname}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex flex-col w-full md:w-1/2">
//             <label className="text-green-50 text-sm mb-2 font-medium">Select Subcategory</label>
//             <select
//               value={selectedSubcategory}
//               onChange={(e) => setSelectedSubcategory(Number(e.target.value))}
//               disabled={!selectedCategory}
//               className="block p-3 rounded-lg bg-emerald-700/80 text-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all disabled:opacity-60"
//             >
//               <option value="">-- Choose Subcategory --</option>
//               {subcategories.map((sub) => (
//                 <option key={sub.id} value={sub.id}>
//                   {sub.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Token Configuration Form */}
//         {selectedSubcategory ? (
//           <div className="p-8 bg-linear-to-br from-white via-green-50 to-emerald-100 border border-green-300 rounded-2xl shadow-inner hover:shadow-green-200/50 transition-all duration-300">
//             <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-2">
//               Token Configuration
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               {/* Prefix */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-green-800 mb-1">Prefix</label>
//                 <input
//                   type="text"
//                   value={config.prefix}
//                   onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
//                   className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
//                 />
//               </div>

//               {/* Suffix */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-green-800 mb-1">Suffix</label>
//                 <input
//                   type="text"
//                   value={config.suffix}
//                   onChange={(e) => setConfig({ ...config, suffix: e.target.value })}
//                   className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
//                 />
//               </div>

//               {/* Initialize Number */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-green-800 mb-1">Initialize Number</label>
//                 <input
//                   type="number"
//                   min={1}
//                   value={config.initializeNumber}
//                   onChange={(e) =>
//                     setConfig({ ...config, initializeNumber: Number(e.target.value) })
//                   }
//                   className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
//                 />
//               </div>

//               {/* Consecutive Basis */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-green-800 mb-1">Consecutive Basis</label>
//                 <select
//                   value={config.consecutiveBasis}
//                   onChange={(e) =>
//                     setConfig({ ...config, consecutiveBasis: e.target.value as ConsecutiveBasisType })
//                   }
//                   className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
//                 >
//                   <option value={CONSECUTIVE_BASIS.DAILY}>Daily</option>
//                   <option value={CONSECUTIVE_BASIS.WEEKLY}>Weekly</option>
//                   <option value={CONSECUTIVE_BASIS.MONTHLY}>Monthly</option>
//                   <option value={CONSECUTIVE_BASIS.QUARTERLY}>Quarterly</option>
//                 </select>
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex justify-end mt-8">
//               <button
//                 onClick={handleSave}
//                 className="bg-linear-to-r from-emerald-600 to-green-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.05] transition-all font-medium"
//               >
//                 Save Configuration
//               </button>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-green-800 mt-8 italic text-sm">
//             Please select a category and subcategory to configure tokens.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConfigureTokens;



import { useState, useEffect } from "react";
import { API } from "../../services/AllApiServices";
import { CONSECUTIVE_BASIS } from "../../constants/AllConstants";
import type { ConsecutiveBasisType } from "../../constants/AllConstants";

// ---------- Types ----------
interface CategoryType {
  id: number;
  categoryname: string;
}

interface SubcategoryType {
  id: number;
  name: string;
}

interface TokenConfig {
  prefix: string;
  // suffix: string;
  initializeNumber: string;
  consecutiveBasis: ConsecutiveBasisType;
}

const ConfigureTokens = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | "">("");

  const [config, setConfig] = useState<TokenConfig>({
    prefix: "",
    // suffix: "",
    initializeNumber: "1",
    consecutiveBasis: CONSECUTIVE_BASIS.DAILY,
  });

  // ---------- Load All Categories ----------
  useEffect(() => {
    API.getAllCategories()
      .then((res) => {
        const mapped = (res.data || []).map((c: any) => ({
          id: c.CategoryId,
          categoryname: c.Categoryname,
        }));
        setCategories(mapped);
      })
      .catch(() => setCategories([]));
  }, []);

  // ---------- On Category Change ----------
  const handleCategoryChange = async (id: number | "") => {
    setSelectedCategory(id);
    setSelectedSubcategory("");
    setSubcategories([]);

    if (!id) return;

    try {
      const res = await API.getSubCategoriesByCategoryId(Number(id));
      const mapped = (res.data || []).map((s: any) => ({
        id: s.SubCategoryId,
        name: s.SubCategoryname,
      }));
      setSubcategories(mapped);
    } catch {
      setSubcategories([]);
    }
  };

  // ---------- Save Final Settings ----------
  const handleSave = async () => {
    if (!selectedCategory || !selectedSubcategory) {
      alert("❌ Please select both category and subcategory.");
      return;
    }

    const payload = {
      // Id: 0,
      CategoryId: selectedCategory,
      SubCategoryId: selectedSubcategory,
      Prefix: config.prefix,
      InitializeNo: config.initializeNumber,
      // CurrentNo: config.initializeNumber,
      ResetTypeId: config.consecutiveBasis,
      // LastResetDate: new Date().toISOString(),
    };

    try {
      const res = await API.saveTokenConfig(payload);
      console.log("API Response:", res.data);
      alert("✅ Token configuration saved successfully!");

      // 🔥 RESET ALL FIELDS AFTER SAVE
      setConfig({
        prefix: "",
        // suffix: "",
        initializeNumber: "1",
        consecutiveBasis: CONSECUTIVE_BASIS.DAILY,
      });

      setSelectedCategory("");
      setSelectedSubcategory("");
      setSubcategories([]);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to save configuration!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-100 to-green-200 p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200 p-10 transition-all duration-300 hover:shadow-green-200/70">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center tracking-tight">
          Configure Token Settings
        </h2>

        {/* Category + Subcategory Selection */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-linear-to-r from-emerald-500 to-green-600 p-5 rounded-2xl shadow-md mb-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-green-50 text-sm mb-2 font-medium">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(Number(e.target.value))}
              className="block p-3 rounded-lg bg-emerald-700/80 text-green-50 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryname}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label className="text-green-50 text-sm mb-2 font-medium">Select Subcategory</label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(Number(e.target.value))}
              disabled={!selectedCategory}
              className="block p-3 rounded-lg bg-emerald-700/80 text-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all disabled:opacity-60"
            >
              <option value="">-- Choose Subcategory --</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Token Configuration Form */}
        {selectedSubcategory ? (
          <div className="p-8 bg-linear-to-br from-white via-green-50 to-emerald-100 border border-green-300 rounded-2xl shadow-inner hover:shadow-green-200/50 transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-2">
              Token Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Prefix */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">Prefix</label>
                <input
                  type="text"
                  value={config.prefix}
                  onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
                  className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
                />
              </div>

              {/* Suffix */}
              {/* <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">Suffix</label>
                <input
                  type="text"
                  value={config.suffix}
                  onChange={(e) => setConfig({ ...config, suffix: e.target.value })}
                  className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
                />
              </div> */}

              {/* Initialize Number */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">Initialize Number</label>
                {/* <input
                  type="number"
                  min={1}
                  value={config.initializeNumber}
                  onChange={(e) =>
                    setConfig({ ...config, initializeNumber: Number(e.target.value) })
                  }
                  className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
                /> */}
                <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={config.initializeNumber}
  onChange={(e) => {
    const value = e.target.value;

    // Allow ONLY digits
    if (/^\d*$/.test(value)) {
      setConfig({ ...config, initializeNumber: value });
    }
  }}
  className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2
             focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
/>
              </div>

              {/* Consecutive Basis */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-green-800 mb-1">Consecutive Basis</label>
                <select
                  value={config.consecutiveBasis}
                  onChange={(e) =>
                    setConfig({ ...config, consecutiveBasis: Number(e.target.value) as ConsecutiveBasisType })
                  }
                  className="border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
                >
                  <option value={CONSECUTIVE_BASIS.DAILY}>Daily</option>
                  <option value={CONSECUTIVE_BASIS.WEEKLY}>Weekly</option>
                  <option value={CONSECUTIVE_BASIS.MONTHLY}>Monthly</option>
                  <option value={CONSECUTIVE_BASIS.QUARTERLY}>Quarterly</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                className="bg-linear-to-r from-emerald-600 to-green-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.05] transition-all font-medium"
              >
                Save Configuration
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-green-800 mt-8 italic text-sm">
            Please select a category and subcategory to configure tokens.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfigureTokens;
