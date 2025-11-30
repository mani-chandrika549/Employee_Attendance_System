import React from 'react';
import { useAuthStore } from '../../store';
import { User, Mail, Briefcase, BadgeCheck, Building2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-1 rounded-full">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200"
              />
            </div>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{user.name}</h1>
              <p className="text-slate-500 font-medium mb-6">@{user.employeeId}</p>

              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <div className="w-10 flex justify-center">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <div className="w-10 flex justify-center">
                    <Building2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <span>{user.department} Department</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-600" />
                Employment Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Employee ID</p>
                  <p className="font-medium text-slate-800">{user.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Role</p>
                  <p className="font-medium text-slate-800 capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Date Joined</p>
                  <p className="font-medium text-slate-800">Jan 12, 2023</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Status</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;