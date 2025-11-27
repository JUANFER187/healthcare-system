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

//Definición de botones según el tipo de usuario
  const buttons = user?.user_type === 'professional' 
    ? [
        { id: 1, path: '/agenda', icon: Calendar, label: 'Agenda', color: '#313851' },
        { id: 2, path: '/pacientes', icon: Users, label: 'Pacientes', color: '#C2CBD3' },
        { id: 3, path: '/expedientes', icon: FileText, label: 'Expedientes', color: '#313851' }
      ]
    : [
        { id: 1, path: '/mis-citas', icon: Calendar, label: 'Mis Citas', color: '#313851' },
        { id: 2, path: '/consultorios', icon: Users, label: 'Consultorios', color: '#C2CBD3' },
        { id: 3, path: '/mi-historial', icon: FileText, label: 'Mi Historial', color: '#313851' }
      ];
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

        {/* Cards Rectangulares - NUEVO DISEÑO */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          marginTop: '3.1rem'
        }}>
          {buttons.map((button) => {
            const IconComponent = button.icon;
            return (
              <button
                key={button.id}
                onClick={() => button.path && navigate(button.path)}
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${button.color}, ${colors.accent})`,
                  color: 'white',
                  cursor: 'pointer',
                  padding: '3rem 1.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}
              >
                <IconComponent size={40} />
                <div style={{
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  marginTop: '1rem'
                }}>
                  {button.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sección de Estadísticas - DESPUÉS de las cards principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem'
        }}>
          
          {/* Card de Ingresos Esperados - MEJOR ESPACIADO */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.secondary}`,
            gridColumn: 'span 2'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '5.5rem'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: colors.accent
              }}>
                📊 Ingresos Esperados
              </h3>
              <select style={{
                padding: '.75rem 1rem',
                borderRadius: '12px',
                border: `2px solid ${colors.secondary}`,
                backgroundColor: 'white',
                color: colors.accent,
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                <option>Esta semana</option>
                <option>Este mes</option>
                <option>Próximos 7 días</option>
              </select>
            </div>
            
            
            {/* Gráfica con mejor espaciado */}
            <div style={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-between',
              height: '160px',
              padding: '1.5rem 0',
              gap: '3.5rem',
              marginBottom: '0.05rem'
            }}>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                <div key={day} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: '0.35rem'
                }}>
                  <div style={{
                    width: '100%',
                    height: `${50 + (index * 20)}px`,
                    backgroundColor: colors.accent,
                    borderRadius: '8px 8px 0 0',
                    opacity: 0.8,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.transform = 'scale(1)';
                  }}
                  ></div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      color: colors.lightText,
                      fontWeight: '500'
                    }}>
                      {day}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      color: colors.accent,
                      fontWeight: '700'
                    }}>
                      ${(index + 1) * 250}K
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total y porcentaje */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '2rem',
              borderTop: `2px solid ${colors.secondary}`
            }}>
              <div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: colors.lightText,
                  marginBottom: '0.5rem'
                }}>
                  Total Esperado Esta Semana
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  color: colors.accent 
                }}>
                  $1,750,000
                </div>
              </div>
              <div style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3bb7e7ff',
                color: 'white',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                boxShadow: '0 2px 10px rgba(16, 179, 185, 0.3)'
              }}>
                ↗ +12% vs semana anterior
              </div>
            </div>
          </div>
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