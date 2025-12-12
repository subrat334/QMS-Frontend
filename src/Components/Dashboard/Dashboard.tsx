
import { useState, useEffect ,useRef} from "react";
import { Pencil, Trash2 } from "lucide-react";
// import MainLayout from "../Layout/MainLayout"; 
import logo from "../../assets/utkal.png";
// import DashboardLayout from "../../layouts/DashboardLayout";
//  import logo from "../../assets/utkal.png";
import { API } from "../../services/AllApiServices";
import toast from "react-hot-toast";
/* ====== Types ====== */
interface CategoryItem {
  CategoryId: number;
  Categoryname: string;
  SubCategoryCount: number;
}

interface SubCategoryItem {
  CategoryId: number;
  Categoryname: string;
  SubCategoryId: number;
  SubCategoryname: string;
  CounterCount: number;
}

/* Counter grouped structure expected from backend */
interface CounterItem {
  CounterId: number;
  CounterName: string;
}
interface CounterSubCategory {
  SubCategoryId: number;
  SubCategoryName: string;
  Counters: CounterItem[];
}
interface CounterCategoryGroup {
  CategoryId: number;
  CategoryName: string;
  SubCategories: CounterSubCategory[];
}

/* ====== Component ====== */
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<
    "category" | "subcategory" | "counter" | null
  >(null);

  // Category state (for category UI and dropdown)
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Subcategory state (flat list)
  const [subcategories, setSubcategories] = useState<SubCategoryItem[]>([]);
  const [subcatsLoading, setSubcatsLoading] = useState(false);

  // Counters (grouped structure returned by backend)
  const [countersGrouped, setCountersGrouped] = useState<CounterCategoryGroup[]>([]);
  const [countersLoading, setCountersLoading] = useState(false);

  // Add Category (kept)
  const [categoryName, setCategoryName] = useState("");

  // Add Subcategory fields
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [addingSubcat, setAddingSubcat] = useState(false);

  // Counter form fields
  const [counterCategory, setCounterCategory] = useState<number | "">("");
  const [counterSubcategory, setCounterSubcategory] = useState<number | "">("");
  const [counterName, setCounterName] = useState("");
  const [editingCounterId, setEditingCounterId] = useState<number | null>(null);
  const [counterSubmitting, setCounterSubmitting] = useState(false);
  // Edit Category
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Edit Subcategory
  const [editingSubcatId, setEditingSubcatId] = useState<number | null>(null);

  const categoryRef = useRef<HTMLInputElement>(null);
  const subcategoryRef = useRef<HTMLInputElement>(null);
  const counterRef = useRef<HTMLInputElement>(null);

  const scrollToField = (ref: React.RefObject<HTMLInputElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current?.focus();
    }, 150);
  };

  // -------------------------
  // Load categories
  // -------------------------
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await API.getAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("loadCategories:", err);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  // -------------------------
  // Load subcategories (flat list)
  // -------------------------
  const loadSubcategories = async () => {
    setSubcatsLoading(true);
    try {
      const res = await API.getAllSubCategories();
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("loadSubcategories:", err);
      toast.error("Failed to load subcategories");
    } finally {
      setSubcatsLoading(false);
    }
  };

  // -------------------------
  // Load grouped counters
  // -------------------------
  const loadCounters = async () => {
    setCountersLoading(true);
    try {
      // Backend should provide grouped structure (Category -> SubCategories -> Counters)
      const res = await API.getAllCounters();
      setCountersGrouped(res.data || []);
    } catch (err) {
      console.error("loadCounters:", err);
      toast.error("Failed to load counters");
    } finally {
      setCountersLoading(false);
    }
  };

  // Combined initial load
  useEffect(() => {
    loadCategories();
    loadSubcategories();
    // counters loaded on demand when user visits counter section OR load now:
    loadCounters();
  }, []);

  // -------------------------
  // Add Category (existing)
  // -------------------------
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Enter category name");
      return;
    }
    try {
      await API.addOrEditCategory({
        Categoryname: categoryName.trim(),
        CategoryDescription: "",
      });
      toast.success("Category added!");
      setCategoryName("");
      await loadCategories();
      await loadSubcategories();
      await loadCounters();
    } catch (err: any) {
      console.error("handleAddCategory:", err);
      toast.error(err?.response?.data || "Failed to add category");
    }
  };

  const handleUpdateCategory = async () => {
  try {
    await API.addOrEditCategory({
      // CategoryId: editingCategoryId,
      CategoryId: editingCategoryId ?? undefined,

      Categoryname: categoryName.trim(),
      CategoryDescription: "",
    });
    toast.success("Category updated!");

    setEditingCategoryId(null);
    setCategoryName("");

    await loadCategories();
    await loadSubcategories();
    await loadCounters();
  } catch (err) {
    toast.error("Failed to update category");
  }
};

  // -------------------------
  // Delete Category (existing)
  // -------------------------
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.deleteCategory(id);
      toast.success("Category deleted");
      await loadCategories();
      await loadSubcategories();
      await loadCounters();
    } catch (err) {
      console.error("handleDeleteCategory:", err);
      toast.error("Failed to delete category");
    }
  };

  // -------------------------
  // Add Subcategory
  // -------------------------
  const handleAddSubcategory = async () => {
    if (!selectedCategoryId) {
      toast.error("Select a category");
      return;
    }
    if (!newSubcategoryName.trim()) {
      toast.error("Enter subcategory name");
      return;
    }

    setAddingSubcat(true);
    try {
      const payload = {
        CategoryId: selectedCategoryId,
        Name: newSubcategoryName.trim(),
        SubCategoryDescription: "",
      };
      await API.addOrEditSubCategory(payload);
      toast.success("Subcategory added");
      setNewSubcategoryName("");
      setSelectedCategoryId("");
      await loadSubcategories();
      await loadCategories();
      await loadCounters();
    } catch (err: any) {
      console.error("handleAddSubcategory:", err);
      toast.error(err?.response?.data || "Failed to add subcategory");
    } finally {
      setAddingSubcat(false);
    }
  };

    const handleUpdateSubcategory = async () => {
    try {
      await API.addOrEditCategory({
    CategoryId: editingCategoryId ?? undefined,
    Categoryname: categoryName.trim(),
    CategoryDescription: "",
  });

      toast.success("Subcategory updated!");

      setEditingSubcatId(null);
      setSelectedCategoryId("");
      setNewSubcategoryName("");

      await loadSubcategories();
      await loadCategories();
      await loadCounters();
    } catch (err) {
      toast.error("Failed to update subcategory");
    }
  };
  // -------------------------
  // Edit Subcategory (prompt)
  // -------------------------
    const handleEditSubcategory = (sub: SubCategoryItem) => {
    setEditingSubcatId(sub.SubCategoryId);
    setSelectedCategoryId(sub.CategoryId);
    setNewSubcategoryName(sub.SubCategoryname);
    setActiveSection("subcategory");
    scrollToField(subcategoryRef);
  };

  // -------------------------
  // Delete Subcategory
  // -------------------------
  const handleDeleteSubcategory = async (subId: number) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await API.deleteSubCategory(subId);
      toast.success("Subcategory deleted");
      await loadSubcategories();
      await loadCategories();
      await loadCounters();
    } catch (err) {
      console.error("handleDeleteSubcategory:", err);
      toast.error("Failed to delete subcategory");
    }
  };

  // -------------------------
  // Counter: Add or Update
  // -------------------------
  const handleAddOrUpdateCounter = async () => {
    if (!counterCategory || !counterSubcategory || !counterName.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setCounterSubmitting(true);
    try {
      const payload: any = {
        Name: counterName.trim(),
        CategoryId: Number(counterCategory),
        SubCategoryId: Number(counterSubcategory),
      };
      if (editingCounterId) payload.Id = editingCounterId;

      await API.addOrEditCounter(payload);
      toast.success(editingCounterId ? "Counter updated!" : "Counter added!");

      // reset form
      setEditingCounterId(null);
      setCounterName("");
      setCounterCategory("");
      setCounterSubcategory("");

      // refresh lists
      await loadCounters();
      await loadSubcategories();
      await loadCategories();
    } catch (err) {
      console.error("handleAddOrUpdateCounter:", err);
      toast.error("Failed to save counter");
    } finally {
      setCounterSubmitting(false);
    }
  };

  // -------------------------
  // Start editing counter (prefill)
  // -------------------------
  const startEditCounter = async (counter: CounterItem, parentCatId: number, parentSubId: number) => {
  setActiveSection("counter");

  setCounterCategory(parentCatId);

  // Wait for subcategories to load for that category
  await loadSubcategories();

  setCounterSubcategory(parentSubId);
  setCounterName(counter.CounterName);

  setEditingCounterId(counter.CounterId);
  // Scroll to counter input
  scrollToField(counterRef);
};


  // -------------------------
  // Delete Counter
  // -------------------------
  const handleDeleteCounter = async (id: number) => {
    if (!window.confirm("Delete this counter?")) return;
    try {
      await API.deleteCounter(id);
      toast.success("Counter deleted");
      await loadCounters();
      await loadSubcategories();
      await loadCategories();
    } catch (err) {
      console.error("handleDeleteCounter:", err);
      toast.error("Failed to delete counter");
    }
  };

  // -------------------------
  // Helper: subcategories for selected category (flat)
  // -------------------------
  const filteredSubcatsForCategory = (catId: number | "") =>
    subcategories.filter((s) => s.CategoryId === Number(catId));

  // Render
  return (
      <div className="p-6 w-full">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Utkal Hospital" className="w-32 mb-2" />
        </div>

        {/* TOP BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { key: "category", label: "Add Category" },
            { key: "subcategory", label: "Add Subcategory" },
            { key: "counter", label: "Add Counter" },
          ].map((btn) => (
            <div
              key={btn.key}
              onClick={() => setActiveSection(btn.key as any)}
              className={`flex items-center justify-center h-24 rounded-md cursor-pointer font-semibold shadow-sm border transition ${
                activeSection === btn.key
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-green-700 hover:bg-green-100 border-gray-200"
              }`}
            >
              {btn.label}
            </div>
          ))}
        </div>

        {/* ================= CATEGORY SECTION (unchanged) ================= */}
        {activeSection === "category" && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Add Category</h3>

            <div className="flex gap-2 mb-6">
              <input
                ref={categoryRef}
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:ring-2 focus:ring-green-700"
              />

              <button
                onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
                disabled={!categoryName.trim()}
                className={`px-4 py-2 rounded-md transition ${
                  categoryName.trim()
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {editingCategoryId ? "Update" : "➕ Add"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesLoading ? (
                <div className="col-span-full text-center text-gray-500">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No categories found</div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.CategoryId}
                    className="p-4 border border-gray-200 rounded-lg bg-green-50 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-green-700 text-lg">{cat.Categoryname}</h4>

                      <div className="flex space-x-3">
                        <button
                          title="Edit"
                          className="p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          
                          onClick={() => {
                  setEditingCategoryId(cat.CategoryId);
                  setCategoryName(cat.Categoryname);
                  setActiveSection("category");
                    scrollToField(categoryRef);
                }}

                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(cat.CategoryId)}
                          className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">{cat.SubCategoryCount} Subcategories</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= SUBCATEGORY SECTION (grouped by category) ================= */}
        {activeSection === "subcategory" && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Add Subcategory</h3>

            {/* Add Subcategory Form */}
            <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : "")}
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.CategoryId} value={c.CategoryId}>
                    {c.Categoryname}
                  </option>
                ))}
              </select>
                <input
                ref={subcategoryRef}
                type="text"
                placeholder="Enter subcategory name"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              />

              <button
                onClick={editingSubcatId !== null ? handleUpdateSubcategory : handleAddSubcategory}
                disabled={!selectedCategoryId || !newSubcategoryName.trim() || addingSubcat}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategoryId && newSubcategoryName.trim()
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {editingSubcatId !== null
                  ? "Update"
                  : addingSubcat
                  ? "Adding..."
                  : "➕ Add"}
              </button>
            </div>

            {/* Grouped subcategories render */}
            {subcatsLoading ? (
              <div className="text-center text-gray-500">Loading subcategories...</div>
            ) : subcategories.length === 0 ? (
              <div className="text-center text-gray-500">No subcategories found</div>
            ) : (
              Object.keys(
                subcategories.reduce<Record<number, { categoryName: string; items: SubCategoryItem[] }>>(
                  (acc, cur) => {
                    if (!acc[cur.CategoryId]) {
                      acc[cur.CategoryId] = { categoryName: cur.Categoryname, items: [] };
                    }
                    acc[cur.CategoryId].items.push(cur);
                    return acc;
                  },
                  {}
                )
              ).map((catIdStr) => {
                const catId = Number(catIdStr);
                const group = ((): { categoryName: string; items: SubCategoryItem[] } => {
                  const acc = subcategories.reduce<Record<number, { categoryName: string; items: SubCategoryItem[] }>>(
                    (a, c) => {
                      if (!a[c.CategoryId]) a[c.CategoryId] = { categoryName: c.Categoryname, items: [] };
                      a[c.CategoryId].items.push(c);
                      return a;
                    },
                    {}
                  );
                  return acc[catId];
                })();
                return (
                  <div key={catId} className="mb-8">
                    <h3 className="text-green-700 text-xl font-semibold mb-4">{group.categoryName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map((sub) => (
                        <div
                          key={sub.SubCategoryId}
                          className="p-4 rounded-md bg-green-50 border border-gray-100 shadow-sm hover:shadow-md flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold text-green-800 text-lg">{sub.SubCategoryname}</div>
                            <div className="text-sm text-gray-600">{sub.CounterCount} Counters</div>
                          </div>

                          <div className="flex items-start gap-3">
                            <button
                              title="Edit subcategory"
                              onClick={() => handleEditSubcategory(sub)}
                              className="p-2 rounded-lg text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              title="Delete subcategory"
                              onClick={() => handleDeleteSubcategory(sub.SubCategoryId)}
                              className="p-2 rounded-lg text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ================= COUNTER SECTION (full implementation) ================= */}
        {activeSection === "counter" && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-green-700">
              {editingCounterId ? "Edit Counter" : "Add Counter"}
            </h3>

            {/* Counter Form */}
            <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
              <select
  value={counterCategory}
  onChange={(e) => {
    const newCat = e.target.value ? Number(e.target.value) : "";
    
    // Only reset subcategory IF the user actually changed category
    setCounterCategory(newCat);

    // Prevent clearing when editing a counter
    if (newCat !== counterCategory) {
      setCounterSubcategory("");
    }
  }}
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.CategoryId} value={c.CategoryId}>
                    {c.Categoryname}
                  </option>
                ))}
              </select>

              <select
                value={counterSubcategory}
                onChange={(e) => setCounterSubcategory(e.target.value ? Number(e.target.value) : "")}
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              >
                <option value="">Select Subcategory</option>
                {filteredSubcatsForCategory(counterCategory).map((s) => (
                  <option key={s.SubCategoryId} value={s.SubCategoryId}>
                    {s.SubCategoryname}
                  </option>
                ))}
              </select>
              <input
                ref={counterRef}
                type="text"
                placeholder="Enter counter name"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              />

              <button
                onClick={handleAddOrUpdateCounter}
                disabled={counterSubmitting || !counterCategory || !counterSubcategory || !counterName.trim()}
                className={`px-4 py-2 rounded-md transition ${
                  counterCategory && counterSubcategory && counterName.trim()
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {counterSubmitting ? "Saving..." : editingCounterId ? "Update" : "Add"}
              </button>
            </div>

            {/* Grouped counters render */}
            {countersLoading ? (
              <div className="text-center text-gray-500">Loading counters...</div>
            ) : countersGrouped.length === 0 ? (
              <div className="text-center text-gray-500">No counters found</div>
            ) : (
              countersGrouped.map((cat) => (
                <div key={cat.CategoryId} className="mb-8">
                  <h3 className="text-green-700 text-xl font-semibold mb-4">{cat.CategoryName}</h3>

                  <div className="space-y-6">
                    {cat.SubCategories.map((sub) => (
                      <div key={sub.SubCategoryId}>
                        <h4 className="text-green-800 font-medium mb-3">{sub.SubCategoryName}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sub.Counters.map((counter) => (
                            <div
                              key={counter.CounterId}
                              className="p-4 rounded-md bg-green-50 border border-gray-100 shadow-sm flex justify-between items-center"
                            >
                              <div>
                                <div className="font-semibold text-green-900">{counter.CounterName}</div>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  title="Edit counter"
                                  onClick={() => startEditCounter(counter, cat.CategoryId, sub.SubCategoryId)}
                                  className="p-2 rounded-lg text-blue-600 hover:text-blue-800"
                                >
                                  <Pencil size={18} />
                                </button>

                                <button
                                  title="Delete counter"
                                  onClick={() => handleDeleteCounter(counter.CounterId)}
                                  className="p-2 rounded-lg text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
  );
};

export default Dashboard;
