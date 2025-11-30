import { create } from 'zustand';
import { User, AttendanceRecord, AuthState } from './types';
import { backend } from './services/mockBackend';

interface AppState extends AuthState {
  attendanceHistory: AttendanceRecord[];
  allAttendance: AttendanceRecord[]; // For managers
  allUsers: User[]; // For managers
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  
  // Employee Actions
  fetchMyAttendance: () => Promise<void>;
  markCheckIn: () => Promise<void>;
  markCheckOut: () => Promise<void>;

  // Manager Actions
  fetchAllData: () => Promise<void>;
}

export const useAuthStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  attendanceHistory: [],
  allAttendance: [],
  allUsers: [],

  login: async (email: string, password: string) => {
    try {
      const { user, token } = await backend.login(email, password);
      localStorage.setItem('worktrack_token', token);
      localStorage.setItem('worktrack_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, token });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  register: async (data) => {
    await backend.register(data);
    // Auto login after register
    if(data.email && data.password) await get().login(data.email, data.password);
  },

  logout: () => {
    localStorage.removeItem('worktrack_token');
    localStorage.removeItem('worktrack_user');
    set({ user: null, isAuthenticated: false, token: null, attendanceHistory: [] });
  },

  checkAuth: () => {
    const token = localStorage.getItem('worktrack_token');
    const userStr = localStorage.getItem('worktrack_user');
    if (token && userStr) {
      set({ isAuthenticated: true, token, user: JSON.parse(userStr) });
    }
  },

  fetchMyAttendance: async () => {
    const { user } = get();
    if (!user) return;
    const records = await backend.getMyAttendance(user.id);
    set({ attendanceHistory: records });
  },

  markCheckIn: async () => {
    const { user } = get();
    if (!user) return;
    await backend.checkIn(user.id);
    await get().fetchMyAttendance();
  },

  markCheckOut: async () => {
    const { user } = get();
    if (!user) return;
    await backend.checkOut(user.id);
    await get().fetchMyAttendance();
  },

  fetchAllData: async () => {
    const records = await backend.getAllAttendance();
    const users = await backend.getAllUsers();
    set({ allAttendance: records, allUsers: users });
  }
}));