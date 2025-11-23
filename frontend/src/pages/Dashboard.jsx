import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Heart, 
  History, 
  User, 
  LogOut,
  Menu,
  X,
  Stethoscope,
  Users,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);

  const toggleMenu = () => {
    setMenuAnimation(!menuAnimation);
    setTimeout(() => setSidebarOpen(!sidebarOpen), 150);
  };

  // Paleta de colores profesional
  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#313851',
    text: '#2D3748',
    lightText: '#718096'
  };

  // Botones para Pacientes
  const patientButtons = [
    { id: 'appointments', label: 'Mis Citas', icon: Calendar, color: '#4A5568' },
    { id: 'clinics', label: 'Consultorios', icon: Heart, color: '#2D3748' },
    { id: 'history', label: 'Mi Historial', icon: History, color: '#1A202C' }
  ];

  // Botones para Profesionales
  const professionalButtons = [
    { id: 'schedule', label: 'Agenda', icon: Calendar, color: '#4A5568' },
    { id: 'patients', label: 'Pacientes', icon: Users, color: '#2D3748' },
    { id: 'records', label: 'Expedientes', icon: FileText, color: '#1A202C' }
  ];

  const buttons = user?.user_type === 'professional' ? professionalButtons : patientButtons;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.accent,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: colors.secondary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: colors.accent,
            fontSize: '18px'
          }}>
            🏥
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            SaludDigital
          </h1>
        </div>

        {/* Botón Menú Hamburguesa Animado */}
        <button
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <div style={{
            width: '24px',
            height: '24px',
            position: 'relative'
          }}>
            {/* Línea superior */}
            <div style={{
              position: 'absolute',
              top: menuAnimation ? '11px' : '4px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: menuAnimation ? 'rotate(45deg)' : 'none',
              transition: 'all 0.3s ease'
            }}></div>
            {/* Línea media */}
            <div style={{
              position: 'absolute',
              top: '11px',
              left: '0',
              width: menuAnimation ? '0' : '24px',
              height: '2px',
              backgroundColor: 'white',
              opacity: menuAnimation ? 0 : 1,
              transition: 'all 0.3s ease'
            }}></div>
            {/* Línea inferior */}
            <div style={{
              position: 'absolute',
              top: menuAnimation ? '11px' : '18px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: menuAnimation ? 'rotate(-45deg)' : 'none',
              transition: 'all 0.3s ease'
            }}></div>
          </div>
        </button>
      </header>

      {/* Contenido Principal */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Tarjeta de Bienvenida */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: `1px solid ${colors.secondary}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: colors.secondary,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
              fontSize: '24px'
            }}>
              {user?.user_type === 'professional' ? '👨‍⚕️' : '👤'}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: colors.accent,
                margin: '0 0 0.25rem 0'
              }}>
                ¡Bienvenido, {user?.first_name}!
              </h2>
              <p style={{
                color: colors.lightText,
                margin: 0,
                fontSize: '1rem'
              }}>
                {user?.user_type === 'professional' 
                  ? 'Gestiona tu consultorio y atiende a tus pacientes'
                  : 'Cuida de tu salud con nuestros profesionales'
                }
              </p>
            </div>
          </div>

          {/* Información del usuario */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <strong style={{ color: colors.lightText, fontSize: '0.875rem' }}>Email:</strong>
              <div style={{ color: colors.text, marginTop: '0.25rem' }}>{user?.email}</div>
            </div>
            <div>
              <strong style={{ color: colors.lightText, fontSize: '0.875rem' }}>Tipo de usuario:</strong>
              <div style={{ 
                color: colors.accent, 
                marginTop: '0.25rem',
                fontWeight: '600'
              }}>
                {user?.user_type === 'professional' ? 'Profesional de la Salud' : 'Paciente'}
              </div>
            </div>
            {user?.specialty && (
              <div>
                <strong style={{ color: colors.lightText, fontSize: '0.875rem' }}>Especialidad:</strong>
                <div style={{ color: colors.text, marginTop: '0.25rem' }}>{user?.specialty}</div>
              </div>
            )}
          </div>
        </div>

        {/* Botones Circulares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {buttons.map((button) => {
            const IconComponent = button.icon;
            return (
              <button
                key={button.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '2rem 1rem',
                  backgroundColor: 'white',
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  e.target.style.borderColor = button.color;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = colors.secondary;
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: button.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <IconComponent size={32} />
                </div>
                <span style={{
                  fontWeight: '600',
                  color: colors.accent,
                  fontSize: '1rem',
                  textAlign: 'center'
                }}>
                  {button.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Sidebar Menu */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: colors.accent,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          padding: '2rem',
          animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            {/* Header del sidebar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', margin: 0 }}>Menú</h3>
              <button
                onClick={toggleMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Opciones del menú */}
            <nav style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <User size={20} />
                  Mi Perfil
                </button>
                <button 
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FECACA',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    marginTop: 'auto'
                  }}
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Overlay para cerrar sidebar */}
      {sidebarOpen && (
        <div 
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        ></div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;