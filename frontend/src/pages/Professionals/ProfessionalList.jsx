import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api'; // ← CORREGIDO
import StarRating from '../../components/StarRating';
import ProfessionalStats from '../../components/ProfessionalStats';

const ProfessionalList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [minRating, setMinRating] = useState(0);

  // Especialidades disponibles (en un sistema real vendrían del backend)
  const specialties = [
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Ginecología',
    'Ortopedia',
    'Neurología',
    'Psiquiatría',
    'Medicina General',
    'Oftalmología',
    'Otorrinolaringología'
  ];

  useEffect(() => {
    loadProfessionals();
  }, []);

  // Filtrar profesionales cuando cambien los filtros
  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchTerm, selectedSpecialty, minRating]);

  const loadProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getProfessionals();
      setProfessionals(data);
    } catch (err) {
      setError('Error al cargar los profesionales');
      console.error('Error loading professionals:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = [...professionals];

    // Filtrar por término de búsqueda (nombre o especialidad)
    if (searchTerm) {
      filtered = filtered.filter(professional =>
        professional.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por especialidad
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(professional =>
        professional.specialty === selectedSpecialty
      );
    }

    // Filtrar por rating mínimo (simulado por ahora)
    if (minRating > 0) {
      filtered = filtered.filter(professional => {
        // En un sistema real, esto vendría de las estadísticas del profesional
        const simulatedRating = Math.floor(Math.random() * 3) + 3; // 3-5 estrellas para demo
        return simulatedRating >= minRating;
      });
    }

    setFilteredProfessionals(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setMinRating(0);
  };

  // Simular rating para demo (en un sistema real vendría de las estadísticas)
  const getSimulatedRating = (professionalId) => {
    // Usar el ID para generar un rating "consistente" pero aleatorio
    const seed = professionalId * 12345;
    return (seed % 3) + 3; // 3-5 estrellas
  };

  const getSimulatedReviewCount = (professionalId) => {
    const seed = professionalId * 67890;
    return (seed % 50) + 10; // 10-59 reseñas
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
            Cargando profesionales...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
            {error}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            No pudimos cargar la lista de profesionales.
          </p>
          <button
            onClick={loadProfessionals}
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
            Reintentar
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
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              👨‍⚕️ Nuestros Profesionales
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: '0 0 2rem 0'
            }}>
              Encuentra al especialista perfecto para tu salud
            </p>
          </div>

          {/* Filtros de Búsqueda */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Búsqueda por nombre/especialidad */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🔍 Buscar profesional o especialidad
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej: Dr. García o Cardiología..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Filtro por especialidad */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🩺 Especialidad
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="all">Todas las especialidades</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por rating mínimo */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                ⭐ Rating mínimo
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value={0}>Cualquier rating</option>
                <option value={4}>4+ estrellas</option>
                <option value={3}>3+ estrellas</option>
              </select>
            </div>
          </div>

          {/* Contadores y Clear Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Mostrando {filteredProfessionals.length} de {professionals.length} profesionales
            </div>

            {(searchTerm || selectedSpecialty !== 'all' || minRating > 0) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Lista de Profesionales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map(professional => {
              const rating = getSimulatedRating(professional.id);
              const reviewCount = getSimulatedReviewCount(professional.id);

              return (
                <div
                  key={professional.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <Link
                    to={`/professional/${professional.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {professional.first_name[0]}{professional.last_name[0]}
                      </div>

                      {/* Información */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.5rem 0'
                        }}>
                          Dr. {professional.first_name} {professional.last_name}
                        </h3>

                        <p style={{
                          fontSize: '1rem',
                          color: '#3b82f6',
                          fontWeight: '600',
                          margin: '0 0 0.75rem 0'
                        }}>
                          {professional.specialty}
                        </p>

                        {/* Rating */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <StarRating 
                            rating={rating}
                            readonly={true}
                            size="sm"
                          />
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}>
                            {rating.toFixed(1)} ({reviewCount} reseñas)
                          </span>
                        </div>

                        {/* Información adicional */}
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          <div style={{ marginBottom: '0.25rem' }}>
                            <strong>Licencia:</strong> {professional.license_number || 'LM-12345'}
                          </div>
                          <div>
                            <strong>Experiencia:</strong> 8+ años
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                      >
                        📅 Agendar Cita
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                No se encontraron profesionales
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: '0 0 2rem 0'
              }}>
                Intenta ajustar tus filtros de búsqueda
              </p>
              <button
                onClick={clearFilters}
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
                Ver todos los profesionales
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalList;