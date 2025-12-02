
import { useState, useEffect } from "react";

interface TokenData {
  status: "Running" | "Done" | "Upcoming";
  tokenNumber: string;
  counterNumber: number;
}

interface CategoryData {
  [key: string]: string[];
}

const categoryData: CategoryData = {
  Cardiology: ["Consultation", "ECG", "Echo", "TMT"],
  Neurology: ["EEG", "Consultation"],
  Pediatrics: ["Vaccination", "Consultation"],
  Orthopedics: ["Fracture", "Joint Pain", "Consultation"],
  "General OPD": ["Consultation", "Follow-up", "Emergency"],
  Dermatology: ["Consultation", "Skin Biopsy", "Laser Therapy"],
};

const mockTokens: Record<string, TokenData[]> = {
  Consultation: [
    { status: "Done", tokenNumber: "N203", counterNumber: 3 },
    { status: "Upcoming", tokenNumber: "O402", counterNumber: 6 },
    { status: "Running", tokenNumber: "C101", counterNumber: 2 },
  ],
  ECG: [
    { status: "Running", tokenNumber: "E101", counterNumber: 2 },
    { status: "Upcoming", tokenNumber: "E102", counterNumber: 2 },
    { status: "Done", tokenNumber: "E099", counterNumber: 2 },
  ],
  Echo: [
    { status: "Done", tokenNumber: "E201", counterNumber: 1 },
    { status: "Upcoming", tokenNumber: "E202", counterNumber: 1 },
    { status: "Running", tokenNumber: "E203", counterNumber: 1 },
  ],
  TMT: [
    { status: "Running", tokenNumber: "T101", counterNumber: 4 },
    { status: "Upcoming", tokenNumber: "T102", counterNumber: 4 },
  ],
  EEG: [
    { status: "Done", tokenNumber: "EEG101", counterNumber: 5 },
    { status: "Upcoming", tokenNumber: "EEG102", counterNumber: 5 },
  ],
  Vaccination: [
    { status: "Running", tokenNumber: "V101", counterNumber: 2 },
    { status: "Done", tokenNumber: "V099", counterNumber: 1 },
    { status: "Upcoming", tokenNumber: "V102", counterNumber: 2 },
  ],
  Fracture: [
    { status: "Running", tokenNumber: "F101", counterNumber: 7 },
    { status: "Upcoming", tokenNumber: "F102", counterNumber: 7 },
  ],
  "Joint Pain": [
    { status: "Done", tokenNumber: "JP101", counterNumber: 8 },
    { status: "Upcoming", tokenNumber: "JP102", counterNumber: 8 },
  ],
  "Follow-up": [
    { status: "Running", tokenNumber: "FU101", counterNumber: 3 },
    { status: "Upcoming", tokenNumber: "FU102", counterNumber: 3 },
  ],
  Emergency: [
    { status: "Running", tokenNumber: "EM101", counterNumber: 1 },
    { status: "Done", tokenNumber: "EM099", counterNumber: 1 },
  ],
  "Skin Biopsy": [
    { status: "Upcoming", tokenNumber: "SB101", counterNumber: 4 },
    { status: "Running", tokenNumber: "SB102", counterNumber: 4 },
  ],
  "Laser Therapy": [
    { status: "Done", tokenNumber: "LT101", counterNumber: 5 },
    { status: "Upcoming", tokenNumber: "LT102", counterNumber: 5 },
  ],
};

// NEW: mapping from subcategory -> list of counters (numbers)
const subcategoryCounters: Record<string, number[]> = {
  Consultation: [1, 2, 3, 6], // example counters (merged with mockTokens usage)
  ECG: [2],
  Echo: [1],
  TMT: [4],
  EEG: [5],
  Vaccination: [1, 2],
  Fracture: [7],
  "Joint Pain": [8],
  "Follow-up": [3],
  Emergency: [1],
  "Skin Biopsy": [4],
  "Laser Therapy": [5],
};

interface MonitorProps {
  fullScreen: boolean;
  setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Monitor: React.FC<MonitorProps> = ({ fullScreen, setFullScreen }) => {
  // MULTIPLE CATEGORY SELECTION
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  // NEW: counters selected by user (numbers)
  const [selectedCounters, setSelectedCounters] = useState<number[]>([]);

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
    // require counters to be selected as well (user requested)
    if (!fullScreen && selectedCounters.length === 0) {
      alert("Please select at least one counter to view in full screen!");
      return;
    }
    setFullScreen(!fullScreen);
  };

  // NEW: toggle category (keeps original behavior)
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

    // If removing a category, remove subcategories that belong to that category
    if (selectedCategories.includes(category)) {
      const subToRemove = categoryData[category] || [];
      setSelectedSubcategories((prev) => prev.filter((s) => !subToRemove.includes(s)));
      // When removing subcategories, also update selectedCounters (we'll recompute later)
      // We'll recompute available counters using selectedSubcategories below, and clear selectedCounters that no longer exist.
      // setSelectedCounters((prev) =>
      //   prev.filter((cnt) => {
      //     // keep counters that still are part of remaining selected subcategories
      //     const remainingSubs = Object.keys(categoryData)
      //       .filter((c) => c === category ? false : selectedCategories.includes(c))
      //       .flatMap((c) => categoryData[c]);
      //     // remainingSubs is a rough estimate; we'll prune properly after setSelectedSubcategories completes
      //     return true; // leave pruning to effect below (we'll recompute on render)
      //   })
      // );
    }
  };

  // ALL subcategories from ALL selected categories
  const availableSubcategories = selectedCategories.flatMap((cat) => categoryData[cat] || []);

  // Derived: available counters (merged unique) from selectedSubcategories
  const availableCounters = Array.from(
    new Set(selectedSubcategories.flatMap((sub) => subcategoryCounters[sub] || []))
  ).sort((a, b) => a - b);

  // Ensure selectedCounters only contains counters that are in availableCounters (prune when subcategories change)
  useEffect(() => {
    setSelectedCounters((prev) => prev.filter((c) => availableCounters.includes(c)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategories.join(",")]); // run when selectedSubcategories change

  const renderTable = (subcategory: string, isFullScreen = false) => {
    let tokens = mockTokens[subcategory] || [];

    // Filter tokens by selectedCounters (user must select counters to view tokens)
    if (selectedCounters.length > 0) {
      tokens = tokens.filter((t) => selectedCounters.includes(t.counterNumber));
    } else {
      // If no counters selected, show empty (user required to pick counters)
      tokens = [];
    }

    return (
      <div
        key={subcategory}
        className={`bg-white rounded-2xl shadow-2xl ${isFullScreen ? "w-full h-full" : "w-64"
          } border-2 border-green-300 flex flex-col`}
      >
        <h2
          className={`font-bold text-green-800 mb-3 border-b-2 border-green-200 bg-green-50 rounded-t-2xl ${isFullScreen ? "text-2xl p-4" : "text-lg p-3"
            }`}
        >
          {subcategory}
        </h2>

        <div className={`flex-1 overflow-auto p-2 ${isFullScreen ? "text-xl" : "text-sm"}`}>
          {tokens.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <p>
                {selectedCounters.length === 0
                  ? "Select counters to view tokens."
                  : "No tokens for selected counters."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 font-semibold">Status</th>
                  <th className="p-2 font-semibold">Token No.</th>
                  <th className="p-2 font-semibold">Counter</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, i) => (
                  <tr key={i} className="border-b border-green-100">
                    <td className="p-2">{token.status}</td>
                    <td className="p-2 font-bold">{token.tokenNumber}</td>
                    <td className="p-2">{token.counterNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // FULL SCREEN MODE (requires selectedSubcategories & selectedCounters)
  if (fullScreen) {
    return (
      <div className="h-screen w-screen p-4 bg-black overflow-hidden">
        <div className="grid grid-cols-2 gap-4 h-full">
          {selectedSubcategories.map((sub) => renderTable(sub, true))}
        </div>
      </div>
    );
  }

  // NORMAL MODE
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Token Monitor</h1>
          <p className="text-gray-600">Monitor multiple categories, subcategories & counters</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CONFIG PANEL */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Configuration</h2>

                <button
                  onClick={toggleFullScreen}
                  disabled={selectedSubcategories.length === 0 || selectedCounters.length === 0}
                  className={`px-4 py-2 rounded-xl font-semibold ${selectedSubcategories.length === 0 || selectedCounters.length === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                    }`}
                >
                  Full Screen
                </button>
              </div>

              {/* MULTI CATEGORY SELECT */}
              <label className="block font-semibold mb-2">Select Categories</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(categoryData).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-4 py-2 rounded-full border ${selectedCategories.includes(cat)
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white border-green-400"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* MULTIPLE SUBCATEGORIES */}
              {selectedCategories.length > 0 && (
                <>
                  <label className="block font-semibold mb-2">Select Subcategories</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSubcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          setSelectedSubcategories((prev) =>
                            prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
                          )
                        }
                        className={`px-4 py-2 rounded-full border ${selectedSubcategories.includes(sub)
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

              {/* COUNTERS derived from selected subcategories */}
              {selectedSubcategories.length > 0 && (
                <>
                  <label className="block font-semibold mt-6 mb-2">Select Counters</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCounters.length === 0 ? (
                      <div className="text-sm text-gray-500">No counters available for selected subcategories.</div>
                    ) : (
                      availableCounters.map((counter) => (
                        <button
                          key={counter}
                          onClick={() =>
                            setSelectedCounters((prev) =>
                              prev.includes(counter) ? prev.filter((c) => c !== counter) : [...prev, counter]
                            )
                          }
                          className={`px-4 py-2 rounded-full border ${selectedCounters.includes(counter)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-blue-400"
                            }`}
                        >
                          Counter {counter}
                        </button>
                      ))
                    )}
                  </div>

                  {/* quick actions */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setSelectedCounters(availableCounters.slice())}
                      className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedCounters([])}
                      className="px-3 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-100 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-green-200">
            <h2 className="text-xl font-bold mb-4">
              Live Preview ({selectedSubcategories.length}) {selectedCounters.length > 0 ? `| Counters: ${selectedCounters.join(", ")}` : ""}
            </h2>

            {selectedSubcategories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl">📊</div>
                <p>Select categories and subcategories to preview their tokens</p>
              </div>
            ) : selectedCounters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl">🔎</div>
                <p>Please select counters (from the configuration panel) to view tokens.</p>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${selectedSubcategories.length === 1 ? "grid-cols-1 place-items-center" : selectedSubcategories.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
