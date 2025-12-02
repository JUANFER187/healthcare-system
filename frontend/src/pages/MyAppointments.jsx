import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import { Calendar, Clock, User, MapPin, X, Edit } from 'lucide-react';
import Header from '../components/Header';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    loadAppointments();
  }, []);

const loadAppointments = async () => {
  setLoading(true);
  try {
    // LLAMADA REAL AL BACKEND - Obtener citas del usuario
    const data = await appointmentService.getAppointments();
    
    // Transformar datos del backend al formato que espera el frontend
    const transformedAppointments = data.map(appointment => ({
      id: appointment.id,
      professional_name: `${appointment.professional?.first_name || ''} ${appointment.professional?.last_name || ''}`,
      specialty: appointment.professional?.specialty || 'Especialidad no especificada',
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      status: appointment.status || 'pending',
      address: appointment.professional?.address || 'Dirección no especificada',
      service: appointment.service?.name || 'Servicio no especificado',
      notes: appointment.notes
    }));
    
    setAppointments(transformedAppointments);
  } catch (error) {
    console.error('Error loading appointments:', error);
    // En caso de error, mostrar array vacío
    setAppointments([]);
  } finally {
    setLoading(false);
  }
};

  const cancelAppointment = async (appointmentId) => {
  if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
    try {
      // LLAMADA REAL AL BACKEND - Actualizar estado a "cancelled"
      await appointmentService.updateAppointment(appointmentId, { 
        status: 'cancelled' 
      });
      
      // Recargar la lista de citas para reflejar el cambio
      await loadAppointments();
      
      alert('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error al cancelar la cita. Intenta nuevamente.');
    }
  }
};

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending';
    if (filter === 'past') return apt.status === 'completed';
    if (filter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981', 
      completed: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada', 
      cancelled: 'Cancelada'
    };
    return texts[status] || status;
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
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          🗓️ Mis Citas
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona y revisa todas tus citas médicas
        </p>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'all', label: 'Todas' },
          { id: 'upcoming', label: 'Próximas' },
          { id: 'past', label: 'Pasadas' },
          { id: 'cancelled', label: 'Canceladas' }
        ].map(filterOption => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: filter === filterOption.id ? '#3b82f6' : 'white',
              color: filter === filterOption.id ? 'white' : '#374151',
              border: `1px solid ${filter === filterOption.id ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Lista de Citas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAppointments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <Calendar size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
              No hay citas {filter !== 'all' && ` ${filter}`}
            </h3>
            <p style={{ color: '#6b7280' }}>
              {filter === 'all' 
                ? 'No tienes citas programadas. ¡Agenda tu primera cita!' 
                : `No hay citas ${filter} en tu historial`}
            </p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <User size={16} color="#6b7280" />
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {appointment.professional_name}
                    </h3>
                  </div>
                  
                  <p style={{ 
                    color: '#3b82f6', 
                    fontWeight: '500',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {appointment.specialty}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(appointment.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {appointment.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#6b7280" />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {appointment.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(appointment.status),
                    color: 'white',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {getStatusText(appointment.status)}
                  </span>

                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <X size={14} />
                        <span style={{ fontSize: '0.75rem' }}>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;