import { User, UserRole, AttendanceRecord, AttendanceStatus } from './types';

// Helper to generate dates relative to today
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const subDays = (d: Date, days: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() - days);
  return result;
};

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Manager',
    email: 'manager@worktrack.com',
    role: UserRole.MANAGER,
    department: 'Operations',
    employeeId: 'MGR001',
    avatar: 'https://picsum.photos/200/200?random=1',
    createdAt: subDays(today, 365).toISOString(),
  },
  {
    id: 'u2',
    name: 'John Developer',
    email: 'john@worktrack.com',
    role: UserRole.EMPLOYEE,
    department: 'Engineering',
    employeeId: 'EMP001',
    avatar: 'https://picsum.photos/200/200?random=2',
    createdAt: subDays(today, 200).toISOString(),
  },
  {
    id: 'u3',
    name: 'Alice Designer',
    email: 'alice@worktrack.com',
    role: UserRole.EMPLOYEE,
    department: 'Design',
    employeeId: 'EMP002',
    avatar: 'https://picsum.photos/200/200?random=3',
    createdAt: subDays(today, 150).toISOString(),
  },
  {
    id: 'u4',
    name: 'Bob Marketing',
    email: 'bob@worktrack.com',
    role: UserRole.EMPLOYEE,
    department: 'Marketing',
    employeeId: 'EMP003',
    avatar: 'https://picsum.photos/200/200?random=4',
    createdAt: subDays(today, 100).toISOString(),
  }
];

// Seed Attendance
export const SEED_ATTENDANCE: AttendanceRecord[] = [
  // John's History
  {
    id: 'a1',
    userId: 'u2',
    date: formatDate(today),
    checkInTime: new Date().toISOString(),
    status: AttendanceStatus.PRESENT,
    totalHours: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'a2',
    userId: 'u2',
    date: formatDate(subDays(today, 1)),
    checkInTime: subDays(today, 1).toISOString(),
    checkOutTime: subDays(today, 1).toISOString(),
    status: AttendanceStatus.PRESENT,
    totalHours: 8.5,
    createdAt: subDays(today, 1).toISOString()
  },
  {
    id: 'a3',
    userId: 'u2',
    date: formatDate(subDays(today, 2)),
    checkInTime: subDays(today, 2).toISOString(),
    checkOutTime: subDays(today, 2).toISOString(),
    status: AttendanceStatus.LATE,
    totalHours: 7.5,
    createdAt: subDays(today, 2).toISOString()
  },
  // Alice's History
  {
    id: 'a4',
    userId: 'u3',
    date: formatDate(today), // Alice hasn't checked in today
    status: AttendanceStatus.ABSENT, 
    totalHours: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'a5',
    userId: 'u3',
    date: formatDate(subDays(today, 1)),
    checkInTime: subDays(today, 1).toISOString(),
    checkOutTime: subDays(today, 1).toISOString(),
    status: AttendanceStatus.PRESENT,
    totalHours: 8,
    createdAt: subDays(today, 1).toISOString()
  }
];

export const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Operations', 'HR'];