import React, { useState, useEffect } from 'react';
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
import Header from '../components/Header';



const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const navigate = useNavigate();

  // Paleta de colores profesional
  const colors = {
    primary: '#F6F3ED',
    secondary: '#C2CBD3', 
    accent: '#11273bff',
    text: '#202c33ff',
    lightText: '#718096'
  };

  // Definición de botones según el tipo de usuario
  const professionalButtons = [
    { id: 1, path: '/agenda', icon: Calendar, label: 'Agenda', color: '#313851' },
    { id: 2, path: '/pacientes', icon: Users, label: 'Pacientes', color: '#313851' },
    { id: 3, path: '/expedientes', icon: FileText, label: 'Expedientes', color: '#313851' }
  ];

  const patientButtons = [
    { id: 1, path: '/mis-citas', icon: Calendar, label: 'Mis Citas', color: '#313851' },
    { id: 2, path: '/consultorios', icon: Users, label: 'Consultorios', color: '#313851' },
    { id: 3, path: '/mi-historial', icon: FileText, label: 'Mi Historial', color: '#313851' }
  ];

  const buttons = user?.user_type === 'professional' ? professionalButtons : patientButtons;

  // Cargar citas pendientes
  useEffect(() => {
    if (user?.user_type === 'patient') {
      loadPendingAppointments();
    }
  }, [user]);

  const loadPendingAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      const pending = data.filter(apt => 
        apt.status === 'pending' || apt.status === 'confirmed'
      ).map(apt => ({
        id: apt.id,
        professional_name: `${apt.professional?.first_name || ''} ${apt.professional?.last_name || ''}`,
        specialty: apt.professional?.specialty || 'Consulta General',
        formatted_date: new Date(apt.appointment_date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        formatted_time: new Date(`2000-01-01T${apt.appointment_time}`).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        status: apt.status
      }));
      setPendingAppointments(pending);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'confirmed' });
      loadPendingAppointments();
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      try {
        await appointmentService.updateAppointment(appointmentId, { status: 'cancelled' });
        loadPendingAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  }  
 
  return (
    <>
      <Header />  {/* ← AGREGAR ESTO */}
    
      {/* Contenido Principal */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}></main>

      {/* Contenido Principal */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
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

        {/* Sección de Estadísticas - SOLO PARA PROFESIONALES */}
        {user?.user_type === 'professional' && (
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
        )}
      {/* PARA PACIENTES: Mostrar recordatorios de citas */}
      {user?.user_type === 'patient' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem'
        }}>
          
          {/* Card de Recordatorios de Citas */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '4rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.secondary}`
          }}>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: colors.accent,
              marginBottom: '0.5rem',
              textAlign: 'center',  
              width: '100%'         
            }}>
              📅 Tienes ({pendingAppointments.length}) citas agendadas pendientes
            </h3>
            
            {pendingAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '0.2rem' }}>
                <p style={{ color: colors.lightText, marginBottom: '1rem' }}>
                  No has agendado ninguna cita aún
                </p>
                <button
                  onClick={() => navigate('/consultorios')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  + Agendar Cita
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: `1px solid ${colors.secondary}`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      position: 'relative'
                    }}
                  >
                    {/* Badge de Confirmado */}
                    {appointment.status === 'confirmed' && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Confirmado
                      </div>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: colors.accent,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}>
                        {appointment.professional_name?.charAt(0) || 'D'}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 0.25rem 0',
                          color: colors.accent,
                          fontSize: '1.1rem'
                        }}>
                          {appointment.professional_name || 'Profesional'}
                        </h4>
                        <p style={{
                          margin: 0,
                          color: colors.lightText,
                          fontSize: '0.9rem'
                        }}>
                          {appointment.specialty || 'Especialidad'}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: `1px solid ${colors.secondary}`,
                      paddingTop: '1rem'
                    }}>
                      <div>
                        <p style={{
                          margin: '0 0 0.25rem 0',
                          fontWeight: '600',
                          color: colors.accent
                        }}>
                          {appointment.formatted_date}
                        </p>
                        <p style={{
                          margin: 0,
                          color: colors.lightText,
                          fontSize: '0.9rem'
                        }}>
                          {appointment.formatted_time}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {appointment.status !== 'confirmed' && (
                          <button
                            onClick={() => confirmAppointment(appointment.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Confirmar
                          </button>
                        )}
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
)}

      </main>

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
    </>
  );
};

export default Dashboard;