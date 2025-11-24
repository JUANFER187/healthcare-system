import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/api'; // ← CORREGIDO
import ProfessionalStats from '../../components/ProfessionalStats';
import ReviewList from '../../components/ReviewList';
import StarRating from '../../components/StarRating';
import CreateAppointment from '../../components/CreateAppointment';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // about, reviews, schedule

  useEffect(() => {
    loadProfessional();
  }, [id]);

  const loadProfessional = async () => {
    setLoading(true);
    setError(null);
    try {
      // En un sistema real, aquí llamarías a un endpoint específico para el perfil del profesional
      const professionals = await userService.getProfessionals();
      const foundProfessional = professionals.find(prof => prof.id === parseInt(id));
      
      if (foundProfessional) {
        setProfessional(foundProfessional);
      } else {
        setError('Profesional no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el perfil del profesional');
      console.error('Error loading professional:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentCreated = () => {
    setShowAppointmentForm(false);
    // Podrías mostrar un mensaje de éxito o redirigir
    alert('¡Cita agendada exitosamente! Te contactaremos para confirmar.');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
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
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Cargando perfil del profesional...
          </p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
          <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
            {error || 'Profesional no encontrado'}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            El profesional que buscas no está disponible o no existe.
          </p>
          <button
            onClick={() => navigate('/professionals')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Volver a Profesionales
          </button>
        </div>
      </div>
    );
  }

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
        {/* Header del Profesional */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start'
          }}>
            {/* Avatar e Info Básica */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              minWidth: '200px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}>
                {professional.first_name[0]}{professional.last_name[0]}
              </div>
              
              <ProfessionalStats professionalId={professional.id} />
            </div>

            {/* Información Detallada */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Dr. {professional.first_name} {professional.last_name}
                  </h1>
                  <p style={{
                    fontSize: '1.25rem',
                    color: '#3b82f6',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {professional.specialty}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <StarRating 
                      rating={4} // Esto vendría de las estadísticas reales
                      readonly={true}
                      size="md"
                      showLabel={true}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      (45 reseñas)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAppointmentForm(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  📅 Agendar Cita
                </button>
              </div>

              {/* Tabs de Navegación */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '1.5rem'
              }}>
                {[
                  { id: 'about', label: '👨‍⚕️ Sobre el Profesional', icon: '👨‍⚕️' },
                  { id: 'reviews', label: '⭐ Reseñas', icon: '⭐' },
                  { id: 'schedule', label: '🕒 Horarios', icon: '🕒' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                      color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contenido de los Tabs */}
              <div>
                {activeTab === 'about' && (
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 1rem 0'
                    }}>
                      Información Profesional
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: '#374151' }}>Especialidad:</strong>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>{professional.specialty}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Licencia:</strong>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>{professional.license_number || 'LM-12345'}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Años de Experiencia:</strong>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>8 años</p>
                      </div>
                      <div>
                        <strong style={{ color: '#374151' }}>Idiomas:</strong>
                        <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>Español, Inglés</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <strong style={{ color: '#374151' }}>Biografía:</strong>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', lineHeight: '1.6' }}>
                        El Dr. {professional.first_name} {professional.last_name} es un profesional comprometido 
                        con la salud de sus pacientes. Con amplia experiencia en {professional.specialty?.toLowerCase()}, 
                        se dedica a proporcionar la mejor atención médica con un enfoque humano y personalizado.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewList 
                    professionalId={professional.id}
                    showFilters={true}
                    compact={false}
                  />
                )}

                {activeTab === 'schedule' && (
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 1rem 0'
                    }}>
                      Horarios de Atención
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      {[
                        { day: 'Lunes a Viernes', hours: '8:00 AM - 6:00 PM' },
                        { day: 'Sábados', hours: '9:00 AM - 1:00 PM' },
                        { day: 'Domingos', hours: 'Cerrado' }
                      ].map(schedule => (
                        <div key={schedule.day} style={{
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb'
                        }}>
                          <strong style={{ color: '#374151' }}>{schedule.day}</strong>
                          <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>{schedule.hours}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#fef3c7',
                      borderRadius: '0.5rem',
                      border: '1px solid #fcd34d'
                    }}>
                      <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>
                        💡 <strong>Nota:</strong> Los horarios pueden variar. Se recomienda agendar cita con anticipación.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Agendar Cita */}
        {showAppointmentForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <CreateAppointment
                onAppointmentCreated={handleAppointmentCreated}
                onCancel={() => setShowAppointmentForm(false)}
                professionalId={professional.id}  // ← AGREGAR ESTA LÍNEA
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfile;