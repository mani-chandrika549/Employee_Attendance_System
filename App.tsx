import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import AttendanceHistory from './components/employee/AttendanceHistory';
import Reports from './components/manager/Reports';
import TeamCalendar from './components/manager/TeamCalendar';
import AllAttendance from './components/manager/AllAttendance';
import Profile from './components/employee/Profile';
import MarkAttendance from './components/employee/MarkAttendance';
import { UserRole } from './types';

const App: React.FC = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={
            user?.role === UserRole.MANAGER 
              ? <ManagerDashboard /> 
              : <EmployeeDashboard />
          } />
          
          {/* Shared Routes */}
          <Route path="profile" element={<Profile />} />
          
          {/* Employee Routes */}
          {user?.role === UserRole.EMPLOYEE && (
            <>
              <Route path="history" element={<AttendanceHistory />} />
              <Route path="mark-attendance" element={<MarkAttendance />} />
            </>
          )}

          {/* Manager Routes */}
          {user?.role === UserRole.MANAGER && (
            <>
              <Route path="all-attendance" element={<AllAttendance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="team-calendar" element={<TeamCalendar />} />
            </>
          )}
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;