import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { AttendanceStatus } from '../../types';
import { ChevronLeft, ChevronRight, List, Calendar as CalendarIcon } from 'lucide-react';

const AttendanceHistory: React.FC = () => {
  const { attendanceHistory, fetchMyAttendance } = useAuthStore();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchMyAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 border border-slate-100"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = attendanceHistory.find(r => r.date === dateStr);
      
      let statusColor = 'bg-white';
      if (record) {
        if (record.status === AttendanceStatus.PRESENT) statusColor = 'bg-green-50 border-green-200';
        else if (record.status === AttendanceStatus.LATE) statusColor = 'bg-yellow-50 border-yellow-200';
        else if (record.status === AttendanceStatus.ABSENT) statusColor = 'bg-red-50 border-red-200';
        else if (record.status === AttendanceStatus.HALF_DAY) statusColor = 'bg-orange-50 border-orange-200';
      }

      days.push(
        <div key={d} className={`h-24 border p-2 flex flex-col justify-between transition-colors hover:bg-slate-50 ${statusColor} ${!record ? 'border-slate-100' : ''}`}>
          <span className="text-sm font-semibold text-slate-700">{d}</span>
          {record && (
            <div className="flex flex-col gap-1">
               <span className={`text-xs px-2 py-0.5 rounded w-fit ${
                  record.status === 'Present' ? 'text-green-700 bg-green-200/50' : 
                  record.status === 'Late' ? 'text-yellow-700 bg-yellow-200/50' :
                  'text-red-700 bg-red-200/50'
               }`}>
                 {record.status}
               </span>
               {record.totalHours > 0 && <span className="text-xs text-slate-500 font-medium">{record.totalHours} hrs</span>}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">My Attendance</h2>
        
        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Calendar
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
            <h3 className="text-lg font-bold text-slate-800">
              {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ChevronRight className="w-5 h-5"/></button>
          </div>
          
          <div className="grid grid-cols-7 text-center bg-slate-50 border-b border-slate-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
          <div className="p-4 flex gap-4 text-sm border-t border-slate-200 bg-slate-50">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Present</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Late</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Absent</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check In</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Check Out</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' : 
                        record.status === AttendanceStatus.LATE ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{record.totalHours}</td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;