import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, Mail, MoreVertical, Filter } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    // Temporal - datos mock
    setTimeout(() => {
      setPatients([
        {
          id: 1,
          name: 'Ana García López',
          email: 'ana.garcia@email.com',
          phone: '+52 55 1234 5678',
          lastAppointment: '2024-01-10',
          nextAppointment: '2024-02-15',
          status: 'active',
          medicalHistory: 'Hipertensión controlada'
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          phone: '+52 55 2345 6789',
          lastAppointment: '2024-01-08',
          nextAppointment: null,
          status: 'inactive',
          medicalHistory: 'Consulta dermatológica'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
        <p>Cargando pacientes...</p>
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
          👥 Gestión de Pacientes
        </h1>
        <p style={{ color: '#6b7280' }}>
          Administra la información y el historial de tus pacientes
        </p>
      </div>

      {/* Controles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '1rem',
        marginBottom: '2rem',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <button style={{
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
        }}>
          <User size={16} />
          Nuevo Paciente
        </button>
      </div>

      {/* Lista de Pacientes */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}>
        {/* Header de la tabla */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
          gap: '1rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: '600',
          color: '#374151',
          fontSize: '0.875rem'
        }}>
          <div>Paciente</div>
          <div>Contacto</div>
          <div>Última Cita</div>
          <div>Próxima Cita</div>
          <div>Acciones</div>
        </div>

        {/* Lista de pacientes */}
        <div>
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '1rem',
                padding: '1.5rem',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center'
              }}
            >
              {/* Información del paciente */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {patient.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: patient.status === 'active' ? '#10b981' : '#6b7280',
                      fontWeight: '500'
                    }}>
                      {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
                {patient.medicalHistory && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    {patient.medicalHistory}
                  </div>
                )}
              </div>

              {/* Contacto */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  <Mail size={14} color="#6b7280" />
                  {patient.email}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <Phone size={14} />
                  {patient.phone}
                </div>
              </div>

              {/* Última cita */}
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {patient.lastAppointment 
                  ? new Date(patient.lastAppointment).toLocaleDateString('es-ES')
                  : 'Sin citas'
                }
              </div>

              {/* Próxima cita */}
              <div style={{ 
                fontSize: '0.875rem', 
                color: patient.nextAppointment ? '#10b981' : '#6b7280',
                fontWeight: patient.nextAppointment ? '600' : 'normal'
              }}>
                {patient.nextAppointment 
                  ? new Date(patient.nextAppointment).toLocaleDateString('es-ES')
                  : 'Sin programar'
                }
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  padding: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  Ver Historia
                </button>
                <button style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}>
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          marginTop: '2rem'
        }}>
          <User size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
            No se encontraron pacientes
          </h3>
          <p style={{ color: '#6b7280' }}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Aún no tienes pacientes registrados'
            }
          </p>
        </div>
      )}

      {/* Resumen */}
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
            {patients.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Pacientes Totales
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
            {patients.filter(p => p.status === 'active').length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Pacientes Activos
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
            {patients.filter(p => p.nextAppointment).length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Con Cita Programada
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;