// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import {Pencil,Trash2,UserPlus,UserCog,Eye,EyeOff,Key,ChevronRight} from "lucide-react";
import toast from "react-hot-toast";
import { API } from "../../services/AllApiServices";
import { USER_ROLES } from "../../constants/AllConstants"; // adjust path if needed

// -------------------- Types --------------------
type ApiUser = {
  UserId: string;
  UserType: string;
  Name: string;
  EmployeeID: string;
   IsActive?: boolean; 
  Categories?: Array<{
    Id?: number;
    CategoryId?: string;
    CategoryName?: string;
    SubCategories?: Array<{
      Id?: number;
      SubCategoryId?: string;
      SubCategoryName?: string;
      Counters?: Array<{ Id?: number; CounterId?: string; CounterName?: string }>;
    }>;
  }>;
};

type CategorySimple = {
  CategoryId: number;
  Categoryname: string;
  SubCategoryCount: number;
};

type SubCategorySimple = {
  CategoryId: number;
  Categoryname: string;
  SubCategoryId: number;
  SubCategoryname: string;
  CounterCount: number;
};

type CounterSimple = {
  Id: number; // backend 'Id' for mapping & delete
  Name: string;
  CategoryId: number;
  CategoryName: string;
  SubCategoryId: number;
  SubCategoryName: string;
  CounterId: number; // the counter identifier as string in backend
};

// -------------------- Constants --------------------
const ROLE_OPTIONS = [
  { label: "MIS", value: USER_ROLES.MIS },
  { label: "Monitor", value: USER_ROLES.MONITOR },
  { label: "Counter", value: USER_ROLES.COUNTER },
  { label: "Patient Screen", value: USER_ROLES.PATIENT_SCREEN },
  // { label: "Super Admin", value: USER_ROLES.SUPER_ADMIN },
];

// ================= MULTI SELECT DROPDOWN (LOCAL) =================
  type DropdownOption = {
    id: number;
    label: string;
  };

  type MultiSelectDropdownProps = {
    label: string;
    options: DropdownOption[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    disabled?: boolean;
  };

  const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    options,
    selectedIds,
    onChange,
    disabled = false,
  }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.id));
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block mb-1 font-medium text-green-800">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-full text-left px-3 py-2 pr-10 border rounded-md bg-white
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "border-green-200 focus:ring-2 focus:ring-green-500"
          }`}
      >
        {selectedIds.length > 0
          ? `${selectedIds.length} selected`
          : "Select"}

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 8l4 4 4-4"
            />
          </svg>
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-green-200 rounded-md shadow max-h-60 overflow-auto">
          <div
            onClick={toggleAll}
            className="px-3 py-2 cursor-pointer hover:bg-green-50 font-medium"
          >
            {selectedIds.length === options.length
              ? "Unselect All"
              : "Select All"}
          </div>

          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-green-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(opt.id)}
                onChange={() => toggle(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};


// -------------------- Component --------------------
const Users: React.FC = () => {
  // Users
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Category/Subcategory/Counter lists
  const [categories, setCategories] = useState<CategorySimple[]>([]);
  const [, setLoadingCategories] = useState<boolean>(false);

  const [subcategories, setSubcategories] = useState<SubCategorySimple[]>([]);
  const [, setLoadingSubcats] = useState(false);

  // All counters (optional, from initial full fetch)
  const [counters, setCounters] = useState<CounterSimple[]>([]);

  // Counters fetched per subcategory (grouped)
  const [subcatCounters, setSubcatCounters] = useState<Record<number, CounterSimple[]>>(
    {}
  );
  const [loadingCountersBySubcat, setLoadingCountersBySubcat] = useState<
    Record<number, boolean>
  >({});

  // UI toggle to show/hide counters area
  const [showCountersArea, setShowCountersArea] = useState(true);

  // Form fields for create/edit
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState<number>(USER_ROLES.COUNTER); // default Counter
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
// Username existence check
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameExists, setIsUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [originalEmployeeId, setOriginalEmployeeId] = useState<string>(""); // for edit mode


  // Privilege selections
  // const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [selectedCounterIds, setSelectedCounterIds] = useState<number[]>([]); // store counter.CounterId (number)

  // Modes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [passwordEditUserId, setPasswordEditUserId] = useState<string | null>(
    null
  );
  const [passwordEditUserName, setPasswordEditUserName] = useState<string | null>(
    null
  );
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const toggleAccordion = (userId: string) => {
  setExpandedUserId(prev => (prev === userId ? null : userId));
};


  // -------------------- Loaders --------------------
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await API.getAllUsersWithPrivileges();
      setUsers(res.data || []);
    } catch (err) {
      console.error("loadUsers:", err);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await API.getAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("loadCategories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async () => {
    setLoadingSubcats(true);
    try {
      const res = await API.getAllSubCategories();
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("loadSubcategories:", err);
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubcats(false);
    }
  };

  const loadCounters = async () => {
    try {
      const res = await API.getAllCounters();
      const raw: any[] = res.data || [];

      const flattened: CounterSimple[] = [];

      raw.forEach((cat: any) => {
        (cat.SubCategories || []).forEach((sub: any) => {
          (sub.Counters || []).forEach((ctr: any) => {
            flattened.push({
              Id: Number(ctr.CounterId),
              CounterId: Number(ctr.CounterId),
              Name: ctr.CounterName,
              CategoryId: Number(cat.CategoryId),
              CategoryName: cat.CategoryName || "",
              SubCategoryId: Number(sub.SubCategoryId),
              SubCategoryName: sub.SubCategoryName || "",
            });
          });
        });
      });

      setCounters(flattened);
    } catch (err) {
      console.error("loadCounters:", err);
      toast.error("Failed to load counters");
    }
  };

  const isCounterSimple = (
  c: CounterSimple | undefined
): c is CounterSimple => c !== undefined;


  // initial load
  useEffect(() => {
    loadUsers();
    loadCategories();
    loadSubcategories();
    loadCounters();
  }, []);

  // helper to reset form
  const resetForm = () => {
    setName("");
    setEmployeeId("");
    setDesignation(USER_ROLES.COUNTER);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    // selectedCategoryIds([]);
    setSelectedCategoryIds([]);
    setSelectedSubcategories([]);
    setSelectedCounterIds([]);
    setEditUserId(null);
    setPasswordEditMode(false);
    setPasswordEditUserId(null);
    setSubcatCounters({});
    setLoadingCountersBySubcat({});
  };

  // -------------------- Helpers for selection --------------------
  // Find a counter by backend Id searching both global counters and per-subcat counters
  const findCounterByBackendId = (backendId: number): CounterSimple | undefined => {
    let c = counters.find((x) => x.CounterId === backendId);
    if (c) return c;
    for (const key of Object.keys(subcatCounters)) {
      const arr = subcatCounters[Number(key)] || [];
      const found = arr.find((x) => x.CounterId === backendId);
      if (found) return found;
    }
    return undefined;
  };

  const toggleCounter = (counterId: number) => {
    setSelectedCounterIds((prev) =>
      prev.includes(counterId) ? prev.filter((p) => p !== counterId) : [...prev, counterId]
    );
  };

  // When user toggles a subcategory: fetch counters if selecting; remove counters if deselecting

  // -------------------- Role helpers & rules --------------------
  const isMIS = designation === USER_ROLES.MIS;
  const isMONITOR = designation === USER_ROLES.MONITOR;
  const isPATIENT = designation === USER_ROLES.PATIENT_SCREEN;
  const isNoCounterRole = isMONITOR || isPATIENT; // they should not have counters
  const requiresCounters = !isNoCounterRole && !isMIS; // COUNTER & SUPER_ADMIN require counters

  // -------------------- Build payload for privileges --------------------
const buildPrivilegesPayload = (userId: string) => {
  if (!selectedCategoryIds.length) {
    throw new Error("Category not selected");
  }

  return {
    UserId: userId,
    Categories: selectedCategoryIds.map((categoryId) => {
      const subCatsForCategory = selectedSubcategories.filter((subId) => {
        const sub = subcategories.find(
          (s) => s.SubCategoryId === subId
        );
        return sub?.CategoryId === categoryId;
      });

      return {
        CategoryId: categoryId,
        SubCategories: subCatsForCategory.map((subId) => {
          const countersForSub = selectedCounterIds
            .map((cid) => findCounterByBackendId(cid))
            .filter(isCounterSimple) // ✅ NO undefined beyond this point
            .filter(
              (c) =>
                c.SubCategoryId === subId &&
                c.CategoryId === categoryId
            )
            .map((c) => ({
              CounterId: c.CounterId, // number → backend expects number
            }));

          return {
            SubCategoryId: subId,
            Counters: isNoCounterRole ? [] : countersForSub,
          };
        }),
      };
    }),
  };
};


  // -------------------- Create user + privileges --------------------
  const handleCreateUserAndPrivileges = async () => {
  // ---------------- VALIDATION ----------------

  //  Block if username already exists
  if (isUsernameExists) {
    toast.error("Employee ID / Username already exists");
    return;
  }

  // Basic fields
    if (!name.trim() || !employeeId.trim() || !password.trim()) {
      toast.error("Please fill Name, Employee ID and Password");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Please confirm password");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Privilege validations only for non-MIS
    if (!isMIS) {
      if (!selectedCategoryIds.length) {
        toast.error("Select a category for privileges");
        return;
      }
      if (!selectedSubcategories.length) {
        toast.error("Select at least one subcategory");
        return;
      }
      if (requiresCounters && selectedCounterIds.length === 0) {
        toast.error("Select at least one counter");
        return;
      }
    }

    // ---------------- SUBMIT ----------------
    setIsSubmitting(true);
    try {
      //  Create user
      const createPayload = {
        FirstName: name.trim(),
        UserType: designation,
        Username: employeeId.trim(),
        Password: password,
        EmployeeID: employeeId.trim(),
      };

      const createRes = await API.createUser(createPayload);
      const newUserId = createRes.data?.NewUserId;
      if (!newUserId) {
        toast.error("User creation failed");
        return;
      }

      //  Create privileges (skip for MIS)
      if (!isMIS) {
        const privilPayload = buildPrivilegesPayload(newUserId);
        await API.createUserPrivilege(privilPayload);
      }

      toast.success(isMIS ? "MIS user created successfully" : "User created and privileges assigned");
      resetForm();
      await loadUsers();
    } catch (err: any) {
      console.error("createUser:", err);
      const msg = err?.response?.data || err?.message || "Failed to create user";
      toast.error(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCreateFormValid = (() => {
    //  Block if username already exists
    if (isUsernameExists) return false;

  // Basic fields
  if (
    !name.trim() ||
    !employeeId.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    return false;
  }

  if (password !== confirmPassword) return false;

  // MIS → no privileges needed
  if (isMIS) return true;

  // MONITOR / PATIENT_SCREEN → category + subcategory
  if (isNoCounterRole) {
    return selectedCategoryIds.length > 0 && selectedSubcategories.length > 0;
  }

  // COUNTER → category + subcategory + counters
  if (requiresCounters) {
    return (
      selectedCategoryIds.length > 0 &&
      selectedSubcategories.length > 0 &&
      selectedCounterIds.length > 0
    );
  }

  return true;
})();




  // -------------------- Update privileges for existing user --------------------
  const handleUpdatePrivileges = async () => {
    if (!editUserId) {
      toast.error("No user selected for update");
      return;
    }

  try {
    setIsSubmitting(true);

    // 1️⃣ Update name, employeeId & role
    await API.updateNormalUserDetails({
      UserId: editUserId,
      FirstName: name.trim(),
      UserType: designation,
      EmployeeID: employeeId.trim(),
    });

    // 2️⃣ Update privileges
    const privilegePayload = buildPrivilegesPayload(editUserId);
    await API.updateUserPrivilege(privilegePayload);

    toast.success("User details & privileges updated successfully");

      resetForm();
      await loadUsers(); //  correct function
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data || "Failed to update user details"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- Delete user --------------------
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure to delete this user?")) return;
    try {
      await API.deleteUserPrivilege(userId);
      toast.success("User deleted");
      await loadUsers();
    } catch (err) {
      console.error("deleteUser:", err);
      toast.error("Failed to delete user");
    }
  };

  // -------------------- Edit / Prefill privileges --------------------
  const openEditPrivileges = async (userId: string) => {
  try {
    const res = await API.getUserPrivilegesById(userId);
    const d = res.data;

    if (!d) {
      toast.error("Failed to fetch user details");
      return;
    }

    // ---------------- Top-level info ----------------
    setName(d.Name || "");
    setEmployeeId(d.EmployeeID || "");
    setOriginalEmployeeId(d.EmployeeID || ""); //  IMPORTANT FIX

    const ut = String(d.UserType || "").toLowerCase();

    switch (ut) {
      case "mis":
        setDesignation(USER_ROLES.MIS);
        break;

      case "display":
        setDesignation(USER_ROLES.MONITOR);
        break;

      case "receptionist":
      case "patient":
        setDesignation(USER_ROLES.PATIENT_SCREEN);
        break;

      case "counter":
        setDesignation(USER_ROLES.COUNTER);
        break;

      default:
        setDesignation(USER_ROLES.COUNTER);
    }

    setEditUserId(d.UserId);
    setPasswordEditMode(false);
    setPasswordEditUserId(null);

    // ---------------- Categories ----------------
    if (Array.isArray(d.Categories) && d.Categories.length > 0) {
      const categoryIds = d.Categories.map((c: any) =>
        Number(c.CategoryId)
      );
      setSelectedCategoryIds(categoryIds);

      const subIds: number[] = [];
      const counterIds: number[] = [];

      d.Categories.forEach((cat: any) => {
        (cat.SubCategories || []).forEach((sub: any) => {
          const subId = Number(sub.SubCategoryId);
          subIds.push(subId);

          (sub.Counters || []).forEach((ctr: any) => {
            counterIds.push(Number(ctr.CounterId));
          });
        });
      });

      setSelectedSubcategories(subIds);
      setSelectedCounterIds(counterIds);

      for (const subId of subIds) {
        try {
          const resC = await API.getCountersBySubCategoryId(subId);
          setSubcatCounters((prev) => ({
            ...prev,
            [subId]: resC.data || [],
          }));
        } catch (err) {
          console.warn("Counter fetch failed:", subId);
        }
      }
    } else {
      setSelectedCategoryIds([]);
      setSelectedSubcategories([]);
      setSelectedCounterIds([]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("openEditPrivileges:", err);
    toast.error("Failed to load user details");
  }
};


  // -------------------- Password editor --------------------
  const openPasswordEditor = (userId: string, userName: string) => {
    setPasswordEditMode(true);
    setPasswordEditUserId(userId);
    setPasswordEditUserName(userName);
    // clear other edit fields
    setEditUserId(null);
    setName("");
    setEmployeeId("");
    setDesignation(USER_ROLES.COUNTER);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdatePasswordConfirm = async () => {
    try {
      if (!passwordEditMode || !passwordEditUserId) {
        toast.error("No user selected for password change");
        return;
      }
      if (!password.trim() || !confirmPassword.trim()) {
        setPasswordError("Please enter both password fields.");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
      }

      const res = await API.updateUserPassword(passwordEditUserId, password);

      if (res?.data?.status === "Success" || res?.data === true) {
        toast.success("Password updated successfully!");
      } else {
        toast.success("Password updated successfully.");
      }

      // Reset states
      setPassword("");
      setConfirmPassword("");
      setPasswordEditMode(false);
      setPasswordEditUserId(null);
      setPasswordError("");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update password");
    }
  };

  // Input handlers with validations
  const handleNameChange = (value: string) => {
    value = value.replace(/^\s+/, "");
    value = value.replace(/[^A-Za-z0-9 @#_\-\/.]/g, "");
    value = value.replace(/\s+/g, " ");
    if (value.length > 40) value = value.substring(0, 40);
    setName(value);
  };
  const handleEmployeeIdChange = (value: string) => {
    value = value.replace(/^\s+/, "");
    value = value.replace(/[^A-Za-z0-9 @#_\-\/.]/g, "");
    value = value.replace(/\s+/g, " ");
    if (value.length > 25) value = value.substring(0, 25);
    setEmployeeId(value);
  };



const isPasswordValid =
  password.trim().length > 0 &&
  confirmPassword.trim().length > 0 &&
  password === confirmPassword;


  const isEditMode = !!editUserId;

  useEffect(() => {
  if (!password || !confirmPassword) {
    setPasswordError("");
  } else if (password !== confirmPassword) {
    setPasswordError("Passwords do not match");
  } else {
    setPasswordError("");
  }
}, [password, confirmPassword]);

const handleCancelEdit = () => {
  setEditUserId(null);
  setName("");
  setEmployeeId("");
  setDesignation(ROLE_OPTIONS[0]?.value || 0);
  setSelectedCategoryIds([]);
  setSelectedSubcategories([]);
  setSelectedCounterIds([]);
  setSubcatCounters({});
  // If you have a state for password/confirm password in edit mode, reset them here too
  setPassword("");
  setConfirmPassword("");
};

// -------------------- Username existence check --------------------

useEffect(() => {
  // Skip empty
  if (!employeeId.trim()) {
    setIsUsernameExists(false);
    setUsernameError("");
    return;
  }

  // Skip check in edit mode if username not changed
  if (isEditMode && employeeId === originalEmployeeId) {
    setIsUsernameExists(false);
    setUsernameError("");
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setIsCheckingUsername(true);
      const res = await API.isUserExist(employeeId.trim());

      /**
       * BACKEND RESPONSE HANDLING
       * Adjust if backend sends true/false differently
       */
      const exists =
        res?.data === true ||
        res?.data?.exists === true ||
        res?.data?.IsExist === true;

      if (exists) {
        setIsUsernameExists(true);
        setUsernameError("Employee ID / Username already exists");
      } else {
        setIsUsernameExists(false);
        setUsernameError("");
      }
    } catch (err) {
      console.error("Username check failed", err);
    } finally {
      setIsCheckingUsername(false);
    }
  }, 600); //  debounce delay

  return () => clearTimeout(timer);
}, [employeeId, isEditMode]);




  // -------------------- Render --------------------
  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          {editUserId ? <UserCog /> : <UserPlus />}
          {editUserId ? "Edit Privileges" : passwordEditMode ? "Update Password" : "Add New User"}
        </h2>
      </div>

      {/* Form container */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-green-100">
        {passwordEditMode ? (
          <>
          {passwordEditUserName && (
        <p className="mb-2 text-green-800">
          <span className="font-bold">Name :</span>{" "}
          <span className="font-semibold">{passwordEditUserName}</span>
        </p>
      )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-green-800">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Enter password"
                    className="w-full border border-green-200 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-green-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-800">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Re-enter password"
                    className="w-full border border-green-200 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-green-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                {passwordError && <p className="text-red-600 mt-1">{passwordError}</p>}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
               <button
          onClick={handleUpdatePasswordConfirm}
          disabled={!isPasswordValid || !passwordEditUserId}
          className={`px-4 py-2 rounded text-white 
            ${isPasswordValid ? "bg-green-700 hover:bg-green-800" : "bg-green-300 cursor-not-allowed"}
          `}
        >
          Update Password
        </button>


              <button
                onClick={() => { setPasswordEditMode(false); setPasswordEditUserId(null); setPasswordEditUserName(null); setPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block mb-1 font-medium text-green-800">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter name"
                  className="w-full border border-green-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                />

              </div>

              {/* Employee ID */}
              <div>
                <label className="block mb-1 font-medium text-green-800">
          Employee ID / User Name
        </label>

               <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => handleEmployeeIdChange(e.target.value)}
                  placeholder="Enter employee id"
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2
            ${
              usernameError
                ? "border-red-500 focus:ring-red-500"
                : "border-green-200 focus:ring-green-500"
            }`}
        />

        {isCheckingUsername && (
          <p className="text-sm text-gray-500 mt-1">
            Checking availability...
          </p>
        )}

        {usernameError && (
          <p className="text-sm text-red-600 mt-1">
            {usernameError}
          </p>
        )}
      </div>


            {/* Password & Confirm Password - HIDE IN EDIT MODE */}
{!isEditMode && (
  <>
    {/* Password */}
    <div>
      <label className="block mb-1 font-medium text-green-800">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}

          placeholder="Enter password"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full border border-green-200 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500"
        />
        <span
          className="absolute right-3 top-3 cursor-pointer text-green-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>

    {/* Confirm Password */}
    <div>
      <label className="block mb-1 font-medium text-green-800">
        Confirm Password
      </label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError("");
          }}
          placeholder="Re-enter password"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full border border-green-200 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500"
        />
        <span
          className="absolute right-3 top-3 cursor-pointer text-green-700"
          onClick={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        >
          {showConfirmPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </span>
      </div>

      {passwordError && (
        <p className="text-red-600 mt-1">{passwordError}</p>
      )}
    </div>
  </>
)}


              {/* Designation */}
              <div>
                <label className="block mb-1 font-medium text-green-800">User Type</label>
                <select
              value={designation}
              onChange={(e) => {
                const newDesignation = Number(e.target.value);
                setDesignation(newDesignation);

                // Reset category/subcategory/counters
                setSelectedCategoryIds([]);
                setSelectedSubcategories([]);
                setSelectedCounterIds([]);
                setSubcatCounters({});
                setLoadingCountersBySubcat({});
              }}
              className="w-full border border-green-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

              </div>
              {/* Category - hide for MIS */}
              {/* Category multi-select (same pattern as subcategory) */}
              {/* {!isMIS && (
                <div className="mt-4">
                  <MultiSelectDropdown
                    label="Select Categories"
                    options={categories.map(c => ({
                      id: c.CategoryId,
                      label: c.Categoryname,
                    }))}
                    selectedIds={selectedCategoryIds}
                    onChange={(ids) => {
                      setSelectedCategoryIds(ids);

                      // remove subcategories & counters if category removed
                      setSelectedSubcategories(prev =>
                        prev.filter(subId => {
                          const sub = subcategories.find(s => s.SubCategoryId === subId);
                          return sub ? ids.includes(sub.CategoryId) : true;
                        })
                      );

                      setSelectedCounterIds(prev =>
                        prev.filter(cid => {
                          const ctr = findCounterByBackendId(cid);
                          return ctr ? ids.includes(ctr.CategoryId) : true;
                        })
                      );
                    }}
                  />
                </div>
              )} */}
              {/* Category multi-select */}
          {!isMIS && (
            <div>
              <MultiSelectDropdown
                label="Select Categories"
                options={categories.map(c => ({
                  id: c.CategoryId,
                  label: c.Categoryname,
                }))}
                selectedIds={selectedCategoryIds}
                onChange={(ids) => {
                  setSelectedCategoryIds(ids);

                      setSelectedSubcategories(prev =>
                        prev.filter(subId => {
                          const sub = subcategories.find(s => s.SubCategoryId === subId);
                          return sub ? ids.includes(sub.CategoryId) : true;
                        })
                      );

                      setSelectedCounterIds(prev =>
                        prev.filter(cid => {
                          const ctr = findCounterByBackendId(cid);
                          return ctr ? ids.includes(ctr.CategoryId) : true;
                        })
                      );
                    }}
                  />
                </div>
              )}


                          </div>

                          {/* Subcategory multi-select */}
                          {!isMIS && (
              <MultiSelectDropdown
                label="Select Subcategories"
                disabled={selectedCategoryIds.length === 0}
                options={subcategories
                  .filter(s => selectedCategoryIds.includes(s.CategoryId))
                  .map(s => ({
                    id: s.SubCategoryId,
                    label: s.SubCategoryname,
                  }))}

                selectedIds={selectedSubcategories}

                onChange={async (newIds) => {
                  //  Find added subcategories
                  const added = newIds.filter(
                    id => !selectedSubcategories.includes(id)
                  );

                  //  Find removed subcategories
                  const removed = selectedSubcategories.filter(
                    id => !newIds.includes(id)
                  );

                  // Update state
                  setSelectedSubcategories(newIds);

                  //  Handle REMOVED subcategories
                  if (removed.length > 0) {
                    setSelectedCounterIds(prev =>
                      prev.filter(cid => {
                        const ctr = findCounterByBackendId(cid);
                        return ctr ? !removed.includes(ctr.SubCategoryId) : true;
                      })
                    );

                    setSubcatCounters(prev => {
                      const copy = { ...prev };
                      removed.forEach(id => delete copy[id]);
                      return copy;
                    });
                  }

                  //  Handle ADDED subcategories → CALL API 
                  for (const subId of added) {
                    try {
                      setLoadingCountersBySubcat(prev => ({
                        ...prev,
                        [subId]: true,
                      }));

                      const res = await API.getCountersBySubCategoryId(subId);
                      const received = res.data || [];

                      const sub = subcategories.find(
                        s => s.SubCategoryId === subId
                      );

                      const normalized = received.map((c: any) => ({
                        Id: Number(c.CounterId),
                        CounterId: Number(c.CounterId),
                        Name: c.CounterName,
                        CategoryId: sub?.CategoryId ?? 0,
                        CategoryName: sub?.Categoryname ?? "",
                        SubCategoryId: subId,
                        SubCategoryName: sub?.SubCategoryname ?? "",
                      }));

                      setSubcatCounters(prev => ({
                        ...prev,
                        [subId]: normalized,
                      }));
                    } catch (e) {
                      toast.error("Failed to load counters");
                    } finally {
                      setLoadingCountersBySubcat(prev => ({
                        ...prev,
                        [subId]: false,
                      }));
                    }
                  }
                }}
              />

              )}


            {/* Counters: show only for roles that require counters */}
            {!isMIS && !isNoCounterRole && selectedSubcategories.length > 0 && (
              <>
                <button
                  onClick={() => setShowCountersArea((prev) => !prev)}
                  className="mt-3 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  {showCountersArea ? "Hide Counters" : "Show Counters"}
                </button>

                <div
                  className="mt-6 p-4 rounded-md border border-green-100 bg-green-50 transition-all"
                  style={{ display: showCountersArea ? "block" : "none" }}
                >
                  <h4 className="font-semibold text-green-700 mb-4">Select Counters (with checkboxes)</h4>

                  {selectedSubcategories.map((subId) => {
                    const subInfo = subcategories.find((s) => s.SubCategoryId === subId);
                    const countersForSub = subcatCounters[subId] || [];

                    return (
                      <div key={subId} className="mb-6">
                        <div className="font-semibold text-green-700 mb-3">{subInfo?.SubCategoryname}</div>

                        {loadingCountersBySubcat[subId] ? (
                          <div className="text-sm text-gray-500">Loading counters...</div>
                        ) : (
                          <div className="flex flex-wrap gap-3">
                            {countersForSub.length === 0 ? (
                              <div className="text-gray-600">No counters</div>
                            ) : (
                              countersForSub.map((ctr) => (
                                <label
                                  key={ctr.CounterId}
                                  className={`px-4 py-2 rounded-full border cursor-pointer select-none transition ${
                                    selectedCounterIds.includes(ctr.CounterId)
                                      ? "bg-green-600 text-white border-green-700"
                                      : "bg-white border-green-200 text-green-700 hover:bg-green-50"
                                  }`}
                                  onClick={() => {
                                    toggleCounter(ctr.CounterId);
                                  }}
                                >
                                  {ctr.Name}
                                </label>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              {editUserId ? (
                <>
                <button
                  onClick={handleUpdatePrivileges}
                  disabled={isSubmitting}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  {isSubmitting ? "Updating..." : "Update Privileges"}
                </button>

                  {/* Added Cancel Button */}
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateUserAndPrivileges}
                  disabled={isSubmitting ||isCheckingUsername ||  !isCreateFormValid}
                  className={`px-4 py-2 rounded text-white
                    ${isSubmitting || isCheckingUsername || !isCreateFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"}
                  `}
                >
                  {isSubmitting ? "Creating...": isCheckingUsername ? "Checking..." : "➕ Add User"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Registered Users */}
  <div>
  <h3 className="text-xl font-semibold text-green-800 mb-4">
    Registered Users
  </h3>

        {loadingUsers ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
    <div className="relative overflow-x-auto bg-white border border-green-200 rounded-lg">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-green-50 border-b border-green-200">
          <tr>
            <th className="px-4 py-3 w-8"></th>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Employee ID</th>
            <th className="px-6 py-3">Role</th>
            {/* <th className="px-6 py-3">Status</th> */}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const isExpanded = expandedUserId === u.UserId;

            return (
              <React.Fragment key={u.UserId}>
                {/* ================= MAIN ROW ================= */}
                <tr
                  className={`border-b cursor-pointer ${
                    isExpanded
                      ? "bg-green-50"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => toggleAccordion(u.UserId)}
                >
                  {/* Expand Icon */}
                  {/* <td className="px-4 py-3 text-green-700 font-bold">
                    {isExpanded ? "▼" : "▶"}
                  </td> */}
                  <td className="px-4 py-3">
                  <div
                    className={`flex items-center justify-center transition-transform duration-200
                      ${isExpanded ? "rotate-90 text-green-700" : "text-gray-500"}
                    `}
                  >
                    <ChevronRight size={18} />
                  </div>
                </td>


                  {/* Name */}
                  <td className="px-6 py-3 font-semibold text-green-800">
                    {u.Name}
                  </td>

                  {/* Employee ID */}
                  <td className="px-6 py-3 text-gray-600">
                    {u.EmployeeID}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-3">{u.UserType}</td>

                  {/* Status Toggle */}
                  {/* <td
                    className="px-6 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        handleToggleUserStatus(
                          u.UserId,
                          u.IsActive
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${
                          u.IsActive
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }
                      `}
                      title={
                        u.IsActive ? "Active" : "Inactive"
                      }
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${
                            u.IsActive
                              ? "translate-x-6"
                              : "translate-x-1"
                          }
                        `}
                      />
                    </button>
                  </td> */}

                  {/* Actions */}
                  <td
                    className="px-6 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-2">
                      {/* Update Password */}
                      <button
                        onClick={() => {
                          if (!u.IsActive) {
                            toast.error("Inactive users cannot update password");
                            return;
                          }

                          openPasswordEditor(u.UserId, u.Name);
                        }}
                        disabled={!u.IsActive}
                        className={`p-2 rounded transition
                          ${
                            u.IsActive
                              ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                              : "text-gray-400 cursor-not-allowed"
                          }
                        `}
                        title={
                          u.IsActive
                            ? "Update Password"
                            : "Inactive users cannot update password"
                        }
                      >
                        <Key size={16} />
                      </button>


                      {/* Edit */}
                      {/* <button
                          onClick={() => {
                            if (!u.IsActive) {
                              toast.error("Inactive users cannot be edited");
                              return;
                            }
                            openEditPrivileges(u.UserId);
                          }}
                          className={`p-2 rounded ${
                            !u.IsActive
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                          title="Edit User"
                        >
                          <Pencil size={16} />
                        </button> */}
                        {u.UserType !== "SuperAdmin" && (
                            <button
                              onClick={() => {
                                if (!u.IsActive) {
                                  toast.error("Inactive users cannot be edited");
                                  return;
                                }
                                openEditPrivileges(u.UserId);
                              }}
                              className={`p-2 rounded ${
                                !u.IsActive ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:bg-green-100"
                              }`}
                              title="Edit User"
                            >
                              <Pencil size={16} />
                            </button>
                          )}


                                                {/* Delete */}
                                                {u.UserType !== "SuperAdmin" && (
                            <button
                              onClick={() => {
                                if (!u.IsActive) {
                                  toast.error("Inactive users cannot be deleted");
                                  return;
                                }
                                handleDeleteUser(u.UserId);
                              }}
                              className={`p-2 rounded ${
                                !u.IsActive ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-100"
                              }`}
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                      {/* {u.UserType !== "SuperAdmin" && (
                    <button
                      onClick={() => {
                        if (!u.IsActive) {
                          toast.error("Inactive users cannot be deleted");
                          return;
                        }
                        handleDeleteUser(u.UserId);
                      }}
                      className={`p-2 rounded
                        ${
                          !u.IsActive
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-100"
                        }
                      `}
                      title={
                        u.IsActive
                          ? "Delete User"
                          : "Deactivate user cannot be deleted"
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  )} */}

                    </div>
                  </td>
                </tr>

                {/* ================= EXPANDED ROW ================= */}
                {isExpanded && (
                  <tr className="bg-gray-50 border-b">
                    <td colSpan={6} className="px-8 py-4">
                      {u.Categories?.length ? (
                        u.Categories.map((cat) => (
                          <div
                            key={cat.Id}
                            className="mb-4"
                          >
                            <div className="font-semibold text-green-700">
                              🏷 {cat.CategoryName}
                            </div>

                            {cat.SubCategories?.map((s) => (
                              <div
                                key={s.Id}
                                className="ml-4 mt-2"
                              >
                                <div className="font-medium">
                                  ➤ {s.SubCategoryName}
                                </div>

                                <div className="ml-4 text-gray-600">
                                  Counters:{" "}
                                  {s.Counters?.length
                                    ? s.Counters
                                        .map(
                                          (c) =>
                                            c.CounterName
                                        )
                                        .join(", ")
                                    : "None"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">
                          No privileges assigned
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

    </div>
  );
};

export default Users;
