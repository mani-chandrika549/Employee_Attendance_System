import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle, Play, Square } from 'lucide-react';

const MarkAttendance: React.FC = () => {
  const { attendanceHistory, fetchMyAttendance, markCheckIn, markCheckOut, user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchMyAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceHistory.find(r => r.date === todayStr);
  
  const isCheckedIn = !!todayRecord?.checkInTime && !todayRecord?.checkOutTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  const handleAction = () => {
    if (isCheckedIn) markCheckOut();
    else if (!isCheckedOut) markCheckIn();
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Mark Attendance</h2>
        <p className="text-slate-500">Record your daily attendance from here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clock & Action Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="p-8 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                
                {/* Digital Clock */}
                <div className="text-center">
                    <div className="text-6xl font-bold text-slate-800 tracking-tight font-mono">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-slate-400 font-medium mt-2 text-lg">
                        {currentTime.toLocaleTimeString([], { second: '2-digit' })}s
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full w-fit mx-auto">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Location Badge (Static for UI) */}
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Office Location • Remote/Hybrid</span>
                </div>

                {/* Main Action Button */}
                <div className="w-full max-w-xs">
                    {isCheckedOut ? (
                         <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-6 text-center">
                            <CheckCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-slate-600">You're done for today!</h3>
                            <p className="text-slate-400 text-sm mt-1">Have a great evening</p>
                         </div>
                    ) : (
                        <button
                            onClick={handleAction}
                            className={`group relative w-full overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-lg
                                ${isCheckedIn 
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col items-center gap-3 text-white">
                                {isCheckedIn ? (
                                    <>
                                        <div className="p-3 bg-white/20 rounded-full">
                                            <Square className="w-8 h-8 fill-current" />
                                        </div>
                                        <div>
                                            <span className="block text-2xl font-bold">Check Out</span>
                                            <span className="text-red-100 text-sm">End your work day</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-white/20 rounded-full">
                                            <Play className="w-8 h-8 fill-current" />
                                        </div>
                                        <div>
                                            <span className="block text-2xl font-bold">Check In</span>
                                            <span className="text-indigo-100 text-sm">Start your work day</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Status Details Card */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    Today's Status
                </h3>
                
                <div className="space-y-6 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-slate-100"></div>

                    {/* Check In Row */}
                    <div className="relative flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                            ${todayRecord?.checkInTime ? 'bg-green-100 text-green-600 ring-4 ring-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Play className="w-4 h-4 fill-current" />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check In</p>
                            <p className="text-xl font-bold text-slate-800">
                                {formatTime(todayRecord?.checkInTime)}
                            </p>
                            {todayRecord?.status === 'Late' && (
                                <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                    Marked as Late
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Check Out Row */}
                    <div className="relative flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                            ${todayRecord?.checkOutTime ? 'bg-red-100 text-red-600 ring-4 ring-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Square className="w-4 h-4 fill-current" />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check Out</p>
                            <p className="text-xl font-bold text-slate-800">
                                {formatTime(todayRecord?.checkOutTime)}
                            </p>
                        </div>
                    </div>

                    {/* Total Hours Row */}
                    <div className="relative flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-indigo-100 text-indigo-600 ring-4 ring-white">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Work Hours</p>
                            <p className="text-2xl font-bold text-indigo-700">
                                {todayRecord?.totalHours || 0} <span className="text-sm font-normal text-indigo-500">hrs</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-slate-500" />
                    <div>
                        <p className="font-bold text-lg">{user?.name}</p>
                        <p className="text-slate-400 text-sm">{user?.role} • {user?.department}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white/10 rounded px-3 py-1.5 text-xs font-medium">ID: {user?.employeeId}</div>
                    <div className="bg-white/10 rounded px-3 py-1.5 text-xs font-medium">Shift: General (9:00 - 18:00)</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;