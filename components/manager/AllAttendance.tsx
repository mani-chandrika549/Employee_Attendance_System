import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Search, Calendar, Filter, User as UserIcon } from 'lucide-react';
import { AttendanceStatus } from '../../types';

const AllAttendance: React.FC = () => {
  const { allAttendance, allUsers, fetchAllData } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = allAttendance.map(record => {
    const user = allUsers.find(u => u.id === record.userId);
    return { ...record, user };
  }).filter(item => {
    if (!item.user) return false;
    
    const matchesSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? item.date === filterDate : true;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

    return matchesSearch && matchesDate && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-slate-800">All Employees Attendance</h2>
        <div className="text-sm text-slate-500 mt-2 md:mt-0">
          Viewing {filteredData.length} records
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase">Search Employee</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
           <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase">Filter Date</label>
           <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
           <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase">Filter Status</label>
           <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value={AttendanceStatus.PRESENT}>{AttendanceStatus.PRESENT}</option>
              <option value={AttendanceStatus.LATE}>{AttendanceStatus.LATE}</option>
              <option value={AttendanceStatus.ABSENT}>{AttendanceStatus.ABSENT}</option>
              <option value={AttendanceStatus.HALF_DAY}>{AttendanceStatus.HALF_DAY}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(filterDate || searchTerm || filterStatus !== 'All') && (
        <div className="flex justify-end">
           <button 
             onClick={() => { setSearchTerm(''); setFilterDate(''); setFilterStatus('All'); }}
             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
           >
             Clear all filters
           </button>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Employee</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check In</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check Out</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                         <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                            {item.user?.avatar ? <img src={item.user.avatar} alt="" className="w-full h-full object-cover"/> : <UserIcon className="w-5 h-5 opacity-50"/>}
                         </div>
                         <div>
                           <p className="font-medium text-slate-800">{item.user?.name}</p>
                           <p className="text-xs text-slate-500">#{item.user?.employeeId} • {item.user?.department}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${item.status === AttendanceStatus.PRESENT ? 'bg-green-50 text-green-700 border-green-200' : 
                          item.status === AttendanceStatus.LATE ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          item.status === AttendanceStatus.ABSENT ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                          ${item.status === AttendanceStatus.PRESENT ? 'bg-green-500' : 
                            item.status === AttendanceStatus.LATE ? 'bg-yellow-500' :
                            item.status === AttendanceStatus.ABSENT ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      {item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : <span className="text-slate-400">--:--</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : <span className="text-slate-400">--:--</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      {item.totalHours > 0 ? <strong>{item.totalHours}</strong> : <span className="text-slate-400">-</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="w-10 h-10 mb-3 opacity-20" />
                      <p>No records found matching your filters.</p>
                      <button 
                         onClick={() => { setSearchTerm(''); setFilterDate(''); setFilterStatus('All'); }}
                         className="text-indigo-600 font-medium mt-2 hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;