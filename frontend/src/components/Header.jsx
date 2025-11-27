import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // Paleta de colores
  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#313851',
    lightText: '#6b7280'
  };

  return (
    <>
      {/* Header */}
      <header style={{
        backgroundColor: colors.accent,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: colors.primary, 
          margin: 0, 
          fontSize: '1.5rem',
          fontWeight: '600',
          cursor: 'pointer'
        }} onClick={() => navigate('/dashboard')}>
          HealthCare System
        </h1>

        {/* Botón Menú Hamburguesa */}
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
          <div style={{
            width: '24px',
            height: '24px',
            position: 'relative'
          }}>
            {/* Línea superior */}
            <div style={{
              position: 'absolute',
              top: sidebarOpen ? '11px' : '4px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: sidebarOpen ? 'rotate(45deg)' : 'none',
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
              opacity: sidebarOpen ? 0 : 1,
              transition: 'all 0.3s ease'
            }}></div>
            
            {/* Línea inferior */}
            <div style={{
              position: 'absolute',
              top: sidebarOpen ? '11px' : '18px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: sidebarOpen ? 'rotate(-45deg)' : 'none',
              transformOrigin: 'center',
              transition: 'all 0.3s ease'
            }}></div>
          </div>
        </button>
      </header>

      {/* Sidebar Menu */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: colors.accent,
          zIndex: 1000,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            gap: '2rem'
          }}>
            {/* Información del usuario */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {user?.first_name} {user?.last_name}
              </h3>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', opacity: 0.8 }}>
                {user?.email}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                {user?.user_type === 'professional' ? 'Profesional' : 'Paciente'}
                {user?.specialty && ` • ${user.specialty}`}
              </p>
            </div>

            {/* Opciones del menú */}
            <nav style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <button 
                  onClick={() => handleNavigation('/perfil')}
                  style={{
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
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                >
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                >
                  <span style={{ fontSize: '1.2rem' }}>🚪</span>
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
    </>
  );
};

export default Header;