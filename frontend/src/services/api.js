import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh falla, logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Servicios de autenticación - CORREGIR
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });  // ← CORREGIR ruta
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register/', userData);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Servicios de usuarios - CORREGIR getProfessionals
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  getProfessionals: async () => {
    try {
      const response = await api.get('/users/professionals/');
      return response.data;
    } catch (error) {
      console.error('Error fetching professionals:', error);
      // Fallback temporal mientras se crea el endpoint
      return [
        {
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez',
          specialty: 'Cardiología',
          license_number: 'LM-12345',
          email: 'juan.perez@example.com',
          phone_number: '+1234567890'
        }
      ];
    }
  }
};

// Servicios de citas - CONECTAR CON ENDPOINTS REALES
export const appointmentService = {
  getAppointments: async () => {
    const response = await api.get('/appointments/');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },

  updateAppointment: async (appointmentId, updates) => {
    const response = await api.patch(`/appointments/${appointmentId}/`, updates);
    return response.data;
  },

  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}/`);
    return response.data;
  },

  getServices: async () => {
    const response = await api.get('/appointments/services/');
    return response.data;
  }
};

export default api;