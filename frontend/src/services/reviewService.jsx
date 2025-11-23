import api, { authService } from './api';

const reviewService = {
  // Obtener reseñas del usuario actual
  getMyReviews: async () => {
    try {
      const response = await api.get('/reviews/my_reviews/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting user reviews:', error);
      
      // Manejar error de autenticación
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      return { 
        success: false, 
        error: error.response?.data || 'Error al cargar las reseñas' 
      };
    }
  },

  // Crear nueva reseña
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews/', reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating review:', error);
      
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      const errorMessage = error.response?.data;
      
      // Mensajes de error específicos
      if (typeof errorMessage === 'object') {
        if (errorMessage.appointment) {
          return { success: false, error: errorMessage.appointment[0] };
        }
        if (errorMessage.rating) {
          return { success: false, error: errorMessage.rating[0] };
        }
        if (errorMessage.non_field_errors) {
          return { success: false, error: errorMessage.non_field_errors[0] };
        }
      }
      
      return { 
        success: false, 
        error: errorMessage || 'Error al crear la reseña' 
      };
    }
  },

  // Obtener reseñas de un profesional específico
  getProfessionalReviews: async (professionalId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/reviews/professional/${professionalId}/`, {
        params: { page, page_size: pageSize }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting professional reviews:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Error al cargar las reseñas del profesional' 
      };
    }
  },

  // Obtener estadísticas de un profesional
  getProfessionalStats: async (professionalId) => {
    try {
      const response = await api.get(`/reviews/professional/${professionalId}/stats/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error getting professional stats:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Error al cargar las estadísticas' 
      };
    }
  },

  // Actualizar reseña
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating review:', error);
      
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      return { 
        success: false, 
        error: error.response?.data || 'Error al actualizar la reseña' 
      };
    }
  },

  // Eliminar reseña
  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      return { 
        success: false, 
        error: error.response?.data || 'Error al eliminar la reseña' 
      };
    }
  },

  // Reportar reseña inapropiada
  reportReview: async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/report_review/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error reporting review:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Error al reportar la reseña' 
      };
    }
  },

  // Verificar si una cita puede ser reseñada
  canReviewAppointment: async (appointmentId) => {
    try {
      // Primero verificamos que la cita existe y pertenece al usuario
      const appointmentResponse = await api.get(`/appointments/${appointmentId}/`);
      const appointment = appointmentResponse.data;
      
      // Verificar que la cita está completada (finalizada)
      if (appointment.status !== 'completed') {
        return { 
          success: false, 
          canReview: false,
          error: 'Solo puedes reseñar citas finalizadas' 
        };
      }
      
      // Verificar que no existe ya una reseña para esta cita
      const myReviewsResponse = await api.get('/reviews/my_reviews/');
      const existingReview = myReviewsResponse.data.find(
        review => review.appointment === appointmentId
      );
      
      if (existingReview) {
        return { 
          success: false, 
          canReview: false,
          error: 'Ya has dejado una reseña para esta cita',
          existingReview 
        };
      }
      
      return { 
        success: true, 
        canReview: true,
        appointment 
      };
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      return { 
        success: false, 
        canReview: false,
        error: 'Error al verificar la cita' 
      };
    }
  },

  // Obtener citas completadas que pueden ser reseñadas
  getReviewableAppointments: async () => {
    try {
      // Obtener todas las citas del usuario
      const appointmentsResponse = await api.get('/appointments/');
      const myReviewsResponse = await api.get('/reviews/my_reviews/');
      
      const appointments = appointmentsResponse.data;
      const myReviews = myReviewsResponse.data;
      
      // Filtrar citas completadas que no tienen reseña
      const reviewableAppointments = appointments.filter(appointment => {
        const isCompleted = appointment.status === 'completed';
        const hasReview = myReviews.some(review => review.appointment === appointment.id);
        return isCompleted && !hasReview;
      });
      
      return { 
        success: true, 
        data: reviewableAppointments 
      };
    } catch (error) {
      console.error('Error getting reviewable appointments:', error);
      
      if (error.response?.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      
      return { 
        success: false, 
        error: 'Error al cargar las citas reseñables' 
      };
    }
  }
};

export default reviewService;