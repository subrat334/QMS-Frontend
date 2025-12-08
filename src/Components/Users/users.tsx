// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  UserPlus,
  UserCog,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { API } from "../../services/AllApiServices";
import { USER_ROLES } from "../../constants/AllConstants"; // adjust path if needed

// -------------------- Types --------------------
type ApiUser = {
  UserId: string;
  UserType: string;
  Name: string;
  EmployeeID: string;
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

// -------------------- Component --------------------
const Users: React.FC = () => {
  // Users
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Category/Subcategory/Counter lists
  const [categories, setCategories] = useState<CategorySimple[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [subcategories, setSubcategories] = useState<SubCategorySimple[]>([]);
  const [loadingSubcats, setLoadingSubcats] = useState(false);

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

  // Privilege selections
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
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
    setSelectedCategoryId("");
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
  const toggleSubcategory = async (subId: number) => {
    const isCurrentlySelected = selectedSubcategories.includes(subId);

    if (isCurrentlySelected) {
      // deselect: remove subcategory and also remove counters that belong to it
      setSelectedSubcategories((prev) => prev.filter((p) => p !== subId));
      setSelectedCounterIds((prev) =>
        prev.filter((cid) => {
          const c = findCounterByBackendId(cid);
          return c ? c.SubCategoryId !== subId : true;
        })
      );
      setSubcatCounters((prev) => {
        const copy = { ...prev };
        delete copy[subId];
        return copy;
      });
      setLoadingCountersBySubcat((prev) => {
        const copy = { ...prev };
        delete copy[subId];
        return copy;
      });
      return;
    }

    // selecting: add and fetch counters for that subcategory
    setSelectedSubcategories((prev) => [...prev, subId]);
    setLoadingCountersBySubcat((prev) => ({ ...prev, [subId]: true }));

    try {
      // API call that you asked for: /Counter/GetCounterdetailsbycategoryid?SubCatid=<id>
      const res = await API.getCountersBySubCategoryId(subId);
      const received: any[] = res.data || [];

      const normalized = received.map((c: any) => ({
        Id: Number(c.CounterId),
        CounterId: Number(c.CounterId),
        Name: c.CounterName,

        CategoryId: typeof selectedCategoryId === "number" ? Number(selectedCategoryId) : 0,
        CategoryName:
          categories.find((cat) => cat.CategoryId === selectedCategoryId)?.Categoryname || "",

        SubCategoryId: subId,
        SubCategoryName:
          subcategories.find((sc) => sc.SubCategoryId === subId)?.SubCategoryname || "",
      })) as CounterSimple[];

      setSubcatCounters((prev) => ({ ...prev, [subId]: normalized }));
    } catch (err) {
      console.error("fetch counters for subcat:", subId, err);
      toast.error("Failed to load counters for selected subcategory");
      // if fetch failed, remove subcategory selection to keep UX consistent
      setSelectedSubcategories((prev) => prev.filter((p) => p !== subId));
    } finally {
      setLoadingCountersBySubcat((prev) => ({ ...(prev || {}), [subId]: false }));
    }
  };

  // -------------------- Role helpers & rules --------------------
  const isMIS = designation === USER_ROLES.MIS;
  const isMONITOR = designation === USER_ROLES.MONITOR;
  const isPATIENT = designation === USER_ROLES.PATIENT_SCREEN;
  const isNoCounterRole = isMONITOR || isPATIENT; // they should not have counters
  const requiresCounters = !isNoCounterRole && !isMIS; // COUNTER & SUPER_ADMIN require counters

  // -------------------- Build payload for privileges --------------------
  const buildPrivilegesPayload = (userId: string) => {
    if (!selectedCategoryId) throw new Error("Category not selected");

    const subs = selectedSubcategories.map((subId) => {
      // counters for this subcategory (only those selected by user)
      const countersForSub = selectedCounterIds
        .map((cid) => findCounterByBackendId(cid))
        .filter(Boolean)
        .filter((c) => c!.SubCategoryId === subId)
        .map((c) => ({ CounterId: Number(c!.CounterId) }));

      return {
        SubCategoryId: subId,
        Counters: isNoCounterRole ? [] : countersForSub,
      };
    });

    return {
      UserId: userId,
      CategoryId: selectedCategoryId,
      SubCategories: subs,
    };
  };

  // -------------------- Create user + privileges --------------------
  const handleCreateUserAndPrivileges = async () => {
    // validate
    if (!name.trim() || !employeeId.trim() || !password.trim()) {
      toast.error("Please fill Name, Employee ID and Password");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Privilege validations only for non-MIS
    if (!isMIS) {
      if (!selectedCategoryId) {
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

    setIsSubmitting(true);
    try {
      // 1) create user
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
        setIsSubmitting(false);
        return;
      }

      // 2) create privileges - SKIP for MIS
      if (!isMIS) {
        const privilPayload = buildPrivilegesPayload(newUserId);
        await API.createUserPrivilege(privilPayload);
      }

      toast.success(isMIS ? "MIS user created" : "User created and privileges assigned");
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
  // Basic fields required for all roles
  if (!name.trim() || !employeeId.trim() || !password.trim() || !confirmPassword.trim()) {
    return false;
  }
  if (password !== confirmPassword) return false;

  // MIS requires no privileges
  if (isMIS) return true;

  // MONITOR & PATIENT_SCREEN require category + subcategories only
  if (isNoCounterRole) {
    return selectedCategoryId !== "" && selectedSubcategories.length > 0;
  }

  // COUNTER (and any role that requires counters) require category + subcategories + counters
  if (requiresCounters) {
    return (
      selectedCategoryId !== "" &&
      selectedSubcategories.length > 0 &&
      selectedCounterIds.length > 0
    );
  }

  // Fallback
  return true;
})();



  // -------------------- Update privileges for existing user --------------------
  const handleUpdatePrivileges = async () => {
    if (!editUserId) {
      toast.error("No user selected for update");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Select a category for privileges");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPrivilegesPayload(editUserId);
      await API.updateUserPrivilege(payload);
      toast.success("Privileges updated");
      resetForm();
      await loadUsers();
    } catch (err: any) {
      console.error("updatePrivileges:", err);
      toast.error(err?.response?.data || "Failed to update privileges");
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

      // prefill top-level info (name / employee / designation)
      setName(d.Name || "");
      setEmployeeId(d.EmployeeID || "");
      // map user type to numeric
      const ut = String(d.UserType || "").toLowerCase();
      if (ut.includes("mis")) setDesignation(USER_ROLES.MIS);
      else if (ut.includes("monitor")) setDesignation(USER_ROLES.MONITOR);
      else if (ut.includes("patient")) setDesignation(USER_ROLES.PATIENT_SCREEN);
      // else if (ut.includes("super")) setDesignation(USER_ROLES.SUPER_ADMIN);
      else setDesignation(USER_ROLES.COUNTER);

      setEditUserId(d.UserId);
      setPasswordEditMode(false);
      setPasswordEditUserId(null);

      // Prefill privilege selections; backend returns Categories array (we assume first category is primary)
      const firstCat = Array.isArray(d.Categories) && d.Categories[0];
      if (firstCat) {
        const catIdNum = Number(firstCat.CategoryId);
        setSelectedCategoryId(catIdNum);

        const subIds: number[] =
          (firstCat.SubCategories || []).map((s: any) => Number(s.SubCategoryId)) || [];
        setSelectedSubcategories(subIds);

        const flatCounterIds: number[] = [];
        (firstCat.SubCategories || []).forEach((s: any) => {
          (s.Counters || []).forEach((c: any) => {
            flatCounterIds.push(Number(c.CounterId));
          });
        });
        setSelectedCounterIds(flatCounterIds);

        // For better UX, fetch counters for these subcats and populate subcatCounters so UI can show them
        for (const sid of subIds) {
          try {
            setLoadingCountersBySubcat((prev) => ({ ...(prev || {}), [sid]: true }));
            const resC = await API.getCountersBySubCategoryId(sid);
            const received: any[] = resC.data || [];

            const normalized = received.map((c: any) => ({
              Id: Number(c.CounterId),
              CounterId: Number(c.CounterId),
              Name: c.CounterName,
              CategoryId: Number(firstCat.CategoryId),
              CategoryName: firstCat.CategoryName || "",
              SubCategoryId: sid,
              SubCategoryName:
                (firstCat.SubCategories || []).find((s: any) => Number(s.SubCategoryId) === sid)
                  ?.SubCategoryName || "",
            }));

            setSubcatCounters((prev) => ({ ...prev, [sid]: normalized }));
          } catch (err) {
            console.warn("prefetch counters for edit failed:", sid, err);
          } finally {
            setLoadingCountersBySubcat((prev) => ({ ...(prev || {}), [sid]: false }));
          }
        }
      } else {
        setSelectedCategoryId("");
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
  disabled={isEditMode}
  onChange={(e) => handleNameChange(e.target.value)}
  placeholder="Enter name"
  className={`w-full border rounded-md px-3 py-2 focus:ring-2 
    ${isEditMode ? "bg-gray-100 cursor-not-allowed" : "border-green-200 focus:ring-green-500"}
  `}
/>

              </div>

              {/* Employee ID */}
              <div>
                <label className="block mb-1 font-medium text-green-800">Employee ID</label>
               <input
  type="text"
  value={employeeId}
  disabled={isEditMode}
  onChange={(e) => handleEmployeeIdChange(e.target.value)}
  placeholder="Enter employee id"
  className={`w-full border rounded-md px-3 py-2 focus:ring-2 
    ${isEditMode ? "bg-gray-100 cursor-not-allowed" : "border-green-200 focus:ring-green-500"}
  `}
/>

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
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
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
    setSelectedCategoryId("");
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
              {!isMIS && (
                <div>
                  <label className="block mb-1 font-medium text-green-800">Select Category</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : "";
                      setSelectedCategoryId(val);
                      // reset subcat/counter selections for new category
                      setSelectedSubcategories([]);
                      setSelectedCounterIds([]);
                      setSubcatCounters({});
                      setLoadingCountersBySubcat({});
                    }}
                    className="w-full border border-green-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select Category --</option>
                    {loadingCategories ? (
                      <option>Loading...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.CategoryId} value={c.CategoryId}>
                          {c.Categoryname}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Subcategory multi-select */}
            {!isMIS && selectedCategoryId && (
              <div className="mt-4">
                <label className="block mb-2 font-medium text-green-800">
                  Select Subcategories (multiple)
                </label>

                <div className="flex flex-wrap gap-3">
                  {loadingSubcats ? (
                    <div className="text-gray-500">Loading subcategories...</div>
                  ) : (
                    subcategories
                      .filter((s) => s.CategoryId === selectedCategoryId)
                      .map((s) => (
                        <label
                          key={s.SubCategoryId}
                          className={`px-4 py-2 rounded-full border cursor-pointer transition select-none ${
                            selectedSubcategories.includes(s.SubCategoryId)
                              ? "bg-green-600 text-white border-green-700"
                              : "bg-white border-green-200 text-green-700 hover:bg-green-50"
                          }`}
                          onClick={() => toggleSubcategory(s.SubCategoryId)}
                        >
                          {s.SubCategoryname}
                        </label>
                      ))
                  )}
                </div>
              </div>
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
                <button
                  onClick={handleUpdatePrivileges}
                  disabled={isSubmitting}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  {isSubmitting ? "Updating..." : "Update Privileges"}
                </button>
              ) : (
                <button
                  onClick={handleCreateUserAndPrivileges}
                  disabled={isSubmitting || !isCreateFormValid}
                  className={`px-4 py-2 rounded text-white
                    ${isSubmitting || !isCreateFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"}
                  `}
                >
                  {isSubmitting ? "Creating..." : "➕ Add User"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Registered Users */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-4">Registered Users</h3>

        {loadingUsers ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u, index) => (
              <div
                key={u.UserId || index}
                className="bg-white border border-green-200 rounded-xl shadow-md hover:shadow-lg transition-all p-4"
              >
                {/* Edit/Delete buttons (top-right) */}
                <div className="flex justify-end space-x-2 mb-2">
                  <button
                    onClick={() => openEditPrivileges(u.UserId)}
                    className="p-2 rounded-lg text-green-600 hover:text-green-800 hover:bg-green-50 transition-all duration-200"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* <button
                    onClick={() => handleDeleteUser(u.UserId)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button> */}
                  {u.UserType !== "SuperAdmin" && (
                    <button
                      onClick={() => handleDeleteUser(u.UserId)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                </div>

                {/* Center Content (avatar + name + type) */}
                <div className="flex flex-col items-center text-center">
                  <img
                    className="w-20 h-20 mb-3 rounded-full shadow-md"
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="User"
                  />

                  <h5 className="text-lg font-semibold text-green-800">{u.Name}</h5>
                  <p className="text-sm text-green-700">{u.UserType}</p>

                  <p className="text-sm text-gray-600 mt-3">
                    🆔 Employee ID: <span className="text-green-700">{u.EmployeeID}</span>
                  </p>

                  {/* Categories + Subcategories + Counters */}
                  <div className="text-sm text-gray-700 mt-3">
                    {u.Categories?.map((cat) => (
                      <div key={cat.Id} className="mt-2">
                        🏷️ <span className="font-medium text-green-700">{cat.CategoryName}</span>

                        {cat.SubCategories?.map((s) => (
                          <div key={s.Id} className="ml-2 mt-1">
                            → {s.SubCategoryName}
                            <div className="text-xs text-gray-500 ml-4">
                              💠 Counters: {s.Counters?.map((c) => c.CounterName).join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Update Password bottom-right */}
                  <div className="mt-4 flex justify-end w-full">
                    <span
                      onClick={() => openPasswordEditor(u.UserId,u.Name)}
                      className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    >
                      Update Password
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
