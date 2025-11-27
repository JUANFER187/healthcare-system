import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { appointmentService } from '../services/api';
import CreateAppointment from '../components/CreateAppointment';

const ProfessionalAgenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('day'); // day, week, month
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // CONECTAR CON BACKEND REAL
      const data = await appointmentService.getAppointments();
      
      // Transformar datos del backend
      const transformedAppointments = data.map(appointment => ({
        id: appointment.id,
        patient_name: `${appointment.patient?.first_name || ''} ${appointment.patient?.last_name || ''}`,
        service: appointment.service?.name || 'Consulta',
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        duration: 30, // Por defecto
        status: appointment.status || 'pending',
        notes: appointment.notes
      }));
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Fallback a datos mock si hay error
      setAppointments([
        {
          id: 1,
          patient_name: 'Ana García López',
          service: 'Consulta General',
          date: selectedDate,
          time: '09:00',
          duration: 30,
          status: 'confirmed',
          notes: 'Control rutinario'
        },
        {
          id: 2,
          patient_name: 'Carlos Rodríguez',
          service: 'Consulta Especializada', 
          date: selectedDate,
          time: '10:00',
          duration: 60,
          status: 'pending',
          notes: 'Seguimiento tratamiento'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: newStatus });
      loadAppointments();
      alert(`Cita ${newStatus === 'completed' ? 'completada' : 'cancelada'} exitosamente`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error al actualizar la cita');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      cancelled: '#ef4444',
      completed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return texts[status] || status;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const appointment = appointments.find(apt => apt.time === time && apt.date === selectedDate);
        slots.push({ time, appointment });
      }
    }
    return slots;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #3b82f6',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p>Cargando agenda...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          📅 Mi Agenda
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona tu calendario de consultas y citas médicas
        </p>
      </div>

      {/* Controles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
          
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="day">Vista Diaria</option>
            <option value="week">Vista Semanal</option>
            <option value="month">Vista Mensual</option>
          </select>
        </div>

        {/* BOTÓN NUEVA CITA - FUNCIONAL */}
        <button 
          onClick={() => setShowCreateForm(true)}
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
            gap: '0.5rem'
          }}
        >
          + Nueva Cita
        </button>
      </div>

      {/* Vista de Agenda */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        {/* Header de Horarios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            padding: '1rem',
            fontWeight: '600',
            color: '#374151',
            backgroundColor: '#f8fafc'
          }}>
            Hora
          </div>
          <div style={{
            padding: '1rem',
            fontWeight: '600',
            color: '#374151',
            backgroundColor: '#f8fafc'
          }}>
            Citas Programadas - {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Lista de Horarios */}
        <div>
          {generateTimeSlots().map((slot, index) => (
            <div
              key={slot.time}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr',
                borderBottom: index < generateTimeSlots().length - 1 ? '1px solid #f3f4f6' : 'none',
                minHeight: '80px'
              }}
            >
              {/* Hora */}
              <div style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                fontWeight: '500',
                color: '#374151'
              }}>
                {slot.time}
              </div>

              {/* Cita */}
              <div style={{ padding: '1rem' }}>
                {slot.appointment ? (
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <User size={16} color="#374151" />
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>
                          {slot.appointment.patient_name}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <Clock size={14} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {slot.appointment.service} • {slot.appointment.duration}min
                        </span>
                      </div>

                      {slot.appointment.notes && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0,
                          fontStyle: 'italic'
                        }}>
                          {slot.appointment.notes}
                        </p>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(slot.appointment.status),
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {getStatusText(slot.appointment.status)}
                      </span>

                      {/* BOTONES CHECK Y CANCELAR - FUNCIONALES */}
                      {(slot.appointment.status === 'pending' || slot.appointment.status === 'confirmed') && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {/* BOTÓN CHECK VERDE - Completar cita */}
                          <button
                            onClick={() => updateAppointmentStatus(slot.appointment.id, 'completed')}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                          >
                            <CheckCircle size={16} />
                          </button>
                          
                          {/* BOTÓN ROJO - Cancelar cita */}
                          <button
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
                                updateAppointmentStatus(slot.appointment.id, 'cancelled');
                              }
                            }}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '1rem',
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    Horario disponible
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen del Día */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
            {appointments.filter(a => a.date === selectedDate).length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Citas del Día
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            {appointments.filter(a => a.date === selectedDate && a.status === 'confirmed').length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Confirmadas
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
            {appointments.filter(a => a.date === selectedDate && a.status === 'pending').length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Pendientes
          </div>
        </div>
      </div>

      {/* MODAL FORMULARIO NUEVA CITA */}
      {showCreateForm && (
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
              onAppointmentCreated={() => {
                setShowCreateForm(false);
                loadAppointments();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAgenda;