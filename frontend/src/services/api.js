import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios CON CONFIGURACIÓN SIMPLIFICADA
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token - SIN HEADERS CORS (los maneja el backend)
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

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
  login: async (username, password) => {
    console.log('🔐 Iniciando proceso de login...');
    
    const endpoints = [
      { url: '/auth/login/', method: 'POST', name: 'Login personalizado' },
      { url: '/auth/token/', method: 'POST', name: 'Simple JWT estándar' },
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Probando: ${endpoint.name} (${endpoint.url})`);
        
        const response = await axios.post(
          `${API_BASE_URL}${endpoint.url}`,
          { username, password },
          { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
        );
        
        console.log(`✅ ${endpoint.name} funcionó:`, response.status);
        
        let accessToken = null;
        let refreshToken = null;
        let userData = null;
        
        if (response.data.access && response.data.refresh) {
          accessToken = response.data.access;
          refreshToken = response.data.refresh;
          userData = response.data.user || { username, user_type: 'patient' };
        } else if (response.data.token) {
          accessToken = response.data.token;
          userData = response.data.user || response.data;
        } else if (response.data.user) {
          userData = response.data.user;
          accessToken = response.data.access || response.data.token;
          refreshToken = response.data.refresh;
        } else {
          userData = response.data;
          accessToken = response.data.access_token || response.data.token;
        }
        
        if (!accessToken) {
          console.warn('⚠️ No se recibió token de acceso');
          continue;
        }
        
        // Guardar en localStorage
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user_type', userData.user_type || 'patient');
        
        // Configurar axios para futuras requests
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        console.log('🎉 Login exitoso. Usuario:', userData);
        return {
          success: true,
          user: userData,
          token: accessToken,
          refresh: refreshToken
        };
        
      } catch (error) {
        console.log(`❌ ${endpoint.name} falló:`, error.response?.status || error.message);
        continue;
      }
    }
    
    console.error('❌ Todos los endpoints de login fallaron');
    throw new Error('No se pudo conectar con el servidor de autenticación.');
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No hay token de refresh disponible');
      
      console.log('🔄 Refrescando token...');
      const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000
      });
      
      if (response.data.access) {
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        console.log('✅ Token refrescado exitosamente');
        return newAccessToken;
      }
    } catch (error) {
      console.error('❌ Error al refrescar token:', error);
      authService.logout();
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('user_type', response.data.user_type || 'patient');
        return response.data;
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener perfil del endpoint, usando localStorage');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  },

  logout: () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },

  verifyToken: async (token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/token/verify/`, { 
        token 
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('❌ Token inválido o expirado:', error.message);
      return { valid: false };
    }
  },

  register: async (userData) => {
    try {
      console.log('📝 Registrando nuevo usuario...');
      const response = await api.post('/users/register/', {
        ...userData,
        user_type: userData.user_type || 'patient'
      });
      
      console.log('✅ Registro exitoso:', response.data);
      
      if (response.data.access || response.data.token) {
        const loginResult = await authService.login(
          userData.username || userData.email,
          userData.password
        );
        return loginResult;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      throw error;
    }
  }
};

// ==================== SERVICIOS DE USUARIOS ====================
export const userService = {
  getProfile: async () => {
    return await authService.getCurrentUser();
  },

  getProfessionals: async () => {
    try {
      const response = await api.get('/users/professionals/');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Usando datos de profesionales de respaldo');
      return [
        {
          id: 1,
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

  getPatients: async () => {
    try {
      const response = await api.get('/users/');
      if (response.data && Array.isArray(response.data)) {
        return response.data.filter(user => user.user_type === 'patient');
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
      return [];
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/users/me/', userData);
      if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }
};

// ==================== SERVICIOS DE CITAS ====================
export const appointmentService = {
  getAppointments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });
      
      const queryString = params.toString();
      const url = queryString ? `/appointments/?${queryString}` : '/appointments/';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      return [];
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo cita ${id}:`, error);
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      console.log('📅 Creando nueva cita:', appointmentData);
      
      // Validar que el usuario sea paciente
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('No autenticado');
      const user = JSON.parse(userStr);
      if (user.user_type !== 'patient') {
        throw new Error('Solo los pacientes pueden crear citas');
      }
      
      // Formatear datos correctamente
      const formattedData = {
        professional: parseInt(appointmentData.professional),
        service: parseInt(appointmentData.service),
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time.includes(':') 
          ? appointmentData.appointment_time 
          : `${appointmentData.appointment_time}:00`,
        notes: appointmentData.notes || ''
      };
      
      console.log('📤 Enviando datos formateados:', formattedData);
      
      const response = await api.post('/appointments/', formattedData);
      console.log('✅ Cita creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando cita:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  updateAppointment: async (id, updates) => {
    try {
      const response = await api.patch(`/appointments/${id}/`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando cita ${id}:`, error);
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando cita ${id}:`, error);
      throw error;
    }
  },

  getServices: async () => {
    try {
      const response = await api.get('/appointments/services/');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Usando datos de servicios de respaldo');
      return [
        { id: 1, name: 'Consulta General', duration: 30, price: 50 },
        { id: 2, name: 'Control de Rutina', duration: 20, price: 30 },
        { id: 3, name: 'Consulta Especializada', duration: 45, price: 80 },
        { id: 4, name: 'Urgencia', duration: 60, price: 100 }
      ];
    }
  },

  getAvailableSlots: async (professionalId, date) => {
    try {
      const response = await api.get('/appointments/available-slots/', {
        params: { professional_id: professionalId, date: date }
      });
      return response.data;
    } catch (error) {
      console.warn('⚠️ Generando horarios de respaldo');
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

// ==================== OTROS SERVICIOS ====================
export const medicalHistoryService = {
  getHistory: async (patientId = null) => {
    try {
      const url = patientId 
        ? `/clinic-history/?patient_id=${patientId}`
        : '/clinic-history/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await api.post('/clinic-history/', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creando registro:', error);
      throw error;
    }
  },

  updateRecord: async (id, updates) => {
    try {
      const response = await api.patch(`/clinic-history/${id}/`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando registro ${id}:`, error);
      throw error;
    }
  }
};

export const clinicService = {
  getClinics: async () => {
    try {
      const response = await api.get('/clinics/');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Usando datos de consultorios de respaldo');
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

if (typeof window !== 'undefined') {
  setupAxiosHeaders();
}

export const testConnection = async () => {
  console.log('🔍 Probando conexión con backend...');
  try {
    const djangoTest = await axios.get('http://localhost:8000/', { timeout: 5000 });
    console.log('✅ Django responde:', djangoTest.status);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
};

export default api;