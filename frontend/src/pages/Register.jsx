import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Stethoscope, User, Lock, Phone, Calendar } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    user_type: 'patient',
    password: '',
    password_confirmation: '',
    specialty: '',
    license_number: '',
    clinic_name: '',
    clinic_address: '',
    phone: '',
    date_of_birth: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = { ...formData };
    
    if (formData.user_type === 'patient') {
      delete submitData.specialty;
      delete submitData.license_number;
      delete submitData.clinic_name;
      delete submitData.clinic_address;
    }
    
    if (formData.user_type === 'professional') {
      delete submitData.phone;
      delete submitData.date_of_birth;
    }

    const result = await register(submitData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(typeof result.error === 'object' ? 
        JSON.stringify(result.error) : result.error);
    }

    setLoading(false);
  };

  const isProfessional = formData.user_type === 'professional';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Header - Unificado con login */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#2563eb',
            marginBottom: '0.5rem'
          }}>
            SaludDigital
          </h1>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Crear Cuenta
          </h2>
          <p style={{ 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            O{' '}
            <Link
              to="/login"
              style={{ 
                color: '#2563eb', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              iniciar sesión en tu cuenta
            </Link>
          </p>
        </div>

        {/* Card Principal */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Selector de Tipo de Usuario */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, user_type: 'patient' }))}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${!isProfessional ? '#2563eb' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                backgroundColor: !isProfessional ? '#eff6ff' : 'white',
                color: !isProfessional ? '#2563eb' : '#6b7280',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <User size={20} style={{ marginBottom: '0.5rem' }} />
              Paciente
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, user_type: 'professional' }))}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${isProfessional ? '#2563eb' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                backgroundColor: isProfessional ? '#eff6ff' : 'white',
                color: isProfessional ? '#2563eb' : '#6b7280',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
              }}
            >
              <Stethoscope size={20} style={{ marginBottom: '0.5rem' }} />
              Profesional
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
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
                {error}
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Nombre y Apellido */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem'
              }}>
                <div>
                  <label htmlFor="first_name" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Nombre *
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Tu nombre"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="last_name" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Apellido *
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Tu apellido"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Teléfono - AHORA OBLIGATORIO PARA TODOS */}
              <div>
                <label htmlFor="phone" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <Phone style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    display: 'inline', 
                    marginRight: '0.5rem',
                    verticalAlign: 'middle' 
                  }} />
                  Teléfono *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+52 123 456 7890"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  fontStyle: 'italic'
                }}>
                  📱 Importante para recordatorios de citas vía WhatsApp
                </p>
              </div>

              {/* Campos Específicos para PROFESIONALES */}
              {isProfessional ? (
                <>
                  <div>
                    <label htmlFor="specialty" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Especialidad *
                    </label>
                    <input
                      id="specialty"
                      name="specialty"
                      type="text"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Ej: Cardiología, Pediatría, etc."
                      value={formData.specialty}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="license_number" style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Número de Licencia *
                    </label>
                    <input
                      id="license_number"
                      name="license_number"
                      type="text"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Número de licencia profesional"
                      value={formData.license_number}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                /* Fecha de Nacimiento - AHORA OBLIGATORIA PARA PACIENTES */
                <div>
                  <label htmlFor="date_of_birth" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Calendar style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      display: 'inline', 
                      marginRight: '0.5rem',
                      verticalAlign: 'middle' 
                    }} />
                    Fecha de Nacimiento *
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Contraseñas */}
              <div>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#9ca3af'
                  }} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength="8"
                    style={{
                      width: '100%',
                      padding: '0.5rem 2.5rem 0.5rem 2.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25rem',
                      borderRadius: '0.25rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#9ca3af';
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Confirmar Contraseña *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#9ca3af'
                  }} />
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 2.5rem 0.5rem 2.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Repite tu contraseña"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25rem',
                      borderRadius: '0.25rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#9ca3af';
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Mostrar/ocultar contraseña - Control único para ambos */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                marginTop: '1.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (!loading) e.target.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                if (!loading) e.target.style.backgroundColor = '#2563eb';
              }}
            >
              {loading ? 'Creando cuenta...' : `Registrarse como ${isProfessional ? 'Profesional' : 'Paciente'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;