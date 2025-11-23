import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import reviewService from '../services/reviewService';

const RateAppointmentButton = ({ appointment, professional, onReviewSubmitted }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(null);
  const [checking, setChecking] = useState(false);

  // Verificar si la cita puede ser reseñada
  const checkReviewEligibility = async () => {
    setChecking(true);
    try {
      const result = await reviewService.canReviewAppointment(appointment.id);
      setCanReview(result);
      
      if (result.canReview) {
        setShowReviewForm(true);
      } else {
        alert(result.error); // O mostrar un modal de error más elegante
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      alert('Error al verificar la cita');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    setLoading(true);
    try {
      const result = await reviewService.createReview(reviewData);
      if (result.success) {
        setShowReviewForm(false);
        if (onReviewSubmitted) {
          onReviewSubmitted(result.data);
        }
        alert('¡Reseña enviada exitosamente! 🌟');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  // Solo mostrar botón si la cita está completada
  if (appointment.status !== 'completed') {
    return null;
  }

  return (
    <>
      <button
        onClick={checkReviewEligibility}
        disabled={checking}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: checking ? 'not-allowed' : 'pointer',
          opacity: checking ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => !checking && (e.target.style.backgroundColor = '#059669')}
        onMouseOut={(e) => !checking && (e.target.style.backgroundColor = '#10b981')}
      >
        {checking ? (
          <>
            <div style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Verificando...
          </>
        ) : (
          <>
            ⭐ Calificar
          </>
        )}
      </button>

      {showReviewForm && canReview?.canReview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <ReviewForm
            appointment={appointment}
            professional={professional}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
            loading={loading}
          />
        </div>
      )}
    </>
  );
};

export default RateAppointmentButton;