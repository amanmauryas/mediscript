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
import PrescriptionsPage from './pages/Prescription/PrescriptionsPage';
import NewPrescriptionPage from './pages/Prescription/NewPrescriptionPage';
import PrescriptionDetailsPage from './pages/Prescription/PrescriptionDetailsPage';
import EditPrescriptionPage from './pages/Prescription/EditPrescriptionPage';

// Patient Pages
import PatientsPage from './pages/Patients/PatientsPage';
import PatientDetailsPage from './pages/Patients/PatientDetailsPage';

// Medication Pages
import MedicationsPage from './pages/Medications/MedicationsPage';

// Template Pages
import TemplatesPage from './pages/Templates/TemplatesPage';

// Profile Pages
import ProfilePage from './pages/Profile/ProfilePage';

// Settings Pages
import SettingsPage from './pages/Settings/SettingsPage';

// Medicine Pages
import MedicinesPage from './pages/Medicines/MedicinesPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={5000} />
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary-600">MediScript</h1>
          </div>
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
              path="/prescriptions" 
              element={
                <AuthGuard>
                  <PrescriptionsPage />
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

            <Route 
              path="/prescriptions/:id" 
              element={
                <AuthGuard>
                  <PrescriptionDetailsPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/patients" 
              element={
                <AuthGuard>
                  <PatientsPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/patients/:id" 
              element={
                <AuthGuard>
                  <PatientDetailsPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/medications" 
              element={
                <AuthGuard>
                  <MedicationsPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/templates" 
              element={
                <AuthGuard>
                  <TemplatesPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <AuthGuard>
                  <SettingsPage />
                </AuthGuard>
              } 
            />

            <Route
              path="/medicines"
              element={
                <AuthGuard>
                  <MedicinesPage />
                </AuthGuard>
              }
            />

            <Route
              path="/prescriptions/:id/edit"
              element={
                <AuthGuard>
                  <EditPrescriptionPage />
                </AuthGuard>
              }
            />

            {/* Redirect Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;