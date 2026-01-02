
import { useEffect, useMemo, useState, useRef } from "react";
import { API } from "../../services/AllApiServices";
// import { useAuth } from "../../context/AuthContext";
import { TOKEN_STATUS } from "../../constants/AllConstants";
import { SIGNALR_URLS } from "../../constants/AllConstants";

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

  type SelectedToken = {
    Token: string;
    CategoryId: number;
    SubCategoryId: number;
    CounterId: number;
  };

const $ = (window as any).jQuery;

const ManageTokens = () => {
  console.log("[COMPONENT] ManageTokens mounted");

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedCounter, setSelectedCounter] = useState<string>("");

  const [calledTokens, setCalledTokens] = useState<number[]>([]);
  const [tokenData, setTokenData] = useState<TokenItem[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false);

  // const { user, privileges, ensurePrivilegesForUser } = useAuth();
  const [categories, setCategories] = useState<RawCategory[]>([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [cancelError, setCancelError] = useState("");
  // const [selectedToken, setSelectedToken] = useState(null);
  const [selectedToken, setSelectedToken] =useState<SelectedToken | null>(null);


  const counterRef = useRef(selectedCounter);

  const normalizeStatus = (status: string) => {
  switch (status.trim().toUpperCase()) {
    case "WAIT A WHILE":
      return "Wait a while";
    case "CALLING":
      return "CALLING";
    case "IN PROGRESS":
      return "IN PROGRESS";
    case "HOLD":
      return "HOLD";
    case "CANCELLED":
    case "CANCEL":
      return "Cancelled";
    case "DONE":
      return "DONE";
    default:
      return "Wait a while";
  }
};
  
  const handleConfirmCancel = async () => {
    if (!selectedToken) return;

    if (!cancelRemarks.trim()) {
      setCancelError("Remarks is required to cancel the token");
      return;
    }

    try {
      // Call API to update status
      await API.updateTokenStatus({
        CategoryId: selectedToken.CategoryId,
        SubCategoryId: selectedToken.SubCategoryId,
        // CounterId: selectedToken.CounterId,
        CounterId: Number(selectedCounter),
        Token: selectedToken.Token,
        StatusId: 4, // Assuming 4 = Cancelled
        Remarks: cancelRemarks
      });

      // Update the token in frontend to "Cancelled"
      setTokenData((prev) =>
        prev.map((t) =>
          t.number === selectedToken.Token ? { ...t, status: "Cancelled" } : t
        )
      );

      // Close modal and reset remarks
      setShowCancelPopup(false);
      setCancelRemarks("");

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("[USE EFFECT] selectedCounter changed:", selectedCounter);
    counterRef.current = selectedCounter;
  }, [selectedCounter]);

  // ------------------------------------------
  // LOAD PRIVILEGES
  // ------------------------------------------
  // useEffect(() => {
  //   console.log("[USE EFFECT] Loading privileges...");

  //   const loadPrivileges = async () => {
  //     console.log("[PRIVILEGES] loadPrivileges started");
  //     setLoadingPrivileges(true);

  //     if (privileges?.categories?.length) {
  //       console.log("[PRIVILEGES] Using privileges from context");
  //       setCategories(privileges.categories as RawCategory[]);
  //     } else if (user) {
  //       console.log("[PRIVILEGES] Fetching privileges for user:", user.id);
  //       await ensurePrivilegesForUser(user.id);

  //       const stored = localStorage.getItem("UserPrivileges");
  //       if (stored) {
  //         try {
  //           console.log("[PRIVILEGES] Loaded privileges from localStorage");
  //           const p = JSON.parse(stored);
  //           setCategories(p.categories || []);
  //         } catch {
  //           console.log("[PRIVILEGES] Failed parsing stored privileges");
  //           setCategories([]);
  //         }
  //       }
  //     }

  //     setLoadingPrivileges(false);
  //     console.log("[PRIVILEGES] loadPrivileges finished");
  //   };

  //   loadPrivileges();
  // }, [user, privileges, ensurePrivilegesForUser]);

  useEffect(() => {
  const loadCategories = async () => {
    try {
      setLoadingPrivileges(true);
 
      const user = JSON.parse(localStorage.getItem("AppUser") || "{}");
      if (!user?.id) {
        setCategories([]);
        return;
      }
 
      const res = await API.getUserPrivilegesById(user.id);
      const categoriesFromApi = res.data?.Categories || [];
 
      setCategories(categoriesFromApi);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    } finally {
      setLoadingPrivileges(false);
    }
  };
 
  loadCategories();
}, []);

  // ------------------------------------------
  // FILTERS → SUBCATEGORIES + COUNTERS
  // ------------------------------------------
  const subcategories = useMemo(() => {
    console.log("[MEMO] Calculating subcategories for:", selectedCategory);
    const cat = categories.find((c) => c.CategoryId === selectedCategory);
    return cat?.SubCategories || [];
  }, [categories, selectedCategory]);

  const counters = useMemo(() => {
    console.log("[MEMO] Calculating counters for:", selectedSubcategory);
    const sub = subcategories.find(
      (s) => s.SubCategoryId === selectedSubcategory
    );
    return sub?.Counters || [];
  }, [subcategories, selectedSubcategory]);

  // ------------------------------------------
  // FETCH TOKENS API
  // ------------------------------------------
  const fetchTokens = async () => {
    console.log("[API] fetchTokens called");
    console.log("[API] Selected:", {
      selectedCategory,
      selectedSubcategory,
      selectedCounter,
    });

    if (!selectedCategory || !selectedSubcategory || !selectedCounter) {
      console.log("[API] Missing filter → Clearing tokens");
      setTokenData([]);
      return;
    }

    setLoadingTokens(true);

    try {
      console.log("[API] Calling getTokensByFilter...");
      const res = await API.getTokensByFilter(
        selectedCategory,
        selectedSubcategory,
        selectedCounter,
        1,
        50
      );

      console.log("[API] Token API Response:", res.data);

      const tokensFromServer = res.data?.Tokens || [];

      console.log("[API] Mapping tokens...");
      const mapped: TokenItem[] = tokensFromServer.map((t: any) => {
        console.log("[API] Mapping token:", t);

        let statusText = "Wait a while";

        if (t.Status === TOKEN_STATUS.CALL) statusText = "CALLING";
        else if (t.Status === TOKEN_STATUS.INPROGRESS) statusText = "WAIT A WHILE";
        else if (t.Status === TOKEN_STATUS.HOLD) statusText = "HOLD";
        else if (t.Status === TOKEN_STATUS.RECALL) statusText = "CALLING";
        else if (t.Status === TOKEN_STATUS.CANCEL) statusText = "Cancelled";
        else if (t.Status === TOKEN_STATUS.DONE) statusText = "DONE";

        return {
          id: t.Id,
          number: t.Token,
          categoryId: String(t.CategoryId),
          category: t.CategoryName,
          subcategoryId: String(t.SubCategoryId),
          subcategory: t.SubCategoryName,
          counterId: String(t.CounterId),
          status: normalizeStatus(statusText),
          hold: t.StatusId === TOKEN_STATUS.HOLD,
          mobile: t.MobileNumber,
          createdOn: t.CreatedOn,
        };
      });

      setTokenData(mapped);
      console.log("[API] Tokens mapped & updated:", mapped);
    } catch (err) {
      console.error("[API ERROR] fetchTokens:", err);
      setTokenData([]);
    } finally {
      setLoadingTokens(false);
      console.log("[API] fetchTokens finished");
    }
  };

  useEffect(() => {
    console.log("[USE EFFECT] Filters changed → Fetch tokens");
    fetchTokens();
  }, [selectedCategory, selectedSubcategory, selectedCounter]);

  // ------------------------------------------
  // SIGNALR INTEGRATION
  // ------------------------------------------
useEffect(() => {
  console.log("[SIGNALR] Setup effect triggered");
  if (!counterRef.current || !selectedSubcategory) {
    console.log("[SIGNALR] Missing counter/subcategory. Aborting listener setup.");
    return;
  }

  console.log("[SIGNALR] Creating hub connection...");
 const CURRENT_SIGNALR_URL = SIGNALR_URLS.LOCAL;   // or SIGNALR_URLS.LIVE

  const connection = ($ as any).hubConnection(
  CURRENT_SIGNALR_URL,
    { useDefaultPath: false }
  );
  const hub = connection.createHubProxy("notificationHub");

  // NEW TOKENS
  hub.on("receiveToken", (data: any) => {
    console.log("[SIGNALR] receiveToken RAW:", data);

    const tokenPayload = Array.isArray(data) ? data[0] : data;
    console.log("[SIGNALR] receiveToken parsed:", tokenPayload);

    if (!tokenPayload || tokenPayload.RefreshDisplay || !tokenPayload.Token) {
      console.log("[SIGNALR] Invalid receiveToken payload");
      return;
    }

    if (String(tokenPayload.SubCategoryId) !== String(selectedSubcategory)) {
      console.log("[SIGNALR] Token belongs to different subcategory. Ignored.");
      return;
    }

    const newToken: TokenItem = {
      id: Date.now(),
      type: "Regular",
      number: tokenPayload.Token,
      categoryId: String(tokenPayload.CategoryId),
      category: tokenPayload.CategoryName,
      subcategoryId: String(tokenPayload.SubCategoryId),
      subcategory: tokenPayload.SubCategoryName,
      counter: tokenPayload.CounterName || "",
      status: "Wait a while",
      hold: false,
    };

    console.log("[SIGNALR] Adding new token:", newToken);

    setTokenData((prev) =>
      prev.some((t) => t.number === newToken.number)
        ? (console.log("[SIGNALR] Token already exists → ignored"), prev)
        : [...prev, newToken]
    );
  });

  // STATUS UPDATE
 hub.on("receiveTokenStatus", (data: any) => {
  const tokenStatus = data?.A ? data.A[0] : data;
  if (!tokenStatus?.Token) return;

setTokenData((prev) => {
  return prev
    .map((t) => {
      if (t.number !== tokenStatus.Token) return t;

      let newStatus = t.status;

      if (tokenStatus.StatusId === TOKEN_STATUS.PENDING)
        newStatus = "WAIT A WHILE";
      else if (tokenStatus.StatusId === TOKEN_STATUS.CALL)
        newStatus = "CALLING";
      else if (tokenStatus.StatusId === TOKEN_STATUS.INPROGRESS)
        newStatus = "IN PROGRESS";
      else if (tokenStatus.StatusId === TOKEN_STATUS.HOLD)
        newStatus = "HOLD";
      else if (tokenStatus.StatusId === TOKEN_STATUS.RECALL)
        newStatus = "CALLING";
      else if (tokenStatus.StatusId === TOKEN_STATUS.CANCEL)
        newStatus = "Cancelled";
      else if (tokenStatus.StatusId === TOKEN_STATUS.DONE)
        newStatus = "DONE";

      const normalizedStatus = normalizeStatus(newStatus); // ✅ KEY FIX

      return {
        ...t,
        status: normalizedStatus,
        counterId: String(tokenStatus.CounterId),
        hold: tokenStatus.StatusId === TOKEN_STATUS.HOLD,
      };
    })
    .filter((t) => {
      //  Remove DONE tokens
      if (t.status === "DONE") return false;

      //  Remove token from other counters when CALLING / IN PROGRESS
      if (
        (t.status === "CALLING" || t.status === "IN PROGRESS") &&
        t.counterId !== String(selectedCounter)
      ) {
        return false;
      }

      return true;
    });
});
});

// });


  // START CONNECTION
  connection
    .start()
    .done(() => {
      console.log("[SIGNALR] Connection started");
      hub.invoke("JoinCounterGroup", Number(counterRef.current));
      hub.invoke("JoinSubCategoryGroup", Number(selectedSubcategory));
      console.log("[SIGNALR] Joined groups:", {
        counter: counterRef.current,
        subcategory: selectedSubcategory,
      });
    })
    .fail((err: any) => {
      console.error("[SIGNALR ERROR] Connection failed:", err);
    });

  return () => {
    console.log("[SIGNALR] Stopping connection on cleanup...");
    connection.stop();
  };
}, [selectedSubcategory, selectedCounter]);


  // ------------------------------------------
  // SEND STATUS UPDATE
  // ------------------------------------------
  const sendTokenStatusUpdate = async (
    token: TokenItem,
    action: keyof typeof TOKEN_STATUS
  ) => {
    console.log("[SEND STATUS] Called:", { token, action });

    const payload = {
      CategoryId: Number(token.categoryId),
      SubCategoryId: Number(token.subcategoryId),
      CounterId: Number(selectedCounter),
      Token: token.number,
      StatusId: TOKEN_STATUS[action],
      Remarks: "",
    };

    console.log("[SEND STATUS] Payload:", payload);

    try {
      const res = await API.updateTokenStatus(payload);
      console.log("[SEND STATUS] API success:", res.data);
    } catch (err) {
      console.error("[SEND STATUS ERROR] Failed:", err);
    }
  };

  // ------------------------------------------
  // BUTTON HANDLERS
  // ------------------------------------------
  const handleCallPatient = async (id: number) => {
    console.log("[HANDLE CALL] Triggered for ID:", id);
  //  Check if another token is already CALLING
  const alreadyCalling = tokenData.some(
    (t) => t.status === "CALLING" && t.id !== id
  );

  if (alreadyCalling) {
    alert(
      "A token is already in CALLING state. Please Hold or Cancel it before calling another token."
    );
    return;
  }

    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

  // Send CALL status to backend
  await sendTokenStatusUpdate(token, "CALL");

  // Optimistic UI update
  setTokenData((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, status: "CALLING" } : t
    )
  );

    if (!calledTokens.includes(id)) {
      setCalledTokens((prev) => [...prev, id]);
    }
  };


      const handleStart = async (id: number) => {
      const token = tokenData.find(t => t.id === id);
      if (!token) return;

      await sendTokenStatusUpdate(token, "INPROGRESS");

      setTokenData(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, status: "IN PROGRESS" }
            : t
        )
      );
    };


  const handleHold = async (id: number) => {
    console.log("[HANDLE HOLD] Token ID:", id);

    const token = tokenData.find((t) => t.id === id);
    console.log("[HANDLE HOLD] Found token:", token);
    if (!token) return;

    await sendTokenStatusUpdate(token, "HOLD");

    setTokenData((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "HOLD", hold: true } : t
      )
    );
    console.log("[HANDLE HOLD] Token updated to HOLD");
  };
  ;

  const handleRecall = async (id: number) => {
    console.log("[HANDLE RECALL] ID:", id);

    const token = tokenData.find((t) => t.id === id);
    if (!token) return;

    await sendTokenStatusUpdate(token, "RECALL");

    setTokenData((prev) =>
      prev.map((t) =>t.id === id ? { ...t, status: "CALLING", hold: false } : t
      )
    );
};
;

  const handleCancelClick = (token: TokenItem) => {
    setSelectedToken({
      Token: token.number,
      CategoryId: Number(token.categoryId),
      SubCategoryId: Number(token.subcategoryId),
      CounterId: Number(token.counterId),
    });

    setCancelRemarks("");
    setCancelError("");
    setShowCancelPopup(true);
  };

  const handleProcessDone = async (id: number) => {
    console.log("[HANDLE DONE] ID:", id);

    const token = tokenData.find((t) => t.id === id);
    console.log("[HANDLE DONE] Found:", token);
    if (!token) return;

    await sendTokenStatusUpdate(token, "DONE");

    setTokenData((prev) => prev.filter((t) => t.id !== id));
    setCalledTokens((prev) => prev.filter((t) => t !== id));

    console.log("[HANDLE DONE] Token removed from list");
  };

  const clearFilters = () => {
    console.log("[CLEAR FILTERS] Resetting all filters");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCounter("");
    setTokenData([]);
  };

  const canShowTable =
    selectedCategory && selectedSubcategory && selectedCounter;

//     const isAnotherTokenActive = tokenData.some(
//   t => t.status === "CALLING" || t.status === "IN PROGRESS"
// );
  // ------------------------------------------
  // UI
  // ------------------------------------------
  console.log("[RENDER] Rendering UI");

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex flex-col items-center py-10">
      <div className="w-11/12 max-w-6xl animate-fadeIn">
        
        {/* FILTER SECTION */}
        <div className="bg-white p-4 rounded-xl shadow mb-4 border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Filter Tokens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedCategory}
                onChange={(e) => {
                  console.log("[UI] Category changed:", e.target.value);
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

            <div>
              <label className="font-semibold text-gray-700">Subcategory</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedSubcategory}
                onChange={(e) => {
                  console.log("[UI] Subcategory changed:", e.target.value);
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

            <div>
              <label className="font-semibold text-gray-700">Counter</label>
              <select
                className="w-full border border-green-500 rounded px-2 py-1 mt-1"
                value={selectedCounter}
                onChange={(e) => {
                  console.log("[UI] Counter changed:", e.target.value);
                  setSelectedCounter(e.target.value);
                }}
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
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Subcategory</th>
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
                      <tr key={token.id} className="hover:bg-green-50 transition-all">
                        <td className="px-4 py-3 border-t">{index + 1}</td>
                        <td className="px-4 py-3 border-t">{token.category}</td>
                        <td className="px-4 py-3 border-t">{token.subcategory}</td>
                        <td className="px-4 py-3 border-t">{token.number}</td>
                        <td className="px-4 py-3 border-t">{token.status}</td>

                        {/* ACTIONS COLUMN */}
                        <td className="px-4 py-3 border-t">

                            {/* Cancelled */}
                          {token.status === "Cancelled" && (
                            <span className="text-red-600">Cancelled</span>
                          )}

                          {/* HOLD */}
                          {token.status === "HOLD" && (
                            <div className="flex gap-2">
                              <button
                                className="bg-purple-600 text-white px-3 py-1 rounded"
                                onClick={() => handleRecall(token.id)}
                              >
                                RE-Call
                              </button>

                              <button
                                className="bg-red-600 text-white px-3 py-1 rounded"
                               onClick={() => handleCancelClick(token)}
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

                            {/* CALLING */}
                            {token.status === "CALLING" && (
                              <div className="flex gap-2">
                                <button
                                  className="bg-blue-700 text-white px-3 py-1 rounded"
                                  onClick={() => handleStart(token.id)}
                                >
                                  Start
                                </button>

                                <button
                                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                                  onClick={() => handleHold(token.id)}
                                >
                                  Hold
                                </button>

                                <button
                                  className="bg-red-600 text-white px-3 py-1 rounded"
                                  onClick={() => handleCancelClick(token)}
                                >
                                  Cancel
                                </button>

                                <button
                                  className="bg-green-600 text-white px-3 py-1 rounded"
                                  onClick={() => handleProcessDone(token.id)}
                                >
                                  Done
                                </button>
                              </div>
                            )}

                            {/* IN PROGRESS */}
                          {token.status === "IN PROGRESS" && (
                            <div className="flex gap-2">
                              <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                onClick={() => handleHold(token.id)}
                              >
                                Hold
                              </button>

                              <button
                                className="bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => handleCancelClick(token)
}
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

                            {/* PENDING */}
                        
                         {token.status === "Wait a while" && (
                          <button
                            onClick={() => handleCallPatient(token.id)}
                            disabled={tokenData.some(t => t.status === "CALLING" || t.status === "IN PROGRESS")}
                            className={`px-3 py-1 rounded ${
                              tokenData.some(t => t.status === "CALLING" || t.status === "IN PROGRESS")
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-700 text-white"
                            }`}
                          >
                            Call
                          </button>
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
  
    {showCancelPopup && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl p-5 w-[380px]">
      <h2 className="text-lg font-semibold mb-3 text-red-600">
        Cancel Token Confirmation
      </h2>

      <p className="text-sm mb-3">
        Are you sure you want to cancel Token: 
        <b> {selectedToken?.Token}</b> ?
      </p>

      <label className="text-sm font-medium">Remarks (Required)</label>
      <textarea
        value={cancelRemarks}
        onChange={(e) => setCancelRemarks(e.target.value)}
        className="w-full border rounded-md p-2 mt-1"
        rows={3}
        placeholder="Enter reason for cancellation"
      />

      {cancelError && (
        <p className="text-red-600 text-xs mt-1">{cancelError}</p>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowCancelPopup(false)}
          className="px-3 py-1 rounded bg-gray-300"
        >
          Close
        </button>

        <button
          onClick={handleConfirmCancel}
          className="px-3 py-1 rounded bg-red-600 text-white"
        >
          Confirm Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ManageTokens;

