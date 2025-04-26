import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/Layout/AuthGuard';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Dashboard Pages
import DashboardPage from './pages/Dashboard/DashboardPage';

// Prescription Pages
import NewPrescriptionPage from './pages/Prescription/NewPrescriptionPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false}>
                <LoginPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthGuard requireAuth={false}>
                <RegisterPage />
              </AuthGuard>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/prescriptions/new" 
            element={
              <AuthGuard>
                <NewPrescriptionPage />
              </AuthGuard>
            } 
          />

          {/* Redirect Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;