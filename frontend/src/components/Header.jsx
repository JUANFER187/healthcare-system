import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Calendar, 
  Home, 
  Users, 
  FileText, 
  LogOut,
  User,
  Settings,
  Bell,
  HelpCircle
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#0f1a24ff',
    lightText: '#6b7380ff'
  };

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/login');
  };

  // Definir menú según tipo de usuario
  const menuItems = user?.user_type === 'professional' 
    ? [
        { id: 1, path: '/dashboard', icon: Home, label: 'Dashboard', color: '#3b82f6' },
        { id: 2, path: '/agenda', icon: Calendar, label: 'Agenda', color: '#10b981' },
        { id: 3, path: '/pacientes', icon: Users, label: 'Pacientes', color: '#8b5cf6' },
        { id: 4, path: '/expedientes', icon: FileText, label: 'Expedientes', color: '#f59e0b' },
        { id: 5, path: '/profile', icon: User, label: 'Perfil', color: '#ef4444' },
      ]
    : [
        { id: 1, path: '/dashboard', icon: Home, label: 'Dashboard', color: '#3b82f6' },
        { id: 2, path: '/mis-citas', icon: Calendar, label: 'Mis Citas', color: '#10b981' },
        { id: 3, path: '/consultorios', icon: Users, label: 'Consultorios', color: '#8b5cf6' },
        { id: 4, path: '/mi-historial', icon: FileText, label: 'Mi Historial', color: '#f59e0b' },
        { id: 5, path: '/profile', icon: User, label: 'Perfil', color: '#ef4444' },
      ];

  return (
    <>
      {/* Header Principal */}
      <header style={{
        backgroundColor: colors.accent,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '70px'
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
            fontSize: '18px',
            cursor: 'pointer'
          }} onClick={() => navigate('/dashboard')}>
            🏥
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0,
            cursor: 'pointer'
          }} onClick={() => navigate('/dashboard')}>
            Mediturno
          </h1>
        </div>

        {/* Información del usuario en desktop */}
        <div style={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          gap: '1rem',
          color: 'white',
          fontSize: '0.875rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '20px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: colors.secondary,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: colors.accent
            }}>
              {user?.first_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {user?.user_type === 'professional' ? '👨‍⚕️ Profesional' : '👤 Paciente'}
              </div>
            </div>
          </div>
        </div>

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
              transform: sidebarOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transformOrigin: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
              transform: sidebarOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
            
            {/* Línea inferior */}
            <div style={{
              position: 'absolute',
              top: sidebarOpen ? '11px' : '18px',
              left: '0',
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              transform: sidebarOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              transformOrigin: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>
        </button>
      </header>

      {/* Overlay cuando el menú está abierto */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}

      {/* Menú Lateral (Sidebar) */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: sidebarOpen ? 0 : '-320px',
        width: '300px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 100,
        transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Encabezado del Sidebar */}
        <div style={{
          padding: '2rem 1.5rem 1.5rem',
          backgroundColor: colors.accent,
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: colors.secondary,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: colors.accent,
              fontSize: '24px'
            }}>
              {user?.first_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 style={{ 
                margin: '0 0 0.25rem 0', 
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                {user?.first_name} {user?.last_name}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem',
                opacity: 0.9
              }}>
                {user?.email}
              </p>
              <div style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {user?.user_type === 'professional' ? '👨‍⚕️ Profesional' : '👤 Paciente'}
              </div>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: colors.accent,
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: item.color + '20',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                  }}>
                    <Icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Divider */}
            <div style={{
              height: '1px',
              backgroundColor: '#e5e7eb',
              margin: '1rem 0'
            }}></div>

            {/* Enlaces adicionales */}
            <button
              onClick={() => handleNavigation('/settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: colors.lightText,
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.lightText
              }}>
                <Settings size={20} />
              </div>
              <span>Configuración</span>
            </button>

            <button
              onClick={() => handleNavigation('/help')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: colors.lightText,
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.lightText
              }}>
                <HelpCircle size={20} />
              </div>
              <span>Ayuda</span>
            </button>
          </nav>
        </div>

        {/* Footer del Sidebar con Botón de Logout */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
          
          <p style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: colors.lightText,
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            © {new Date().getFullYear()} Mediturno
            <br />
            Sistema de Gestión Médica
          </p>
        </div>
      </div>

      {/* Espacio para el header fijo */}
      <div style={{ height: '70px' }}></div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Header;