import React, { useState, useEffect } from 'react';
import { appointmentService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateAppointment = ({ onAppointmentCreated, onCancel }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    professional: '',
    service: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });
  
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.professional && formData.date) {
      loadAvailableSlots();
    }
  }, [formData.professional, formData.date]);

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
    if (!formData.professional || !formData.date) return;
    
    setLoadingSlots(true);
    try {
      const slots = await appointmentService.getAvailableSlots(formData.professional, formData.date);
      setAvailableSlots(slots);
    } catch (error) {
      console.warn('Using generated time slots:', error);
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (name === 'date' || name === 'professional') {
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    const newErrors = {};
    if (!formData.professional) newErrors.professional = 'Selecciona un profesional';
    if (!formData.service) newErrors.service = 'Selecciona un servicio';
    if (!formData.date) newErrors.date = 'Selecciona una fecha';
    if (!formData.time) newErrors.time = 'Selecciona un horario';
    if (!formData.reason) newErrors.reason = 'Indica el motivo de la consulta';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const professionalId = parseInt(formData.professional, 10);
      const serviceId = parseInt(formData.service, 10);
      
      if (isNaN(professionalId) || isNaN(serviceId)) {
        throw new Error('IDs de profesional o servicio inválidos');
      }

      let formattedTime = formData.time.trim();
      const timeParts = formattedTime.split(':');
      
      if (timeParts.length === 2) {
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        formattedTime = `${hours}:${minutes}:00`;
      } else if (timeParts.length === 3) {
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        const seconds = timeParts[2].padStart(2, '0');
        formattedTime = `${hours}:${minutes}:${seconds}`;
      } else {
        formattedTime = '09:00:00';
      }

      const appointmentData = {
        professional: professionalId,
        service: serviceId,
        date: formData.date,
        time: formattedTime,
        reason: formData.reason,
        notes: formData.notes || '',
        status: 'scheduled'
      };

      console.log('📤 Enviando cita al backend:', appointmentData);
      
      const createdAppointment = await appointmentService.createAppointment(appointmentData);
      
      setSuccess('¡Cita agendada exitosamente! 📅');
      
      setFormData({
        professional: '',
        service: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
      });
      setAvailableSlots([]);
      
      if (onAppointmentCreated) {
        onAppointmentCreated(createdAppointment);
      }
      
      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {
      console.error('❌ Error completo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data) {
        const backendErrors = error.response.data;
        
        if (typeof backendErrors === 'object') {
          const errorMessages = [];
          
          Object.keys(backendErrors).forEach(key => {
            if (Array.isArray(backendErrors[key])) {
              errorMessages.push(`${key}: ${backendErrors[key][0]}`);
            } else {
              errorMessages.push(`${key}: ${backendErrors[key]}`);
            }
          });
          
          if (errorMessages.length > 0) {
            setErrors({ general: errorMessages.join(', ') });
          } else if (backendErrors.detail) {
            setErrors({ general: backendErrors.detail });
          } else if (backendErrors.non_field_errors) {
            setErrors({ general: backendErrors.non_field_errors });
          }
        } else if (typeof backendErrors === 'string') {
          setErrors({ general: backendErrors });
        }
      } else {
        setErrors({ general: error.message || 'Error al agendar la cita' });
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
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const formatProfessionalName = (professional) => {
    const title = professional.gender === 'F' ? 'Dra.' : 'Dr.';
    return `${title} ${professional.first_name} ${professional.last_name}`;
  };

  if (loading && professionals.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
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
          Cargando profesionales y servicios...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
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
          {user?.user_type === 'professional' 
            ? 'Agendar cita para paciente' 
            : 'Completa los datos para programar tu cita médica'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>✅</span>
            <span>{success}</span>
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
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>❌</span>
            <span>{errors.general}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              required
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
                <option key={professional.id} value={professional.id.toString()}>
                  {formatProfessionalName(professional)} - {professional.specialty || 'General'}
                </option>
              ))}
            </select>
            {errors.professional && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                ⚠️ {errors.professional}
              </p>
            )}
          </div>

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
              required
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
                <option key={service.id} value={service.id.toString()}>
                  {service.name} - {service.duration || 30}min
                </option>
              ))}
            </select>
            {errors.service && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                ⚠️ {errors.service}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="date" style={{
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
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getTomorrowDate()}
                max={getMaxDate()}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.date ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
              {errors.date && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  ⚠️ {errors.date}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="time" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                ⏰ Hora *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={!formData.professional || !formData.date || loadingSlots}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.time ? '#fca5a5' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: !formData.professional || !formData.date || loadingSlots ? '#f9fafb' : 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">
                  {loadingSlots ? 'Cargando horarios...' : 
                   !formData.professional ? 'Selecciona profesional' :
                   !formData.date ? 'Selecciona fecha' : 
                   'Selecciona un horario'}
                </option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  ⚠️ {errors.time}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reason" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              📝 Motivo de consulta *
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Ej: Dolor de cabeza, Control rutinario..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.reason ? '#fca5a5' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
            {errors.reason && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.75rem',
                margin: '0.25rem 0 0 0'
              }}>
                ⚠️ {errors.reason}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="notes" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              📋 Notas adicionales (opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Información adicional, alergias, medicamentos..."
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

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
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
              cursor: loading ? 'not-allowed' : 'pointer'
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateAppointment;