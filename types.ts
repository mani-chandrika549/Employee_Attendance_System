export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  HALF_DAY = 'Half Day',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  avatar?: string;
  createdAt: string; // ISO Date String
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO Date String YYYY-MM-DD
  checkInTime?: string; // ISO String
  checkOutTime?: string; // ISO String
  status: AttendanceStatus;
  totalHours: number;
  createdAt: string; // ISO String
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface DashboardStats {
  totalEmployees?: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  avgWorkHours?: number;
}