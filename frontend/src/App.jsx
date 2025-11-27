import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyAppointments from './pages/MyAppointments';
import Clinics from './pages/Clinics';
import MedicalHistory from './pages/MedicalHistory';
import ProfessionalAgenda from './pages/ProfessionalAgenda';
import PatientManagement from './pages/PatientManagement';
import './App.css'

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#F6F3ED'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #313851',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ 
            color: '#313851',
            fontWeight: '500'
          }}>
            Cargando...
          </p>
        </div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#F6F3ED'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #313851',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mis-citas" element={<MyAppointments />} />
            <Route path="/consultorios" element={<Clinics />} />
            <Route path="/mi-historial" element={<MedicalHistory />} />
            <Route path="/agenda" element={<ProfessionalAgenda />} />
            <Route path="/pacientes" element={<PatientManagement />} />
            <Route path="/expedientes" element={
              <div style={{padding: '2rem', textAlign: 'center'}}>
                <h1>📋 Expedientes Médicos</h1>
                <p>Página en desarrollo - Próximamente</p>
              </div>
} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App