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
// ------------------------------------------
// TOKEN STATUS CONSTANTS (Backend Mapped)
// ------------------------------------------
export const TOKEN_STATUS = {
  CALL: 1,
  HOLD: 2,
  RECALL: 3,       // "RE-CALL" → we name it RECALL for JS-safe keys
  CANCEL: 4,
  DONE: 5,
  PENDING: 6,
  INPROGRESS: 7,
} as const;
 
 
export type TokenStatusType = typeof TOKEN_STATUS[keyof typeof TOKEN_STATUS];
 
 
// Type for consecutive basis
export type ConsecutiveBasisType = typeof CONSECUTIVE_BASIS[keyof typeof CONSECUTIVE_BASIS];
 
// API Base URL
export const API_BASE_URL = "http://13.202.228.79/backend/api";