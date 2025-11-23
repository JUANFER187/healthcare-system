import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ 
  appointment, 
  professional,
  onSubmit,
  onCancel,
  loading = false 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validaciones
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación';
    }
    if (comment.trim().length > 500) {
      newErrors.comment = 'El comentario no puede tener más de 500 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Enviar datos
    try {
      await onSubmit({
        appointment: appointment.id,
        rating,
        comment: comment.trim()
      });
    } catch (error) {
      setErrors({ submit: 'Error al enviar la reseña. Intenta nuevamente.' });
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          Califica tu experiencia
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Con el Dr. {professional?.first_name} {professional?.last_name}
        </p>
        <p style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          margin: '0.25rem 0 0 0'
        }}>
          Cita del {new Date(appointment?.appointment_date).toLocaleDateString()}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.submit && (
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
            {errors.submit}
          </div>
        )}

        {/* Calificación con estrellas */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            ¿Cómo calificarías tu experiencia? *
          </label>
          
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="xl"
            showLabel={true}
          />
          
          {errors.rating && (
            <p style={{
              color: '#dc2626',
              fontSize: '0.75rem',
              margin: '0.5rem 0 0 0'
            }}>
              {errors.rating}
            </p>
          )}
        </div>

        {/* Comentario opcional */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="comment" style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Comentario (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este profesional..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.comment ? '#fca5a5' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.25rem'
          }}>
            {errors.comment && (
              <span style={{
                color: '#dc2626',
                fontSize: '0.75rem'
              }}>
                {errors.comment}
              </span>
            )}
            <span style={{
              color: comment.length > 450 ? '#dc2626' : '#6b7280',
              fontSize: '0.75rem',
              marginLeft: 'auto'
            }}>
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
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
            disabled={loading || rating === 0}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: rating === 0 ? '#9ca3af' : '#2563eb',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: (loading || rating === 0) ? 'not-allowed' : 'pointer',
              opacity: (loading || rating === 0) ? 0.5 : 1,
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
                Enviando...
              </>
            ) : (
              'Enviar Reseña'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;