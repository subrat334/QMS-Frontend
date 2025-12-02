// // =======================================
// // 🌟 Global Constants (AllConstants.ts)
// // =======================================

// export const USER_ROLES = {
//   SUPER_ADMIN: 1,
//   MIS: 5,
//   MONITOR: 4,
//   COUNTER: 3,
//   PATIENT_SCREEN: 6,
// } as const;

// // Explicit union (prevents TS narrowing bugs)
// export type UserRoleType =
//   | typeof USER_ROLES.SUPER_ADMIN
//   | typeof USER_ROLES.MIS
//   | typeof USER_ROLES.MONITOR
//   | typeof USER_ROLES.COUNTER
//   | typeof USER_ROLES.PATIENT_SCREEN;


// export const ROLE_ROUTES: Record<UserRoleType, string> = {
//   [USER_ROLES.SUPER_ADMIN]: "/dashboard",
//   [USER_ROLES.MIS]: "/mis",
//   [USER_ROLES.MONITOR]: "/monitor",
//   [USER_ROLES.COUNTER]: "/counter",
//   [USER_ROLES.PATIENT_SCREEN]: "/patient",
// };


// // Friendly labels
// export const ROLE_LABELS: Record<UserRoleType, string> = {
//   [USER_ROLES.SUPER_ADMIN]: "Super Admin",
//   [USER_ROLES.MIS]: "MIS",
//   [USER_ROLES.MONITOR]: "Monitor",
//   [USER_ROLES.COUNTER]: "Counter",
//   [USER_ROLES.PATIENT_SCREEN]: "Patient Screen",
// };
// // AllConstants.ts

// export const CONSECUTIVE_BASIS = {
//   DAILY: 1,
//   WEEKLY: 2,
//   MONTHLY: 3,
//   QUARTERLY: 4,
// };


// export const API_BASE_URL = "http://13.202.228.79/backend/api";


// =======================================
// 🌟 Global Constants (AllConstants.ts)
// =======================================
// AllConstants.ts
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  MIS: 5,
  MONITOR: 4,
  COUNTER: 3,
  PATIENT_SCREEN: 6,
} as const;

// Explicit union (prevents TS narrowing bugs)
export type UserRoleType =
  | typeof USER_ROLES.SUPER_ADMIN
  | typeof USER_ROLES.MIS
  | typeof USER_ROLES.MONITOR
  | typeof USER_ROLES.COUNTER
  | typeof USER_ROLES.PATIENT_SCREEN;


export const ROLE_ROUTES: Record<UserRoleType, string> = {
  [USER_ROLES.SUPER_ADMIN]: "/Dashboard",
  [USER_ROLES.MIS]: "/DateWise",
  [USER_ROLES.MONITOR]: "/monitor",
  [USER_ROLES.COUNTER]: "/manage-tokens",
  [USER_ROLES.PATIENT_SCREEN]: "/kiosk",
};


// Friendly labels
export const ROLE_LABELS: Record<UserRoleType, string> = {
  [USER_ROLES.SUPER_ADMIN]: "Super Admin",
  [USER_ROLES.MIS]: "MIS",
  [USER_ROLES.MONITOR]: "Monitor",
  [USER_ROLES.COUNTER]: "Counter",
  [USER_ROLES.PATIENT_SCREEN]: "Patient Screen",
};

// Consecutive Basis (matches backend ResetType string)
export const CONSECUTIVE_BASIS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
} as const;

// Type for consecutive basis
export type ConsecutiveBasisType = typeof CONSECUTIVE_BASIS[keyof typeof CONSECUTIVE_BASIS];

// API Base URL
export const API_BASE_URL = "http://13.202.228.79/backend/api";
