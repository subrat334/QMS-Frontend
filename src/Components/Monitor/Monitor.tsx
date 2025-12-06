import { useState, useEffect } from "react";
import { API } from "../../services/AllApiServices";

interface TokenData {
  status: string;
  tokenNumber: string;
  counterNumber: number | null;
}

interface CategoryData {
  [key: string]: {
    categoryId: number;
    subCategories: {
      name: string;
      subCategoryId: number;
    }[];
  };
}

interface MonitorProps {
  fullScreen: boolean;
  setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Monitor: React.FC<MonitorProps> = ({ fullScreen, setFullScreen }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [tokenData, setTokenData] = useState<Record<string, TokenData[]>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* ✅ LOAD CATEGORIES FROM LOCAL STORAGE */
  useEffect(() => {
    const loadCategories = () => {
      const stored = localStorage.getItem("UserPrivileges");

      if (!stored) {
        setCategoryData({});
        setLoadingCategories(false);
        return;
      }

      const parsed = JSON.parse(stored);

      const mapped: CategoryData = parsed.categories?.reduce(
        (acc: CategoryData, cat: any) => {
          acc[cat.CategoryName] = {
            categoryId: Number(cat.CategoryId),
            subCategories:
              cat.SubCategories?.map((s: any) => ({
                name: s.SubCategoryName,
                subCategoryId: Number(s.SubCategoryId),
              })) || [],
          };
          return acc;
        },
        {}
      );

      setCategoryData(mapped || {});
      setLoadingCategories(false);
    };

    // ✅ Load immediately
    loadCategories();

    // ✅ Poll every 500ms until data appears
    const interval = setInterval(() => {
      const stored = localStorage.getItem("UserPrivileges");
      if (stored) {
        loadCategories();
        clearInterval(interval); // Stop polling once loaded
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  /* ✅ ESC FULLSCREEN */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullScreen(false);
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [setFullScreen]);

  const toggleFullScreen = () => {
    if (!fullScreen && selectedSubcategories.length === 0) {
      alert("Please select at least one subcategory first!");
      return;
    }
    setFullScreen(!fullScreen);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

    if (selectedCategories.includes(category)) {
      const subToRemove =
        categoryData[category]?.subCategories.map((s) => s.name) || [];
      setSelectedSubcategories((prev) =>
        prev.filter((s) => !subToRemove.includes(s))
      );
    }
  };

  const availableSubcategories = selectedCategories.flatMap(
    (cat) => categoryData[cat]?.subCategories.map((s) => s.name) || []
  );

  /* ✅ FETCH DISPLAY DATA PER SUBCATEGORY */
  useEffect(() => {
    const fetchDisplays = async () => {
      const result: Record<string, TokenData[]> = {};

      for (const subName of selectedSubcategories) {
        const categoryEntry = Object.values(categoryData).find((c) =>
          c.subCategories.some((s) => s.name === subName)
        );

        if (!categoryEntry) continue;

        const subEntry = categoryEntry.subCategories.find((s) => s.name === subName);
        if (!subEntry) continue;

        try {
          const res = await API.getDisplayScreenByCategoryAndSubCategory(
            categoryEntry.categoryId,
            subEntry.subCategoryId
          );

          const screen = res.data?.Screens?.[0];

          result[subName] =
            screen?.DisplayList?.map((item: any) => ({
              status: item.Status,
              tokenNumber: item.Token,
              counterNumber: item.CounterId,
            })) || [];
        } catch (err) {
          console.error("API Error:", err);
        }
      }

      setTokenData(result);
    };

    if (selectedSubcategories.length > 0) {
      fetchDisplays();
      const interval = setInterval(fetchDisplays, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedSubcategories, categoryData]);

  const renderTable = (subcategory: string, isFullScreen = false) => {
    const tokens = tokenData[subcategory] || [];

    return (
      <div
        key={subcategory}
        className={`bg-white rounded-2xl shadow-2xl ${
          isFullScreen ? "w-full h-full" : "w-64"
        } border-2 border-green-300 flex flex-col`}
      >
        <h2
          className={`font-bold text-green-800 mb-3 border-b-2 border-green-200 bg-green-50 rounded-t-2xl ${
            isFullScreen ? "text-2xl p-4" : "text-lg p-3"
          }`}
        >
          {subcategory}
        </h2>

        <div className={`flex-1 overflow-auto p-2 ${isFullScreen ? "text-xl" : "text-sm"}`}>
          {tokens.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <p>No tokens available.</p>
            </div>
          ) : (
            <table className="w-full">
  <thead>
    <tr className="bg-green-600 text-white">
      <th className="p-2 font-semibold text-center">Status</th>
      <th className="p-2 font-semibold text-center">Token No.</th>
      <th className="p-2 font-semibold text-center">Counter</th>
    </tr>
  </thead>

  <tbody>
    {tokens.map((token, i) => (
      <tr key={i} className="border-b border-green-100 text-center">
        <td className="p-2 text-center">{token.status}</td>
        <td className="p-2 font-bold text-center">{token.tokenNumber}</td>
        <td className="p-2 text-center">{token.counterNumber ?? "-"}</td>
      </tr>
    ))}
  </tbody>
</table>

          )}
        </div>
      </div>
    );
  };

  /* ✅ FULL SCREEN MODE */
  if (fullScreen) {
    return (
      <div className="h-screen w-screen p-4 bg-black overflow-hidden">
        <div className="grid grid-cols-2 gap-4 h-full">
          {selectedSubcategories.map((sub) => renderTable(sub, true))}
        </div>
      </div>
    );
  }

  /* ✅ NORMAL MODE */
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Token Monitor</h1>
          <p className="text-gray-600">Monitor categories & subcategories</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CONFIG PANEL */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Configuration</h2>

                <button
                  onClick={toggleFullScreen}
                  disabled={selectedSubcategories.length === 0}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    selectedSubcategories.length === 0
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  Full Screen
                </button>
              </div>

              {/* ✅ CATEGORIES FROM LOCAL STORAGE WITH LOADING */}
              <label className="block font-semibold mb-2">Select Categories</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {loadingCategories ? (
                  <div className="text-sm text-gray-500">Loading categories...</div>
                ) : Object.keys(categoryData).length === 0 ? (
                  <div className="text-sm text-gray-500">No categories assigned</div>
                ) : (
                  Object.keys(categoryData).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedCategories.includes(cat)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white border-green-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))
                )}
              </div>

              {/* ✅ SUBCATEGORIES */}
              {selectedCategories.length > 0 && (
                <>
                  <label className="block font-semibold mb-2">Select Subcategories</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSubcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          setSelectedSubcategories((prev) =>
                            prev.includes(sub)
                              ? prev.filter((s) => s !== sub)
                              : [...prev, sub]
                          )
                        }
                        className={`px-4 py-2 rounded-full border ${
                          selectedSubcategories.includes(sub)
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white border-green-400"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ✅ PREVIEW PANEL */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-green-200">
            <h2 className="text-xl font-bold mb-4">
              Live Preview ({selectedSubcategories.length})
            </h2>

            {selectedSubcategories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl">📊</div>
                <p>Select categories and subcategories to preview tokens</p>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  selectedSubcategories.length === 1
                    ? "grid-cols-1 place-items-center"
                    : selectedSubcategories.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {selectedSubcategories.map((sub) => (
                  <div key={sub} className="relative">
                    {renderTable(sub)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
