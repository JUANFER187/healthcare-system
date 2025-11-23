import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { useReviews } from '../hooks/useReviews';

const ReviewList = ({ 
  professionalId, 
  showFilters = true,
  limit = 5,
  compact = false 
}) => {
  const { 
    reviews: allReviews, 
    loading, 
    error,
    loadReviews 
  } = useReviews(professionalId);
  
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    rating: 'all',
    sort: 'newest'
  });

  // Aplicar filtros y paginación cuando cambien los datos o filtros
  useEffect(() => {
    if (allReviews && allReviews.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allReviews, currentPage, filters, limit]);

  const applyFiltersAndPagination = () => {
    let filteredReviews = [...allReviews];
    
    // Filtrar por rating
    if (filters.rating !== 'all') {
      filteredReviews = filteredReviews.filter(
        review => review.rating === parseInt(filters.rating)
      );
    }
    
    // Ordenar
    if (filters.sort === 'newest') {
      filteredReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filters.sort === 'oldest') {
      filteredReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (filters.sort === 'highest') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'lowest') {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    }
    
    // Paginación
    const startIndex = (currentPage - 1) * limit;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredReviews.length / limit);
    
    setReviews(paginatedReviews);
    setTotalPages(totalPages);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Manejar recarga de datos
  const handleRetry = () => {
    loadReviews();
  };

  if (loading && allReviews.length === 0) {
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
          Cargando reseñas...
        </p>
      </div>
    );
  }

  if (error && allReviews.length === 0) {
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
          onClick={handleRetry}
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
          📝 Reseñas de Pacientes
        </h3>
        
        {allReviews.length > 0 && (
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {allReviews.length} {allReviews.length === 1 ? 'reseña' : 'reseñas'}
          </span>
        )}
      </div>

      {/* Filtros */}
      {showFilters && allReviews.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Todas las calificaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
          </select>
        </div>
      )}

      {/* Lista de reseñas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '1rem' : '1.5rem' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: compact ? '1rem' : '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            >
              {/* Header de la reseña */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{
                      fontSize: compact ? '0.875rem' : '0.875rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {review.patient_name}
                    </span>
                    {review.is_verified && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#059669',
                        backgroundColor: '#dcfce7',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        ✓ Verificada
                      </span>
                    )}
                  </div>
                  <StarRating 
                    rating={review.rating} 
                    readonly={true}
                    size={compact ? "sm" : "md"}
                  />
                </div>
                
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  {formatDate(review.created_at)}
                </span>
              </div>

              {/* Comentario */}
              {review.comment && (
                <p style={{
                  fontSize: compact ? '0.875rem' : '0.875rem',
                  color: '#374151',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))
        ) : allReviews.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '500' }}>
              No hay reseñas aún
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Sé el primero en dejar una reseña para este profesional
            </p>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No hay reseñas que coincidan con los filtros seleccionados
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              fontSize: '0.875rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Anterior
          </button>
          
          <span style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              fontSize: '0.875rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;