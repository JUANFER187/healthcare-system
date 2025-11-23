import React from 'react';
import StarRating from './StarRating';
import { useReviews } from '../hooks/useReviews';

const ProfessionalStats = ({ professionalId, loading = false }) => {
  const { stats, loading: reviewsLoading } = useReviews(professionalId);

  // Usar el loading prop o el del hook
  const isLoading = loading || reviewsLoading;

  if (isLoading) {
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
          Cargando estadísticas...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          No hay estadísticas disponibles
        </p>
      </div>
    );
  }

  const { average_rating, total_reviews, rating_distribution } = stats;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1f2937',
        margin: '0 0 1.5rem 0',
        textAlign: 'center'
      }}>
        📊 Calificaciones
      </h3>

      {/* Promedio y total */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#1f2937',
            lineHeight: '1'
          }}>
            {average_rating}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <StarRating 
              rating={Math.round(average_rating)} 
              readonly={true}
              size="md"
            />
          </div>
        </div>

        <div style={{
          height: '4rem',
          width: '1px',
          backgroundColor: '#e5e7eb'
        }}></div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            lineHeight: '1'
          }}>
            {total_reviews}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            {total_reviews === 1 ? 'reseña' : 'reseñas'}
          </div>
        </div>
      </div>

      {/* Distribución de calificaciones */}
      <div>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 1rem 0'
        }}>
          Distribución de calificaciones
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = rating_distribution[`${rating}_estrellas`] || 0;
            const count = Math.round((percentage / 100) * total_reviews);
            
            return (
              <div key={rating} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                {/* Estrellas */}
                <div style={{ width: '6rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: '500',
                    minWidth: '1.5rem'
                  }}>
                    {rating}
                  </span>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" className="text-yellow-400 ml-1">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>

                {/* Barra de progreso */}
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: 
                        rating >= 4 ? '#10b981' : 
                        rating >= 3 ? '#f59e0b' : '#ef4444',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                {/* Porcentaje y conteo */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '5rem',
                  justifyContent: 'flex-end'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {percentage}%
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af'
                  }}>
                    ({count})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>
            Calificación promedio:
          </span>
          <span style={{ color: '#1f2937', fontWeight: '600' }}>
            {average_rating} de 5 estrellas
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          marginTop: '0.5rem'
        }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>
            Total de reseñas:
          </span>
          <span style={{ color: '#1f2937', fontWeight: '600' }}>
            {total_reviews} {total_reviews === 1 ? 'reseña' : 'reseñas'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStats;