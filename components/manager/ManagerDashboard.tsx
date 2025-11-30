import React, { useEffect } from 'react';
import { useAuthStore } from '../../store';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { AttendanceStatus } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { allAttendance, allUsers, fetchAllData } = useAuthStore();

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = allAttendance.filter(r => r.date === todayStr);

  const stats = {
    totalEmployees: allUsers.filter(u => u.role === 'employee').length,
    present: todayRecords.filter(r => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE).length,
    absent: todayRecords.filter(r => r.status === AttendanceStatus.ABSENT).length,
    late: todayRecords.filter(r => r.status === AttendanceStatus.LATE).length,
  };

  // Chart Data: Weekly Attendance Trend
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayRecords = allAttendance.filter(r => r.date === dateStr);
    
    weeklyData.push({
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      Present: dayRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
      Late: dayRecords.filter(r => r.status === AttendanceStatus.LATE).length,
      Absent: dayRecords.filter(r => r.status === AttendanceStatus.ABSENT).length,
    });
  }

  // Chart Data: Department Wise (Mock)
  const deptData = [
    { name: 'Engineering', value: 15 },
    { name: 'Marketing', value: 8 },
    { name: 'Design', value: 6 },
    { name: 'Sales', value: 10 },
  ];
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Team Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Employees</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalEmployees}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-6 h-6"/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><UserCheck className="w-6 h-6"/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-6 h-6"/></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-lg"><UserX className="w-6 h-6"/></div>
           </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Weekly Attendance Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="Present" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Department Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* List of Absentees */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Who is absent today?</h3>
        </div>
        <div className="divide-y divide-slate-100">
           {allUsers.filter(u => u.role === 'employee').slice(0,3).map(u => (
              <div key={u.id} className="px-6 py-4 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                    <div>
                       <p className="font-medium text-slate-800">{u.name}</p>
                       <p className="text-xs text-slate-500">{u.department}</p>
                    </div>
                 </div>
                 <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Absent</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;