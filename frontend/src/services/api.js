import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia SIMPLE sin configuraciones complicadas
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Solo agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejo básico de errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar y redirigir
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_type');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

// ==================== SERVICIOS BÁSICOS ====================
export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        { username, password },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      const { access, refresh, user } = response.data;
      
      if (!access) {
        throw new Error('No se recibió token');
      }
      
      // Guardar
      localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_type', user.user_type || 'patient');
      }
      
      // Configurar axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return { success: true, user: user || { username }, token: access };
      
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error('Credenciales inválidas');
    }
  },
  
  logout: () => {
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_type', user.user_type || 'patient');
      return user;
    } catch (error) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  }
};

export const appointmentService = {
  getAppointments: async () => {
    try {
      const response = await api.get('/appointments/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo citas:', error.message);
      return [];
    }
  },
  
  createAppointment: async (appointmentData) => {
    try {
      // Validar que sea paciente
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('No autenticado');
      const user = JSON.parse(userStr);
      if (user.user_type !== 'patient') {
        throw new Error('Solo pacientes pueden crear citas');
      }
      
      const formattedData = {
        professional: parseInt(appointmentData.professional),
        service: parseInt(appointmentData.service),
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time.includes(':') 
          ? appointmentData.appointment_time 
          : `${appointmentData.appointment_time}:00`,
        notes: appointmentData.notes || ''
      };
      
      const response = await api.post('/appointments/', formattedData);
      return response.data;
      
    } catch (error) {
      console.error('Error creando cita:', error.message);
      throw error;
    }
  },
  
  getServices: async () => {
    try {
      const response = await api.get('/appointments/services/');
      return response.data;
    } catch (error) {
      console.warn('Usando datos de respaldo');
      return [
        { id: 1, name: 'Consulta General', duration: 30, price: 50 },
        { id: 2, name: 'Control de Rutina', duration: 20, price: 30 },
        { id: 3, name: 'Consulta Especializada', duration: 45, price: 80 },
        { id: 4, name: 'Urgencia', duration: 60, price: 100 }
      ];
    }
  }
};

export const userService = {
  getProfessionals: async () => {
    try {
      const response = await api.get('/users/professionals/');
      return response.data;
    } catch (error) {
      console.warn('Usando profesionales de respaldo');
      return [
        { id: 1, first_name: 'Juan', last_name: 'Pérez', email: 'juan@test.com', user_type: 'professional' },
        { id: 2, first_name: 'Ana', last_name: 'García', email: 'ana@test.com', user_type: 'professional' }
      ];
    }
  }
};

// Configurar token al cargar
const token = localStorage.getItem('access_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;