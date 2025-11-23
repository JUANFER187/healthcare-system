import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import RateAppointmentButton from './RateAppointmentButton';

const AppointmentList = ({ compact = false, showHeader = true, limit = null }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Error al cargar las citas');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Filtrar citas según el filtro seleccionado
  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    
    switch (filter) {
      case 'upcoming':
        return appointment.status !== 'cancelled' && appointmentDate > now;
      case 'completed':
        return appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  // Limitar resultados si se especifica
  const displayedAppointments = limit ? filteredAppointments.slice(0, limit) : filteredAppointments;

  const getStatusColor = (status) => {
    const colors = {
      scheduled: { bg: '#fef3c7', text: '#92400e', label: 'Programada' },
      confirmed: { bg: '#dbeafe', text: '#1e40af', label: 'Confirmada' },
      in_progress: { bg: '#fef3c7', text: '#92400e', label: 'En Progreso' },
      completed: { bg: '#dcfce7', text: '#166534', label: 'Finalizada' },
      cancelled: { bg: '#fecaca', text: '#dc2626', label: 'Cancelada' },
      no_show: { bg: '#f3f4f6', text: '#6b7280', label: 'No Presentado' }
    };
    return colors[status] || colors.scheduled;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
          Cargando citas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
          {error}
        </p>
        <button
          onClick={loadAppointments}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: compact ? '1.5rem' : '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      {showHeader && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{
            fontSize: compact ? '1.125rem' : '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            📅 Mis Citas
          </h3>
          
          {appointments.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {filteredAppointments.length} {filteredAppointments.length === 1 ? 'cita' : 'citas'}
              </span>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">Todas</option>
                <option value="upcoming">Próximas</option>
                <option value="completed">Finalizadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Lista de Citas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '1rem' : '1.25rem' }}>
        {displayedAppointments.length > 0 ? (
          displayedAppointments.map((appointment) => {
            const statusInfo = getStatusColor(appointment.status);
            
            return (
              <div
                key={appointment.id}
                style={{
                  padding: compact ? '1rem' : '1.25rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: compact ? '0.875rem' : '1rem',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {formatDate(appointment.appointment_date)} a las {formatTime(appointment.appointment_time)}
                      </span>
                      
                      <span style={{
                        fontSize: '0.75rem',
                        color: statusInfo.text,
                        backgroundColor: statusInfo.bg,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      <strong>Profesional:</strong> {appointment.professional_name}
                    </div>
                    
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <strong>Servicio:</strong> {appointment.service_name}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'flex-end'
                  }}>
                    <RateAppointmentButton 
                      appointment={appointment}
                      professional={{
                        id: appointment.professional,
                        first_name: appointment.professional_name?.split(' ')[0],
                        last_name: appointment.professional_name?.split(' ').slice(1).join(' ')
                      }}
                      onReviewSubmitted={loadAppointments}
                    />
                    
                    {appointment.can_be_cancelled && appointment.status !== 'cancelled' && (
                      <button
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {/* Notas */}
                {appointment.notes && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    marginTop: '0.5rem'
                  }}>
                    <strong>Notas:</strong> {appointment.notes}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '500' }}>
              {filter === 'all' ? 'No tienes citas programadas' : `No hay citas ${filter}`}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {filter === 'all' ? 'Programa tu primera cita médica' : 'Intenta con otro filtro'}
            </p>
          </div>
        )}
      </div>

      {/* Ver más */}
      {limit && filteredAppointments.length > limit && (
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Ver todas las citas ({filteredAppointments.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;