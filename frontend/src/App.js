import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DriverManagement from './pages/DriverManagement';
import VehicleManagement from './pages/VehicleManagement';
import MaintenanceManagement from './pages/MaintenanceManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import DriverAttendance from './pages/DriverAttendance';
import { NotFound } from './pages/NotFound'; // Import NotFound page

// Components
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/drivers" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <DriverManagement />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/vehicles" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <VehicleManagement />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/maintenance" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <MaintenanceManagement />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/attendance" element={
              <PrivateRoute adminOnly>
                <Layout>
                  <AttendanceManagement />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/driver-attendance" element={
              <PrivateRoute>
                <Layout>
                  <DriverAttendance />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} /> {/* Fallback route */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
