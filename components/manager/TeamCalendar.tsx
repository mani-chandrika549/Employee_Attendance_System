import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { AttendanceStatus } from '../../types';
import { ChevronLeft, ChevronRight, UserCheck, UserX, Clock } from 'lucide-react';

const TeamCalendar: React.FC = () => {
  const { allAttendance, allUsers, fetchAllData } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 bg-slate-50 border border-slate-100"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      
      // Calculate daily stats
      const dailyRecords = allAttendance.filter(r => r.date === dateStr);
      const presentCount = dailyRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
      const lateCount = dailyRecords.filter(r => r.status === AttendanceStatus.LATE).length;
      const absentCount = dailyRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
      
      const hasData = dailyRecords.length > 0;

      days.push(
        <div 
          key={d} 
          onClick={() => handleDateClick(dateStr)}
          className={`h-28 border p-2 flex flex-col justify-between cursor-pointer transition-all
            ${isSelected ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50' : 'hover:bg-slate-50 bg-white border-slate-100'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
              {d}
            </span>
          </div>
          
          {hasData && (
            <div className="space-y-1 mt-1">
              <div className="flex items-center text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                {presentCount} Present
              </div>
              {(lateCount > 0) && (
                <div className="flex items-center text-xs text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></div>
                  {lateCount} Late
                </div>
              )}
              {(absentCount > 0) && (
                <div className="flex items-center text-xs text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
                  {absentCount} Absent
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  // Get details for selected date
  const selectedRecords = allAttendance.filter(r => r.date === selectedDate);
  // Enhance with user data
  const selectedDetails = selectedRecords.map(r => ({
    ...r,
    user: allUsers.find(u => u.id === r.userId)
  }));

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Team Attendance Calendar</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Column */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
        </div>

        {/* Details Column */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-lg">
              Details for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </h3>
            <div className="flex gap-4 mt-2 text-sm text-slate-500">
               <span className="flex items-center gap-1"><UserCheck className="w-4 h-4 text-green-600" /> {selectedDetails.filter(r => r.status === AttendanceStatus.PRESENT).length} Present</span>
               <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-yellow-600" /> {selectedDetails.filter(r => r.status === AttendanceStatus.LATE).length} Late</span>
               <span className="flex items-center gap-1"><UserX className="w-4 h-4 text-red-600" /> {selectedDetails.filter(r => r.status === AttendanceStatus.ABSENT).length} Absent</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {selectedDetails.length > 0 ? (
              selectedDetails.map(record => (
                <div key={record.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 flex justify-between items-center transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                       {record.user?.avatar ? <img src={record.user.avatar} alt="" className="w-full h-full object-cover"/> : record.user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{record.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{record.user?.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold
                      ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' : 
                        record.status === AttendanceStatus.LATE ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {record.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                <Clock className="w-10 h-10 mb-2 opacity-50" />
                <p>No records found for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCalendar;