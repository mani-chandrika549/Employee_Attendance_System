import React from 'react';
import { useAuthStore } from '../../store';

const Header: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-slate-700">
        Welcome back, {user?.name.split(' ')[0]}
      </h1>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <img
          src={user?.avatar || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-indigo-100"
        />
      </div>
    </header>
  );
};

export default Header;