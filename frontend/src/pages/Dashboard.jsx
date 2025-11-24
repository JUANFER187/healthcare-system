import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    setMenuAnimation(newState); // Mismo estado para ambos
  };

  // Paleta de colores profesional
  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#11273bff',
    text: '#202c33ff',
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            boxShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
          }}
        >
          {/* El contenido de las 3 líneas se mantiene igual */}
          <div style={{
            width: '24px',
            height: '24px',
            position: 'relative'
          }}>
            {/* Línea superior */}
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: menuAnimation ? 'rotate(45deg)' : 'none',
              transformOrigin: 'center',
              transition: 'all 0.3s ease'
            }}></div>
            
            {/* Línea media */}
            <div style={{
              position: 'absolute',
              top: '11px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              opacity: menuAnimation ? 0 : 1,
              transition: 'all 0.3s ease'
            }}></div>
            
            {/* Línea inferior */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: menuAnimation ? 'rotate(-45deg)' : 'none',
              transformOrigin: 'center',
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
        </div>

        {/* Botones Circulares - NUEVO DISEÑO */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
          justifyItems: 'center'
        }}>
          {buttons.map((button) => {
            const IconComponent = button.icon;
            return (
              <button
                key={button.id}
                onClick={() => button.path && navigate(button.path)}
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: 'none',
                  background: `linear-gradient(135deg, ${button.color}, ${colors.accent})`,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}
              >
                <IconComponent size={50} />
                <span style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
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