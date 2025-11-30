import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { UserRole } from '../../types';
import { LayoutDashboard, CalendarDays, FileBarChart, LogOut, Briefcase, User, CalendarRange, Users, ClipboardCheck } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">WorkTrack</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
          Menu
        </div>

        <NavLink to="/" end className={navClass}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        {user?.role === UserRole.EMPLOYEE && (
          <>
            <NavLink to="/mark-attendance" className={navClass}>
              <ClipboardCheck className="w-5 h-5" />
              <span>Mark Attendance</span>
            </NavLink>
            <NavLink to="/history" className={navClass}>
              <CalendarDays className="w-5 h-5" />
              <span>Attendance History</span>
            </NavLink>
          </>
        )}

        {user?.role === UserRole.MANAGER && (
          <>
            <NavLink to="/all-attendance" className={navClass}>
              <Users className="w-5 h-5" />
              <span>All Attendance</span>
            </NavLink>
            <NavLink to="/team-calendar" className={navClass}>
              <CalendarRange className="w-5 h-5" />
              <span>Team Calendar</span>
            </NavLink>
            <NavLink to="/reports" className={navClass}>
              <FileBarChart className="w-5 h-5" />
              <span>Reports</span>
            </NavLink>
          </>
        )}

        <NavLink to="/profile" className={navClass}>
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;