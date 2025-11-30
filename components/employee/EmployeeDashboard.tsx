import React, { useEffect } from 'react';
import { useAuthStore } from '../../store';
import { Clock, CheckCircle, XCircle, AlertTriangle, Calendar, TrendingUp, Briefcase } from 'lucide-react';
import { AttendanceStatus } from '../../types';
import { Link } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

const EmployeeDashboard: React.FC = () => {
  const { user, attendanceHistory, fetchMyAttendance } = useAuthStore();

  useEffect(() => {
    fetchMyAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stats Logic
  const currentMonth = new Date().getMonth();
  const thisMonthRecords = attendanceHistory.filter(r => new Date(r.date).getMonth() === currentMonth);
  
  const stats = {
    present: thisMonthRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
    late: thisMonthRecords.filter(r => r.status === AttendanceStatus.LATE).length,
    absent: thisMonthRecords.filter(r => r.status === AttendanceStatus.ABSENT).length,
    halfDay: thisMonthRecords.filter(r => r.status === AttendanceStatus.HALF_DAY).length,
    totalHours: thisMonthRecords.reduce((acc, curr) => acc + (curr.totalHours || 0), 0).toFixed(1)
  };

  const totalDays = stats.present + stats.late + stats.absent + stats.halfDay;
  const attendanceScore = totalDays > 0 ? Math.round(((stats.present + stats.late) / totalDays) * 100) : 100;

  // Chart Data: Weekly Hours
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const record = attendanceHistory.find(r => r.date === dateStr);
    
    weeklyData.push({
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      hours: record ? record.totalHours : 0
    });
  }

  // Chart Data: Status Distribution
  const pieData = [
    { name: 'On Time', value: stats.present },
    { name: 'Late', value: stats.late },
    { name: 'Absent', value: stats.absent },
  ];
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
         <Link to="/mark-attendance" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Mark Attendance
         </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
           <div>
             <p className="text-sm font-medium text-slate-500 mb-1">Attendance Score</p>
             <div className="flex items-end gap-2">
               <h3 className="text-3xl font-bold text-slate-800">{attendanceScore}%</h3>
               <span className="text-sm text-green-600 mb-1 font-medium flex items-center">
                 <TrendingUp className="w-3 h-3 mr-1" /> Excellent
               </span>
             </div>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${attendanceScore}%` }}></div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <p className="text-sm font-medium text-slate-500">Days Present</p>
             <div className="p-2 bg-green-50 text-green-600 rounded-lg">
               <CheckCircle className="w-5 h-5" />
             </div>
           </div>
           <h3 className="text-3xl font-bold text-slate-800">{stats.present}</h3>
           <p className="text-xs text-slate-400 mt-1">In this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <p className="text-sm font-medium text-slate-500">Total Hours</p>
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <Clock className="w-5 h-5" />
             </div>
           </div>
           <h3 className="text-3xl font-bold text-slate-800">{stats.totalHours}</h3>
           <p className="text-xs text-slate-400 mt-1">Productive hours</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <p className="text-sm font-medium text-slate-500">Late Arrivals</p>
             <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
               <AlertTriangle className="w-5 h-5" />
             </div>
           </div>
           <h3 className="text-3xl font-bold text-slate-800">{stats.late}</h3>
           <p className="text-xs text-slate-400 mt-1">Need improvement</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Briefcase className="w-5 h-5 text-indigo-500" />
             Weekly Work Hours
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Calendar className="w-5 h-5 text-indigo-500" />
             Monthly Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <Link to="/history" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {attendanceHistory.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3).map((record) => (
             <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-600' : 
                        record.status === AttendanceStatus.LATE ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'}`}>
                      {record.status === AttendanceStatus.PRESENT ? <CheckCircle className="w-5 h-5"/> : 
                       record.status === AttendanceStatus.LATE ? <Clock className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                   </div>
                   <div>
                       <p className="font-medium text-slate-800">{new Date(record.date).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day:'numeric'})}</p>
                       <p className="text-xs text-slate-500 flex gap-2">
                          <span>In: {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                          <span>•</span>
                          <span>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                       </p>
                   </div>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' : 
                        record.status === AttendanceStatus.LATE ? 'bg-yellow-100 text-yellow-700' :
                        record.status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}
                    `}>
                      {record.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{record.totalHours} hrs</p>
                </div>
             </div>
          ))}
          {attendanceHistory.length === 0 && (
            <div className="p-8 text-center text-slate-500">No activity recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;