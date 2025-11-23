import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';

export const useReviews = (professionalId = null) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar reseñas del usuario o de un profesional
  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (professionalId) {
        result = await reviewService.getProfessionalReviews(professionalId);
      } else {
        result = await reviewService.getMyReviews();
      }
      
      if (result.success) {
        setReviews(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas de un profesional
  const loadStats = async (profId = professionalId) => {
    if (!profId) return;
    
    setLoading(true);
    try {
      const result = await reviewService.getProfessionalStats(profId);
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reseña
  const createReview = async (reviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await reviewService.createReview(reviewData);
      if (result.success) {
        // Recargar las reseñas después de crear una nueva
        await loadReviews();
        if (professionalId) {
          await loadStats();
        }
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Error al crear la reseña';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reseña
  const deleteReview = async (reviewId) => {
    setLoading(true);
    try {
      const result = await reviewService.deleteReview(reviewId);
      if (result.success) {
        // Remover la reseña del estado local
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        if (professionalId) {
          await loadStats();
        }
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Error al eliminar la reseña';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadReviews();
    if (professionalId) {
      loadStats();
    }
  }, [professionalId]);

  return {
    reviews,
    stats,
    loading,
    error,
    createReview,
    deleteReview,
    loadReviews,
    loadStats,
    refetch: loadReviews
  };
};