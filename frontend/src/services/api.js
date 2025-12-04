import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
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

// Interceptor para manejar refresh token y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Solo manejar errores 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intentar refrescar el token
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Reintentar la request original
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Limpiar localStorage y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        
        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Para otros errores, mostrar mensaje útil
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      console.error('Network Error - No response received');
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ==================== SERVICIOS DE AUTENTICACIÓN ====================
export const authService = {
  // Login con Simple JWT (estándar)
  login: async (username, password) => {
    const response = await api.post('/token/', {
      username, // Simple JWT espera 'username', no 'email'
      password
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Obtener datos del usuario después del login
      const userResponse = await api.get('/users/me/');
      const userData = userResponse.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_type', userData.user_type || 'patient');
    }
    
    return response.data;
  },

  // Registro - endpoint común en Django
  register: async (userData) => {
    const response = await api.post('/users/register/', {
      ...userData,
      user_type: userData.user_type || 'patient'
    });
    
    // Si el registro incluye login automático
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('user_type', response.data.user.user_type);
    }
    
    return response.data;
  },

  // Obtener perfil actual
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout (solo frontend)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    window.location.href = '/login';
  },

  // Verificar token
  verifyToken: async (token) => {
    const response = await api.post('/token/verify/', { token });
    return response.data;
  }
};

// ==================== SERVICIOS DE USUARIOS ====================
export const userService = {
  // Obtener perfil del usuario logueado
  getProfile: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  // Obtener todos los profesionales (filtrado por user_type)
  getProfessionals: async () => {
    try {
      // Opción 1: Si tienes endpoint específico
      // const response = await api.get('/users/professionals/');
      
      // Opción 2: Filtrar de todos los usuarios
      const response = await api.get('/users/');
      const professionals = response.data.filter(user => 
        user.user_type === 'professional' || user.is_professional
      );
      return professionals;
    } catch (error) {
      console.warn('Using fallback professionals data');
      // Fallback temporal para desarrollo
      return [
        {
          id: 1,
          username: 'drjuan',
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan.perez@clinic.com',
          specialty: 'Cardiología',
          license_number: 'LM-12345',
          phone_number: '+1234567890',
          user_type: 'professional'
        },
        {
          id: 2,
          username: 'draana',
          first_name: 'Ana',
          last_name: 'García',
          email: 'ana.garcia@clinic.com',
          specialty: 'Pediatría',
          license_number: 'LM-67890',
          phone_number: '+0987654321',
          user_type: 'professional'
        }
      ];
    }
  },

  // Obtener pacientes (para profesionales)
  getPatients: async () => {
    try {
      const response = await api.get('/users/');
      const patients = response.data.filter(user => 
        user.user_type === 'patient'
      );
      return patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.patch('/users/me/', userData);
    return response.data;
  }
};

// ==================== SERVICIOS DE CITAS (CRUD COMPLETO) ====================
export const appointmentService = {
  // Obtener todas las citas (con filtros opcionales)
  getAppointments: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Agregar filtros dinámicos
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/appointments/?${queryString}` : '/appointments/';
    
    const response = await api.get(url);
    return response.data;
  },

  // Obtener cita por ID
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}/`);
    return response.data;
  },

  // Crear nueva cita
  createAppointment: async (appointmentData) => {
    // Formatear datos para Django
    const formattedData = {
      date: appointmentData.date, // Formato: YYYY-MM-DD
      time: appointmentData.time, // Formato: HH:MM:SS
      reason: appointmentData.reason || '',
      notes: appointmentData.notes || '',
      status: appointmentData.status || 'scheduled',
      
      // Relaciones (ajustar según tu modelo)
      patient: appointmentData.patient_id,
      professional: appointmentData.professional_id,
      service: appointmentData.service_id || null
    };
    
    const response = await api.post('/appointments/', formattedData);
    return response.data;
  },

  // Actualizar cita
  updateAppointment: async (id, updates) => {
    const response = await api.patch(`/appointments/${id}/`, updates);
    return response.data;
  },

  // Eliminar cita
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}/`);
    return response.data;
  },

  // Obtener servicios disponibles
  getServices: async () => {
    try {
      const response = await api.get('/appointments/services/');
      return response.data;
    } catch (error) {
      console.warn('Using fallback services data');
      // Fallback temporal
      return [
        { id: 1, name: 'Consulta General', duration: 30, price: 50 },
        { id: 2, name: 'Control de Rutina', duration: 20, price: 30 },
        { id: 3, name: 'Especialidad', duration: 45, price: 80 },
        { id: 4, name: 'Urgencia', duration: 60, price: 100 }
      ];
    }
  },

  // Obtener horarios disponibles
  getAvailableSlots: async (professionalId, date) => {
    try {
      const response = await api.get('/appointments/available-slots/', {
        params: { professional_id: professionalId, date }
      });
      return response.data;
    } catch (error) {
      console.warn('Using fallback time slots');
      // Fallback: generar horarios de 9am a 5pm
      const slots = [];
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00:00`);
        if (hour < 17) {
          slots.push(`${hour.toString().padStart(2, '0')}:30:00`);
        }
      }
      return slots;
    }
  }
};

// ==================== SERVICIOS DE HISTORIAL CLÍNICO ====================
export const medicalHistoryService = {
  getHistory: async (patientId = null) => {
    const url = patientId 
      ? `/clinic-history/?patient_id=${patientId}`
      : '/clinic-history/';
    
    const response = await api.get(url);
    return response.data;
  },

  createRecord: async (recordData) => {
    const response = await api.post('/clinic-history/', recordData);
    return response.data;
  },

  updateRecord: async (id, updates) => {
    const response = await api.patch(`/clinic-history/${id}/`, updates);
    return response.data;
  }
};

// ==================== SERVICIOS DE CONSULTORIOS ====================
export const clinicService = {
  getClinics: async () => {
    try {
      const response = await api.get('/clinics/');
      return response.data;
    } catch (error) {
      console.warn('Using fallback clinics data');
      return [
        { 
          id: 1, 
          name: 'Clínica Central', 
          address: 'Av. Principal 123', 
          phone: '+1234567890',
          services: ['General', 'Pediatría', 'Cardiología']
        },
        { 
          id: 2, 
          name: 'Consultorio Norte', 
          address: 'Calle Secundaria 456', 
          phone: '+0987654321',
          services: ['Dermatología', 'Oftalmología']
        }
      ];
    }
  }
};

// ==================== UTILIDADES ====================
export const setupAxiosHeaders = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Configurar headers al cargar
setupAxiosHeaders();

// Exportar la instancia de axios por si acaso
export default api;