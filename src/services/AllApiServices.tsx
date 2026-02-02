
// import api from "./api";

// export const API = {
//   // ---------- CATEGORY ----------
//   addOrEditCategory: (data: {
//     CategoryId?: number;
//     Categoryname: string;
//     CategoryDescription?: string;
//   }) => api.post("/Category/addcategory", data),

//   getAllCategories: () => api.get("/Category/GetCategory"),

//   getCategoryById: (id: number) =>
//     api.get(`/Category/getcategoryDetailsbyid?categoryId=${id}`),

//   deleteCategory: (id: number) =>
//     api.post(`/Category/deleteCategory?Id=${id}`),

//   // ---------- SUBCATEGORY ----------
//   addOrEditSubCategory: (data: {
//     Id?: number;
//     CategoryId: number;
//     Name: string;
//     SubCategoryDescription?: string;
//   }) => api.post("/Category/addSubcategory", data),

//   deleteSubCategory: (id: number) =>
//     api.post(`/Category/deletesubCategory?id=${id}`),

//   getAllSubCategories: () => api.get("/Category/getsubcategoryall"),

//   getSubCategoryById: (id: number) =>
//     api.get(`/Category/getSubcategorybyid?id=${id}`),

// // COUNTER APIs

//   // ADD / UPDATE Counter
//   addOrEditCounter: (data: {
//     Id?: number;
//     Name: string;
//     CategoryId: number;
//     SubCategoryId: number;
//     SubCategoryDescription?: string;
//   }) => api.post("/Counter/addCounter", data),

//   // GET ALL Counters
//   getAllCounters: () => api.get("/Counter/GetCounter"),

//   // GET Counter by ID
//   getCounterById: (id: number) =>
//     api.get(`/Counter/GetCounterDetailsById?CounterId=${id}`),

//   // DELETE Counter
//   deleteCounter: (id: number) => api.post(`/Counter/DeleteCounter?Id=${id}`),
// };


import api from "./api";

export const API = {
  // -------------------------------------------------------
  // CATEGORY
  // -------------------------------------------------------
  addOrEditCategory: (data: {
    CategoryId?: number;
    Categoryname: string;
    CategoryDescription?: string;
  }) => api.post("/Category/addcategory", data),

  getAllCategories: () => api.get("/Category/GetCategory"),

  getCategoryById: (id: number) =>
    api.get(`/Category/getcategoryDetailsbyid?categoryId=${id}`),

  deleteCategory: (id: number) =>
    api.post(`/Category/deleteCategory?Id=${id}`),

  // -------------------------------------------------------
  // SUBCATEGORY
  // -------------------------------------------------------
  addOrEditSubCategory: (data: {
    Id?: number;
    CategoryId: number;
    Name: string;
    SubCategoryDescription?: string;
  }) => api.post("/Category/addSubcategory", data),

  deleteSubCategory: (id: number) =>
    api.post(`/Category/deletesubCategory?id=${id}`),

  getAllSubCategories: () => api.get("/Category/getsubcategoryall"),

  getSubCategoryById: (id: number) =>
    api.get(`/Category/getSubcategorybyid?id=${id}`),

  // ⭐ NEW — Subcategories by Category ID (from A)
  getSubCategoriesByCategoryId: (catId: number) =>
    api.get(`/Category/getsubcategorydetailsbycategoryid?catid=${catId}`),

  // -------------------------------------------------------
  // COUNTER
  // -------------------------------------------------------
  addOrEditCounter: (data: {
    Id?: number;
    Name: string;
    CategoryId: number;
    SubCategoryId: number;
    Description?: string;
    SubCategoryDescription?: string; // (from B)
  }) => api.post("/Counter/addCounter", data),

  getAllCounters: () => api.get("/Counter/GetCounter"),

  getCounterById: (id: number) =>
    api.get(`/Counter/GetCounterDetailsById?CounterId=${id}`),

  deleteCounter: (id: number) =>
    api.post(`/Counter/DeleteCounter?Id=${id}`),

  // -------------------------------------------------------
  // TOKEN CONFIGURATION (from A)
  // -------------------------------------------------------
  saveTokenConfig: (data: {
    // Id: number;
    CategoryId: number;
    SubCategoryId: number;
    Prefix: string;
    InitializeNo: string;
    // CurrentNo: string;
    ResetTypeId: number;
    // LastResetDate: string;
  }) => api.post("/Account/TokenPrefix/Create", data),

  // -------------------------------------------------------
  // PATIENT TOKEN GENERATION (A)
  // -------------------------------------------------------
  generateToken: (data: {
    CategoryId: number;
    SubCategoryId: number;
    MobileNumber: string;
    DeliveryMethod: string;
  }) => api.post("/Patient/generateToken", data),

  // -------------------------------------------------------
  // ACCOUNT / USER (from B)
  // -------------------------------------------------------
  createUser: (data: {
    FirstName: string;
    UserType: number;
    Username: string;
    Password: string;
    EmployeeID: string;
  }) => api.post("/Account/createuser", data),

  createUserPrivilege: (data: any) =>
    api.post("/Account/UserPrevilege/create", data),

  updateUserPrivilege: (data: any) =>
    api.post("/Account/UserPrevilege/update", data),

  getAllUsersWithPrivileges: () =>
    api.get("/Account/UserPrevilege/all"),

  getUserPrivilegesById: (userId: string) =>
    api.get(`/Account/UserPrevilege/get/${userId}?userId=${userId}`),

  deleteUserPrivilege: (userId: string) =>
    api.post(`/Account/deleteUserPrevilege/${userId}`),
  // GET counters by SubCategoryId
getCountersBySubCategoryId: (subCatId: number) =>
  api.get(`/Counter/GetCounterdetailsbycategoryid?SubCatid=${subCatId}`),

updateUserPassword: (userId: string, password: string) =>
  api.post(`/Account/UpdatePassword?UserId=${userId}&password=${password}`),
// getTokensByFilter: (
//   categoryId: string,
//   subcategoryId: string,
//   pageIndex: number = 1,
//   pageSize: number = 20
// ) =>
//   api.get(
//     `/Counter/GetPagedTokens?categoryId=${encodeURIComponent(
//       categoryId
//     )}&subCategoryId=${encodeURIComponent(
//       subcategoryId
//     )}&pageIndex=${pageIndex}&pageSize=${pageSize}`
//   ),

getTokensByFilter: (
  categoryId: string,
  subcategoryId: string,
  counterId: string,
  pageIndex: number = 1,
  pageSize: number = 50
) =>
  api.get(
    `/Counter/GetPagedTokens?categoryId=${encodeURIComponent(
      categoryId
    )}&subCategoryId=${encodeURIComponent(
      subcategoryId
    )}&counterId=${encodeURIComponent(
      counterId
    )}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  ),

// -------------------------------------------------------
// DISPLAY / MONITOR
// -------------------------------------------------------
getDisplayScreenByCategoryAndSubCategory: (
  categoryId: number,
  subCategoryId: number
) =>
  api.get(
    `/Display/screen?categoryId=${categoryId}&subCategoryId=${subCategoryId}`
  ),
// NEW STATUS UPDATE API
// -------------------------------------------------------
updateTokenStatus: (data: {
   TokenQueueId: number; // ✅ NEW
  CategoryId: number;
  SubCategoryId: number;
  CounterId: number;
  Token: string;
  StatusId: number;
  Remarks: string;
}) => api.post("/Counter/AddTokenVisitDetails", data),


getTokenPrefixSeries: (categoryId: number, subCategoryId: number) =>
  api.get(`/Account/GetTokenPrefixSeries?categoryId=${categoryId}&subCategoryId=${subCategoryId}`),
// -------------------------------------------------------
// USER ACTIVE / INACTIVE
// -------------------------------------------------------
updateUserActiveStatus: (userId: string, isActive: boolean) =>
  api.post(
    `/Account/UpdateUserActive?UserId=${userId}&IsActive=${isActive}`
  ),
  updateNormalUserDetails: (data: {
  UserId: string;
  FirstName: string;
  UserType: number;
  EmployeeID: string;
}) =>
  api.post("/Account/UpdateNormalUserDetails", data),

  getReportByUser: (params: {
  UserId: string;
  UserName: string;
  Category: string;
  SubCategory: string;
  Numbers?: number;
  StartDate?: string;
  EndDate?: string;
  pageNumber?: number;
  pageSize?: number;
  
}) =>
  api.get("/Report/getReportByUser", {
    params: {
      UserId: params.UserId,
      UserName: params.UserName,
      Category: params.Category,
      SubCategory: params.SubCategory,
      Numbers: params.Numbers ?? 0,

      //  map names correctly
      From: params.StartDate,
      To: params.EndDate,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  }),
  getReportUserByDetail: (params: {
  UserId: string;
  UserName: string;
  Category: string;
  SubCategory: string;
  StartDate?: string;
  EndDate?: string;
  Numbers?: number;
  pageNumber?: number;
  pageSize?: number;
}) =>
  api.get("/Report/getReportUserbyDetail", {
    params: {
      ...params,
      Numbers: params.Numbers ?? 0,
    },
  }),
  updateNormalUserPassword: (
  userId: string,
  oldPassword: string,
  newPassword: string
) =>
  api.post(
    `/Account/UpdateNormalUserPassword?UserId=${userId}&oldpassword=${encodeURIComponent(
      oldPassword
    )}&newpassword=${encodeURIComponent(newPassword)}`
  ),

    getReportByDate: (params: {
  From: string;
  To: string;
  // OrgId: number;
  PageNumber?: number;
  PageSize?: 50;
}) =>
  api.get("/Report/getReportByDate", { params }),

getReportByCategoryAndSubCategory: (params: {
  CategoryId?: number;
  SubCategoryId?: number;
  PageNumber?: number;
  PageSize?: 50;
}) =>
  api.get("/Report/getReportbyCategoryAndSubCategory", {
    params: {
      PageNumber: 1,
      // PageSize: 10,
      ...params,
    },
  }),

  // -------------------------------------------------------
// CATEGORY & SUBCATEGORY REPORT (DETAILED)
// -------------------------------------------------------
getReportbyCategoryAndSubCategoryDetail: (params: {
  CategoryId?: number;
  SubCategoryId?: number;
  PageNumber?: number;
  PageSize?: number;
}) =>
  api.get("/Report/getReportbyCategoryAndSubCategoryDetail", {
    params: {
      PageNumber: 1,
      PageSize: 50,
      ...params,
    },
  }),
  
  isUserExist: (username: string) =>
  api.get(`/ajax/isuserexist`, {
    params: { username },
  }),


}

// import api from "./api";

// export const API = {
//   // ---------- CATEGORY ----------
//   addOrEditCategory: (data: {
//     CategoryId?: number;
//     Categoryname: string;
//     CategoryDescription?: string;
//   }) => api.post("/Category/addcategory", data),

//   getAllCategories: () => api.get("/Category/GetCategory"),

//   getCategoryById: (id: number) =>
//     api.get(`/Category/getcategoryDetailsbyid?categoryId=${id}`),

//   deleteCategory: (id: number) =>
//     api.post(`/Category/deleteCategory?Id=${id}`),

//   // ---------- SUBCATEGORY ----------
//   addOrEditSubCategory: (data: {
//     Id?: number;
//     CategoryId: number;
//     Name: string;
//     SubCategoryDescription?: string;
//   }) => api.post("/Category/addSubcategory", data),

//   deleteSubCategory: (id: number) =>
//     api.post(`/Category/deletesubCategory?id=${id}`),

//   getAllSubCategories: () => api.get("/Category/getsubcategoryall"),

//   getSubCategoryById: (id: number) =>
//     api.get(`/Category/getSubcategorybyid?id=${id}`),

//   // ⭐ NEW — Get Subcategories for selected Category
//   getSubCategoriesByCategoryId: (catId: number) =>
//     api.get(`/Category/getsubcategorydetailsbycategoryid?catid=${catId}`),

//   // ---------- COUNTER APIs ----------
//   addOrEditCounter: (data: {
//     Id?: number;
//     Name: string;
//     CategoryId: number;
//     SubCategoryId: number;
//     Description?: string;
//   }) => api.post("/Counter/addCounter", data),

//   getAllCounters: () => api.get("/Counter/GetCounter"),

//   getCounterById: (id: number) =>
//     api.get(`/Counter/GetCounterDetailsById?CounterId=${id}`),

//   deleteCounter: (id: number) =>
//     api.post(`/Counter/DeleteCounter?Id=${id}`),

//   // ---------- TOKEN CONFIGURATION ----------
//   saveTokenConfig: (data: {
//     Id: number;
//     CategoryId: number;
//     SubCategoryId: number;
//     Prefix: string;
//     InitializeNo: number;
//     CurrentNo: number;
//     ResetType: string;
//     LastResetDate: string;
//   }) => api.post("/Account/TokenPrefix/Create", data),

//   // -------------------------------------------------------
//   // ⭐⭐ NEW — PATIENT TOKEN GENERATION (Your Mock API) ⭐⭐
//   // -------------------------------------------------------
//   generateToken: (data: {
//     CategoryId: number;
//     SubCategoryId: number;
//     MobileNumber: string;
//     DeliveryMethod: string;
//   }) => api.post("/Patient/generateToken", data),
// };

