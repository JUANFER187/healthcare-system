import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Appointments from './pages/Appointments/Appointments';
import ProfessionalList from './pages/Professionals/ProfessionalList';
import ProfessionalProfile from './pages/Professionals/ProfessionalProfile';
import AppointmentList from './components/AppointmentList';
import './App.css'

// Dashboard temporal mejorado
const Dashboard = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header con logo y menú hamburguesa */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          {/* Logo en esquina izquierda */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#2563eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              🏥
            </div>
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold', 
              color: '#1e293b',
              margin: 0,
              lineHeight: '1.2'
            }}>
              SaludDigital
            </h1>
          </div>

          {/* Menú Hamburguesa */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {/* Líneas del menú hamburguesa */}
              <div style={{
                width: '18px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px'
              }}></div>
              <div style={{
                width: '18px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px'
              }}></div>
              <div style={{
                width: '18px',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px'
              }}></div>
            </button>

            {/* Menú Desplegable */}
            {isMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: '220px',
                zIndex: 1000,
                marginTop: '0.5rem'
              }}>
                {/* Información del usuario en el menú - CENTRADA */}
                <div style={{
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f3f4f6',
                  marginBottom: '1rem',
                  textAlign: 'center' // ✅ CENTRADO
                }}>
                  <p style={{
                    fontSize: '1rem', // ✅ AUMENTADO de 0.875rem
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 0.5rem 0'
                  }}>
                    ¡Hola, {user?.first_name}! 👋
                  </p>
                  <p style={{
                    fontSize: '0.875rem', // ✅ AUMENTADO de 0.75rem
                    color: '#6b7280',
                    margin: '0 0 0.75rem 0'
                  }}>
                    {user?.email}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: user?.user_type === 'professional' ? '#dcfce7' : '#dbeafe',
                    color: user?.user_type === 'professional' ? '#166534' : '#1e40af',
                    padding: '0.375rem 0.75rem', // ✅ AUMENTADO padding
                    borderRadius: '12px',
                    fontSize: '0.875rem', // ✅ AUMENTADO de 0.75rem
                    fontWeight: '500'
                  }}>
                    {user?.user_type === 'professional' ? 'Profesional' : 'Paciente'}
                  </div>
                </div>

                {/* Botón de cerrar sesión - CENTRADO */}
                <div style={{
                  textAlign: 'center' // ✅ CENTRADO
                }}>
                  <button 
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '0.625rem 1rem', // ✅ AUMENTADO padding
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      minWidth: '140px' // ✅ ANCHO MÍNIMO
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    <span></span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Navegación Rápida */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Tarjeta de Citas */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/appointments'}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.borderColor = '#3b82f6';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.borderColor = 'transparent';
          }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Mis Citas
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Gestiona y agenda tus citas médicas
              </p>
            </div>
          </div>

          {/* Tarjeta de Profesionales */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/professionals'}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.borderColor = '#10b981';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.borderColor = 'transparent';
          }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Profesionales
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Encuentra especialistas y agenda citas
              </p>
            </div>
          </div>

          {/* Tarjeta de Historial Médico */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => alert('Próximamente: Historial Médico')}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.borderColor = '#f59e0b';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.borderColor = 'transparent';
          }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Historial Médico
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Consulta tu historial y resultados
              </p>
            </div>
          </div>

          {/* Tarjeta de Reseñas */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid transparent',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => alert('Próximamente: Mis Reseñas')}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.borderColor = '#8b5cf6';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.borderColor = 'transparent';
          }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Mis Reseñas
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Gestiona tus reseñas y calificaciones
              </p>
            </div>
          </div>
        </div>

        {/* Card Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          {/* Información del usuario */}
          <div style={{
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600', 
              color: '#1e293b',
              margin: '0 0 1.5rem 0', // ✅ MÁGIN AUMENTADO
              lineHeight: '1.3',
              textAlign: 'center' // ✅ CENTRADO
            }}>
              Panel de Control
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // ✅ ANCHO AUMENTADO
              gap: '1.5rem', // ✅ ESPACIADO MEJORADO
              fontSize: '0.875rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // ✅ CENTRADO HORIZONTAL
                textAlign: 'center', // ✅ TEXTO CENTRADO
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <strong style={{ 
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '0.5rem', // ✅ ESPACIADO AUMENTADO
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  📧 Email
                </strong>
                <div style={{ 
                  color: '#1e293b',
                  fontWeight: '500',
                  wordBreak: 'break-word'
                }}>
                  {user?.email}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <strong style={{ 
                  color: '#64748b',
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  👤 Tipo de Usuario
                </strong>
                <div style={{ 
                  color: user?.user_type === 'professional' ? '#059669' : '#2563eb',
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: user?.user_type === 'professional' ? '#dcfce7' : '#dbeafe',
                  borderRadius: '20px',
                  fontSize: '0.875rem'
                }}>
                  {user?.user_type === 'professional' ? 'Profesional' : 'Paciente'}
                </div>
              </div>

              {user?.specialty && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ 
                    color: '#64748b',
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🎯 Especialidad
                  </strong>
                  <div style={{ 
                    color: '#1e293b',
                    fontWeight: '500',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                  }}>
                    {user?.specialty}
                  </div>
                </div>
              )}
            </div>
          </div>
          
            <AppointmentList 
              compact={true}
              showHeader={true}
              limit={3}
            />

          {/* Mensaje según tipo de usuario */}
          <div style={{
            marginTop: '1.5rem',
            backgroundColor: '#dbeafe',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem',
              fontWeight: '600', 
              color: '#1e40af',
              margin: '0 0 0.75rem 0',
              lineHeight: '1.4'
            }}>
              {user?.user_type === 'professional' ? '💼 Panel Profesional' : '🎯 Área de Paciente'}
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: '#374151',
              margin: 0,
              lineHeight: '1.6'
            }}>
              {user?.user_type === 'professional' 
                ? 'Gestiona tus citas, revisa el historial de pacientes y organiza tu consultorio desde aquí.'
                : 'Programa tus citas médicas, revisa tu historial y encuentra los mejores profesionales de la salud.'
              }
            </p>
          </div>

          {/* Próximas funcionalidades */}
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #fcd34d'
          }}>
            <h4 style={{ 
              fontSize: '1rem',
              color: '#92400e',
              margin: '0 0 0.5rem 0',
              fontWeight: '600',
              lineHeight: '1.4'
            }}>
              🚀 Próximamente
            </h4>
            <p style={{ 
              fontSize: '0.875rem',
              color: '#92400e',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Estamos trabajando en las funcionalidades completas de gestión de citas, 
              historial médico y consultorios favoritos.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

// Los componentes ProtectedRoute, PublicRoute y App function se mantienen igual...
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
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #3b82f6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ 
            fontSize: '0.875rem',
            color: '#64748b',
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
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #3b82f6',
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
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professional/:id" 
              element={
                <ProtectedRoute>
                  <ProfessionalProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professionals" 
              element={
                <ProtectedRoute>
                  <ProfessionalList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professionals" 
              element={
                <ProtectedRoute>
                  <ProfessionalList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professional/:id" 
              element={
                <ProtectedRoute>
                  <ProfessionalProfile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App