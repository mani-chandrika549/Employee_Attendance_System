import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Download, Filter, Search } from 'lucide-react';

const Reports: React.FC = () => {
  const { allAttendance, allUsers, fetchAllData } = useAuthStore();
  const [filterDept, setFilterDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = allAttendance.map(record => {
    const user = allUsers.find(u => u.id === record.userId);
    return { ...record, user };
  }).filter(item => {
    if (!item.user) return false;
    const matchesDept = filterDept === 'All' || item.user.department === filterDept;
    const matchesSearch = item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleExport = () => {
    // Define CSV headers
    const headers = ['Employee Name', 'Employee ID', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Total Hours'];

    // Map data to CSV rows
    const rows = filteredData.map(item => {
      const name = item.user?.name || 'Unknown';
      const id = item.user?.employeeId || '';
      const dept = item.user?.department || '';
      const date = new Date(item.date).toLocaleDateString();
      const status = item.status;
      const checkIn = item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
      const checkOut = item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
      const hours = item.totalHours.toString();

      // Escape quotes and wrap in quotes if necessary to handle commas in data
      const row = [name, id, dept, date, status, checkIn, checkOut, hours].map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });

      return row.join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Reports</h2>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search employee..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
        </div>
        <div className="w-full md:w-48 relative">
           <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
           <select 
             value={filterDept}
             onChange={(e) => setFilterDept(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
           >
             <option value="All">All Departments</option>
             <option value="Engineering">Engineering</option>
             <option value="Design">Design</option>
             <option value="Marketing">Marketing</option>
             <option value="Operations">Operations</option>
           </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Employee</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check In</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check Out</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {item.user?.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-medium text-slate-800">{item.user?.name}</p>
                         <p className="text-xs text-slate-500">{item.user?.employeeId}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.status === 'Present' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{item.totalHours > 0 ? item.totalHours : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;