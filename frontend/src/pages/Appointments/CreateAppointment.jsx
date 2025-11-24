import React, { useState, useEffect } from 'react';
import { appointmentService, userService } from '../services/api';

const CreateAppointment = ({ onAppointmentCreated, onCancel, professionalId }) => {
  const [formData, setFormData] = useState({
    professional: '',
    service: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Cargar profesionales y servicios
  useEffect(() => {
    loadInitialData();
  }, []);

  // Pre-seleccionar profesional si viene por parámetro
  useEffect(() => {
    if (professionalId) {
      setFormData(prev => ({
        ...prev,
        professional: professionalId
      }));
    }
}, [professionalId]);
  // Cargar horarios disponibles cuando cambie profesional o fecha
  useEffect(() => {
    if (formData.professional && formData.appointment_date) {
      loadAvailableSlots();
    }
  }, [formData.professional, formData.appointment_date]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [profsData, servicesData] = await Promise.all([
        userService.getProfessionals(),
        appointmentService.getServices()
      ]);
      setProfessionals(profsData);
      setServices(servicesData);
    } catch (error) {
      setErrors({ general: 'Error al cargar los datos iniciales' });
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!formData.professional || !formData.appointment_date) return;
    
    setLoadingSlots(true);
    try {
      // Simular horarios disponibles (en un sistema real, esto vendría del backend)
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 18; // 6:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // Cada 30 minutos
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    // Validaciones básicas
    const newErrors = {};
    if (!professionalId && !formData.professional) newErrors.professional = 'Selecciona un profesional';
    if (!formData.service) newErrors.service = 'Selecciona un servicio';
    if (!formData.appointment_date) newErrors.appointment_date = 'Selecciona una fecha';
    if (!formData.appointment_time) newErrors.appointment_time = 'Selecciona un horario';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await appointmentService.createAppointment(formData);
      setSuccess('¡Cita agendada exitosamente! 📅');
      
      // Limpiar formulario
      setFormData({
        professional: '',
        service: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });
      
      // Notificar al componente padre
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      // Manejar errores específicos del backend
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          setErrors(backendErrors);
        } else if (typeof backendErrors === 'string') {
          setErrors({ general: backendErrors });
        }
      } else {
        setErrors({ general: 'Error al agendar la cita. Intenta nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 meses en el futuro
    return maxDate.toISOString().split('T')[0];
  };

  if (loading && professionals.length === 0) {
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
          Cargando datos...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          🗓️ Agendar Nueva Cita
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Completa los datos para programar tu cita médica
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mensajes de éxito y error general */}
        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {errors.general && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {errors.general}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profesional - SOLO MOSTRAR SI NO VIENE PRE-SELECCIONADO */}
          {!professionalId && (
            <div>
              <label htmlFor="professional" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                👨‍⚕️ Profesional *
              </label>
              <select
                id="professional"
                name="professional"
                value={formData.professional}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.professional ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecciona un profesional</option>
                {professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    Dr. {professional.first_name} {professional.last_name} - {professional.specialty}
                  </option>
                ))}
              </select>
              {errors.professional && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.professional}
                </p>
              )}
            </div>
          )}

          {/* Mostrar info del profesional si viene pre-seleccionado */}
          {professionalId && (
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                👨‍⚕️ Profesional seleccionado: {professionals.find(p => p.id === professionalId)?.first_name} {professionals.find(p => p.id === professionalId)?.last_name}
              </p>
            </div>
          )}

          {/* Servicio */}
          <div>
            <label htmlFor="service" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              🩺 Servicio *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.service ? '#fca5a5' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Selecciona un servicio</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - ${service.price}
                </option>
              ))}
            </select>
            {errors.service && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.service}
              </p>
            )}
          </div>

          {/* Fecha y Hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Fecha */}
            <div>
              <label htmlFor="appointment_date" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📅 Fecha *
              </label>
              <input
                type="date"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={getTomorrowDate()}
                max={getMaxDate()}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.appointment_date ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
              {errors.appointment_date && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.appointment_date}
                </p>
              )}
            </div>

            {/* Hora */}
            <div>
              <label htmlFor="appointment_time" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                ⏰ Hora *
              </label>
              <select
                id="appointment_time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                disabled={!formData.professional || !formData.appointment_date || loadingSlots}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.appointment_time ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">
                  {loadingSlots ? 'Cargando horarios...' : 'Selecciona un horario'}
                </option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.appointment_time && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.appointment_time}
                </p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label htmlFor="notes" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              📝 Notas adicionales (opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Describe brevemente el motivo de tu consulta o alguna información adicional..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          marginTop: '2rem'
        }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  display: 'inline-block',
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem'
                }}></div>
                Agendando...
              </>
            ) : (
              'Agendar Cita'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;