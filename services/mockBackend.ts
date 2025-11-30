import { User, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import { SEED_USERS, SEED_ATTENDANCE } from '../constants';

// Simulated In-Memory Database
class MockBackend {
  private users: User[] = SEED_USERS;
  private attendance: AttendanceRecord[] = SEED_ATTENDANCE;
  private passwords: Record<string, string> = {};

  constructor() {
    // Initialize default passwords for seed users
    this.users.forEach(user => {
      this.passwords[user.email] = 'password';
    });
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email);
        const storedPassword = this.passwords[email];

        if (user && storedPassword === password) {
          resolve({ user, token: 'mock-jwt-token-' + Date.now() });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  }

  async register(data: Partial<User> & { password?: string }): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: 'u' + (this.users.length + 1),
          employeeId: data.employeeId || 'EMP00' + (this.users.length + 1),
          role: data.role || UserRole.EMPLOYEE, 
          avatar: `https://picsum.photos/200/200?random=${this.users.length + 1}`,
          name: data.name || 'New User',
          email: data.email || '',
          department: data.department || 'General',
          createdAt: new Date().toISOString(),
        };
        
        if (data.email && data.password) {
          this.passwords[data.email] = data.password;
        }

        this.users.push(newUser);
        resolve(newUser);
      }, 800);
    });
  }

  // --- Attendance (Employee) ---
  async getMyAttendance(userId: string): Promise<AttendanceRecord[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.attendance.filter(a => a.userId === userId));
      }, 500);
    });
  }

  async checkIn(userId: string): Promise<AttendanceRecord> {
    return new Promise(resolve => {
      const todayStr = new Date().toISOString().split('T')[0];
      const existing = this.attendance.find(a => a.userId === userId && a.date === todayStr);
      
      if (existing) return resolve(existing);

      // Determine if late (after 9:30 AM is late for this mock)
      const now = new Date();
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

      const record: AttendanceRecord = {
        id: 'a-' + Date.now(),
        userId,
        date: todayStr,
        checkInTime: new Date().toISOString(),
        status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        totalHours: 0,
        createdAt: new Date().toISOString()
      };
      
      this.attendance.push(record);
      setTimeout(() => resolve(record), 600);
    });
  }

  async checkOut(userId: string): Promise<AttendanceRecord> {
    return new Promise((resolve, reject) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const recordIndex = this.attendance.findIndex(a => a.userId === userId && a.date === todayStr);

      if (recordIndex === -1) {
        reject(new Error('No check-in record found for today'));
        return;
      }

      const record = this.attendance[recordIndex];
      const checkOut = new Date();
      const checkIn = new Date(record.checkInTime || checkOut.toISOString());
      const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      const updated: AttendanceRecord = {
        ...record,
        checkOutTime: checkOut.toISOString(),
        totalHours: parseFloat(hours.toFixed(2))
      };

      this.attendance[recordIndex] = updated;
      setTimeout(() => resolve(updated), 600);
    });
  }

  // --- Attendance (Manager) ---
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.attendance), 600);
    });
  }
  
  async getAllUsers(): Promise<User[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.users), 400));
  }
}

export const backend = new MockBackend();