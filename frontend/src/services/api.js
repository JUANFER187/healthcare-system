import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
  withCredentials: true,
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    // Headers para CORS
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    
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

        // ✅ CORREGIDO: Usar endpoint correcto
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
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
  // ✅ MÉTODO PRINCIPAL: Login inteligente que prueba múltiples endpoints
  // ✅ MÉTODO PRINCIPAL CORREGIDO: Login con compatibilidad total
  login: async (username, password) => {
    console.log('🔐 Iniciando proceso de login...');
    console.log('📧 Usuario recibido:', username);
    
    // Lista de endpoints a probar (en orden de preferencia)
    const endpoints = [
      { 
        url: '/auth/login/', 
        method: 'POST', 
        name: 'Login de compatibilidad',
        data: { username, password }  // Usar username como está
      },
      { 
        url: '/auth/token/', 
        method: 'POST', 
        name: 'Endpoint legacy',
        data: { username, password }
      },
      { 
        url: '/login/', 
        method: 'POST', 
        name: 'Endpoint nuevo con email',
        data: { email: username, password }  // Probar como email
      },
      { 
        url: '/login/', 
        method: 'POST', 
        name: 'Endpoint nuevo con username',
        data: { username, password }  // Probar como username
      },
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Probando: ${endpoint.name} (${endpoint.url})`);
        
        const response = await axios.post(
          `${API_BASE_URL}${endpoint.url}`,
          endpoint.data,
          { 
            headers: { 'Content-Type': 'application/json' }, 
            timeout: 5000 
          }
        );
        
        console.log(`✅ ${endpoint.name} funcionó:`, response.status);
        console.log('📦 Datos recibidos:', response.data);
        
        // Procesar respuesta - FORMATO ESPERADO:
        // { user: {...}, refresh: "...", access: "..." }
        let accessToken = null;
        let refreshToken = null;
        let userData = null;
        
        // Formato nuevo (nuestro backend)
        if (response.data.access && response.data.refresh && response.data.user) {
          accessToken = response.data.access;
          refreshToken = response.data.refresh;
          userData = response.data.user;
        }
        // Formato alternativo
        else if (response.data.token) {
          accessToken = response.data.token;
          userData = response.data.user || { username, email: username };
        }
        // Formato simple JWT estándar
        else if (response.data.access && response.data.refresh) {
          accessToken = response.data.access;
          refreshToken = response.data.refresh;
          // Intentar obtener info del usuario
          try {
            const userResponse = await axios.get(`${API_BASE_URL}/me/`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            userData = userResponse.data;
          } catch (e) {
            userData = { 
              username: username,
              email: username.includes('@') ? username : `${username}@example.com`,
              user_type: 'patient' 
            };
          }
        }
        // Si solo tenemos access token
        else if (response.data.access) {
          accessToken = response.data.access;
          userData = response.data.user || { username, email: username };
        }
        
        // Validar que tenemos token
        if (!accessToken) {
          console.warn('⚠️ No se recibió token de acceso');
          continue;
        }
        
        // Si no tenemos userData, crear uno básico
        if (!userData) {
          userData = {
            username: username,
            email: username.includes('@') ? username : `${username}@test.com`,
            user_type: 'patient',
            first_name: username.split('@')[0],
            last_name: 'Usuario'
          };
        }
        
        // Asegurar que userData tenga los campos necesarios
        if (!userData.email) userData.email = username.includes('@') ? username : `${username}@test.com`;
        if (!userData.username) userData.username = username;
        if (!userData.user_type) userData.user_type = 'patient';
        
        // Guardar en localStorage
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user_type', userData.user_type || 'patient');
        
        // Configurar axios para futuras requests
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        console.log('🎉 Login exitoso. Usuario guardado:', userData);
        return {
          success: true,
          user: userData,
          token: accessToken,
          refresh: refreshToken
        };
        
      } catch (error) {
        console.log(`❌ ${endpoint.name} falló:`, error.response?.status || error.message);
        if (error.response?.data) {
          console.log('📝 Error details:', error.response.data);
        }
        // Continuar con el siguiente endpoint
        continue;
      }
    }
    
    // Si todos los endpoints fallaron
    console.error('❌ Todos los endpoints de login fallaron');
    throw new Error('Credenciales inválidas o servidor no disponible');
  },

  // ✅ Refresh token
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
      // Forzar logout
      authService.logout();
      throw error;
    }
  },

  // ✅ Obtener perfil actual
  getCurrentUser: async () => {
    try {
      // Primero intentar del endpoint
      const response = await api.get('/users/me/');
      if (response.data) {
        // Actualizar localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('user_type', response.data.user_type || 'patient');
        return response.data;
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener perfil del endpoint, usando localStorage');
      // Fallback a localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  },

  // ✅ Logout
  logout: () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },

  // ✅ Verificar token
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

  // ✅ Registro
  register: async (userData) => {
    try {
      console.log('📝 Registrando nuevo usuario...');
      const response = await api.post('/users/register/', {
        ...userData,
        user_type: userData.user_type || 'patient'
      });
      
      console.log('✅ Registro exitoso:', response.data);
      
      // Si el registro incluye auto-login
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
  // Obtener perfil del usuario logueado
  getProfile: async () => {
    return await authService.getCurrentUser();
  },

  // Obtener todos los profesionales
  getProfessionals: async () => {
    try {
      const response = await api.get('/users/');
      if (response.data && Array.isArray(response.data)) {
        const professionals = response.data.filter(user => 
          user.user_type === 'professional' || user.is_professional
        );
        return professionals;
      }
      throw new Error('Respuesta inválida');
    } catch (error) {
      console.warn('⚠️ Usando datos de profesionales de respaldo');
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
      if (response.data && Array.isArray(response.data)) {
        return response.data.filter(user => user.user_type === 'patient');
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
      return [];
    }
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/users/me/', userData);
      // Actualizar localStorage
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

// ==================== SERVICIOS DE CITAS (CRUD COMPLETO) ====================
export const appointmentService = {
  // Obtener todas las citas
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

  // Obtener cita por ID
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo cita ${id}:`, error);
      throw error;
    }
  },

  // ✅ CORREGIDO: Crear nueva cita
  createAppointment: async (appointmentData) => {
    try {
      console.log('📅 Creando nueva cita:', appointmentData);
      
      // Formatear datos para Django
      const formattedData = {
        professional: appointmentData.professional,
        service: appointmentData.service,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        reason: appointmentData.reason || '',
        notes: appointmentData.notes || '',
        status: appointmentData.status || 'scheduled'
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

  // Actualizar cita
  updateAppointment: async (id, updates) => {
    try {
      const response = await api.patch(`/appointments/${id}/`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando cita ${id}:`, error);
      throw error;
    }
  },

  // Eliminar cita
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando cita ${id}:`, error);
      throw error;
    }
  },

  // Obtener servicios disponibles
  getServices: async () => {
    try {
      const response = await api.get('/appointments/services/');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Usando datos de servicios de respaldo');
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

// ==================== SERVICIOS DE HISTORIAL CLÍNICO ====================
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

// ==================== SERVICIOS DE CONSULTORIOS ====================
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
    console.log('🔑 Token configurado en headers axios');
  }
};

// Configurar headers al cargar
if (typeof window !== 'undefined') {
  setupAxiosHeaders();
}

// Función para probar conexión
export const testConnection = async () => {
  console.log('🔍 Probando conexión con backend...');
  
  try {
    // Probar Django base
    const djangoTest = await axios.get('http://localhost:8000/', { timeout: 5000 });
    console.log('✅ Django responde:', djangoTest.status);
    
    // Probar API base
    const apiTest = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    console.log('✅ API responde:', apiTest.status);
    
    // Probar si hay usuarios
    try {
      const usersTest = await api.get('/users/');
      console.log(`✅ Hay ${usersTest.data?.length || 0} usuarios`);
    } catch {
      console.log('⚠️ /users/ no disponible aún');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('💡 Soluciones:');
    console.log('1. Verifica que Docker esté corriendo: docker ps');
    console.log('2. Revisa logs del backend: docker logs healthcare-system-web-1');
    console.log('3. Reinicia: docker-compose restart');
    return false;
  }
};

// Exportar la instancia de axios
export default api;