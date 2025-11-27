import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, Stethoscope, Pill, FileSearch } from 'lucide-react';

const MedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consultations'); // consultations, prescriptions, documents

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    // Temporal - después conectar con backend
    setTimeout(() => {
      setMedicalRecords([
        {
          id: 1,
          type: 'consultation',
          date: '2024-01-10',
          professional: 'Dr. Juan Pérez - Cardiología',
          diagnosis: 'Hipertensión arterial controlada',
          symptoms: 'Control rutinario de presión arterial',
          treatment: 'Continuar con medicación actual',
          notes: 'Paciente estable, presión 120/80 mmHg',
          documents: ['analisis_sangre.pdf', 'electro.pdf']
        },
        {
          id: 2,
          type: 'prescription', 
          date: '2024-01-10',
          professional: 'Dr. Juan Pérez - Cardiología',
          medication: 'Losartán 50mg',
          dosage: '1 tableta cada 24 horas',
          duration: '30 días',
          instructions: 'Tomar en la mañana con alimentos'
        },
        {
          id: 3,
          type: 'consultation',
          date: '2023-12-15', 
          professional: 'Dra. María García - Dermatología',
          diagnosis: 'Dermatitis atópica',
          symptoms: 'Erupciones en brazos y torso',
          treatment: 'Crema hidratante + antihistamínico',
          notes: 'Mejoría notable en 2 semanas'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const consultations = medicalRecords.filter(record => record.type === 'consultation');
  const prescriptions = medicalRecords.filter(record => record.type === 'prescription');
  const documents = medicalRecords.flatMap(record => 
    (record.documents || []).map(doc => ({
      id: `${record.id}-${doc}`,
      name: doc,
      date: record.date,
      professional: record.professional,
      type: 'document'
    }))
  );

  const getCurrentRecords = () => {
    switch(activeTab) {
      case 'consultations': return consultations;
      case 'prescriptions': return prescriptions;
      case 'documents': return documents;
      default: return [];
    }
  };

  const downloadDocument = (documentName) => {
    // Temporal - simular descarga
    alert(`Descargando: ${documentName}`);
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
        <p>Cargando historial médico...</p>
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
          📋 Mi Historial Médico
        </h1>
        <p style={{ color: '#6b7280' }}>
          Accede a tu historial completo de consultas, recetas y documentos médicos
        </p>
      </div>

      {/* Tabs de Navegación */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        {[
          { id: 'consultations', label: '🩺 Consultas', icon: Stethoscope, count: consultations.length },
          { id: 'prescriptions', label: '💊 Recetas', icon: Pill, count: prescriptions.length },
          { id: 'documents', label: '📄 Documentos', icon: FileText, count: documents.length }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative'
              }}
            >
              <IconComponent size={16} />
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  backgroundColor: activeTab === tab.id ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  borderRadius: '1rem',
                  padding: '0.125rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  marginLeft: '0.25rem'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido de los Tabs */}
      <div>
        {activeTab === 'consultations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {consultations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <Stethoscope size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                  No hay consultas registradas
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Tu historial de consultas aparecerá aquí después de tus visitas médicas
                </p>
              </div>
            ) : (
              consultations.map(consultation => (
                <div
                  key={consultation.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid '#e5e7eb',
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
                        <Calendar size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(consultation.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <User size={16} color="#6b7280" />
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>
                          {consultation.professional}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <strong style={{ color: '#374151' }}>Diagnóstico:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {consultation.diagnosis}
                          </p>
                        </div>

                        <div>
                          <strong style={{ color: '#374151' }}>Síntomas reportados:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {consultation.symptoms}
                          </p>
                        </div>

                        <div>
                          <strong style={{ color: '#374151' }}>Tratamiento:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {consultation.treatment}
                          </p>
                        </div>

                        {consultation.notes && (
                          <div>
                            <strong style={{ color: '#374151' }}>Notas del médico:</strong>
                            <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                              {consultation.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {consultation.documents && consultation.documents.length > 0 && (
                    <div style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <strong style={{ color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                        Documentos adjuntos:
                      </strong>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {consultation.documents.map((doc, index) => (
                          <button
                            key={index}
                            onClick={() => downloadDocument(doc)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              border: '1px solid '#e5e7eb',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              color: '#374151',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#e5e7eb';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#f3f4f6';
                            }}
                          >
                            <FileText size={14} />
                            {doc}
                            <Download size={14} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {prescriptions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <Pill size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                  No hay recetas médicas
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Tus recetas médicas aparecerán aquí después de ser prescritas
                </p>
              </div>
            ) : (
              prescriptions.map(prescription => (
                <div
                  key={prescription.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid '#e5e7eb',
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
                        <Calendar size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(prescription.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <User size={16} color="#6b7280" />
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>
                          {prescription.professional}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div>
                          <strong style={{ color: '#374151' }}>Medicamento:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {prescription.medication}
                          </p>
                        </div>

                        <div>
                          <strong style={{ color: '#374151' }}>Dosis:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {prescription.dosage}
                          </p>
                        </div>

                        <div>
                          <strong style={{ color: '#374151' }}>Duración:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {prescription.duration}
                          </p>
                        </div>

                        <div>
                          <strong style={{ color: '#374151' }}>Instrucciones:</strong>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                            {prescription.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {documents.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <FileSearch size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                  No hay documentos médicos
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Tus documentos médicos aparecerán aquí después de tus consultas
                </p>
              </div>
            ) : (
              documents.map(document => (
                <div
                  key={document.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid '#e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <FileText size={16} color="#6b7280" />
                      <span style={{ fontWeight: '500', color: '#1f2937' }}>
                        {document.name}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        Fecha: {new Date(document.date).toLocaleDateString('es-ES')}
                      </div>
                      <div>Médico: {document.professional}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadDocument(document.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;