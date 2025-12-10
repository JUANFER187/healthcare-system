🏥 Healthcare System
- Este documento detalla el estado actual del proyecto, comparando la implementación con el producto final deseado especificado en el Manual Técnico.
- Sistema integral de gestión de citas médicas** para pacientes y profesionales de la salud, desarrollado con Django, React y Docker.

![Healthcare System](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)
![Django](https://img.shields.io/badge/Django-4.2.7-green)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-✔-blue)

## 🚀 Características Principales

### 👥 Para Pacientes
- **Agendamiento inteligente** de citas médicas
- **Gestión de consultorios** favoritos
- **Historial médico** digital completo
- **Búsqueda avanzada** de profesionales
- **Notificaciones** de citas y recordatorios

### 👨‍⚕️ Para Profesionales
- **Agenda profesional** con gestión de horarios
- **Gestión de pacientes** e historiales clínicos
- **Servicios personalizados** por especialidad
- **Estadísticas** de ingresos y asistencia
- **Expedientes médicos** digitales

## 🏗️ Arquitectura del Proyecto
healthcare-system/
- ├── backend/ # Django REST API
- │ ├── users/ # Autenticación y usuarios
- │ ├── appointments/ # Gestión de citas
- │ ├── clinic_history/ # Historial clínico
- │ └── healthcare_system/ # Configuración principal
- ├── frontend/ # React Application
- │ ├── src/
- │ │ ├── components/ # Componentes reutilizables
- │ │ ├── pages/ # Vistas principales
- │ │ ├── services/ # Llamadas a API
- │ │ └── context/ # Estado global (Auth)
- └── docker/ # Configuración Docker


## 🛠️ Tecnologías Utilizadas

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Django 4.2.7, Django REST Framework, Simple JWT, PostgreSQL |
| **Frontend** | React 18, Vite, React Router DOM, Axios, Lucide React |
| **DevOps** | Docker, Docker Compose, n8n (automatización), n8n-mcp |
| **Estilo** | CSS-in-JS, Paleta de colores profesional (#313851, #C2CBD3, #F6F3ED) |

### Deficiencia Crítica: Estado de Despliegue en Kubernetes (K8s)
## 1. Resumen de Fallas Técnicas

La inoperatividad del sistema se debe a fallas en la etapa de despliegue de los microservicios en Kubernetes, impidiendo que la aplicación alcance un estado funcional.
![alt text](image.png)

## Conclusión Técnica: 
La falla inmediata (ImagePullBackOff) en la descarga de las imágenes Docker impide el inicio de los Init Containers. Esto significa que scripts críticos como wait_for_db.py, manage.py migrate y create_services.py nunca se ejecutan, dejando ambas bases de datos (auth-db y patients-db) vacías y los microservicios fuera de servicio.

## 2. Fallos de Funcionamiento (Contraste con el Manual Técnico)

El proyecto es deficiente en sus Funciones Principales y en la implementación de sus flujos de datos.
![alt text](image-1.png)

## 3. Conclusión de la Deficiencia del Proyecto

El proyecto está estructuralmente diseñado para cumplir con los requisitos del Manual Técnico (microservicios separados, lógica de Init Containers, endpoints en api.js y componentes de React listos).

Sin embargo, debido a las fallas de la integración y despliegue continuo (CI/CD), específicamente el problema de docker push (que provoca ImagePullBackOff en K8s), la aplicación se encuentra en un estado no funcional.

La principal deficiencia es que la capa de Backend (Django Microservices) está completamente inactiva, lo que anula todas las Funciones Principales y los Flujos de Datos descritos en el manual, dejando el frontend con fallos de conexión o dependiendo de datos de prueba para simular la funcionalidad.

## 📦 Instalación y Configuración

### Opción 1: Docker (Recomendada)
```bash
# 1. Clonar el repositorio
git clone https://github.com/JUANFER187/healthcare-system.git
cd healthcare-system

# 2. Iniciar con Docker Compose
docker-compose up --build

# 3. Acceder a las aplicaciones
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Django: http://localhost:8000/admin
# n8n: http://localhost:5678
```

### Opción 2: Desarrollo local
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## 🔐 Autenticación
El sistema utiliza JWT (JSON Web Tokens) para autenticación segura:
    Registro diferenciado: Pacientes vs Profesionales
    Login seguro: Tokens de acceso y refresh
    Protección de rutas: Middleware de autenticación
    Roles: Permisos específicos por tipo de usuario

## 📊 API Endpoints
Autenticación
    POST /api/auth/login/ - Inicio de sesión
    POST /api/auth/token/refresh/ - Refresh token
    POST /api/users/register/ - Registro de usuarios

### Citas
    GET /api/appointments/ - Listar citas (filtrado por usuario)
    POST /api/appointments/ - Crear nueva cita
    PATCH /api/appointments/{id}/ - Actualizar cita
    DELETE /api/appointments/{id}/ - Cancelar cita

### Usuarios
    GET /api/users/me/ - Perfil del usuario actual
    GET /api/users/professionals/ - Lista de profesionales

## 🎨 UI/UX Features
### Paleta de Colores
    Primario: #F6F3ED (fondo claro)
    Secundario: #C2CBD3 (gris azulado)
    Acento: #313851 (azul oscuro profesional)

### Componentes Clave
    Dashboard diferenciado por rol de usuario
    Cards circulares para acciones principales
    Menú hamburguesa animado
    Formularios inteligentes que eliminan redundancias
    Gráficas interactivas para estadísticas

### 🚧 Próximas Funcionalidades
    Video consultas integradas
    Prescripciones digitales
    Sistema de facturación
    App móvil (React Native)
    Integración con sistemas de salud
    Chat en tiempo real para consultas

### 🤝 Contribución
    Fork el proyecto
    Crear una rama (git checkout -b feature/nueva-funcionalidad)
    Commit cambios (git commit -m 'Agrega nueva funcionalidad')
    Push a la rama (git push origin feature/nueva-funcionalidad)
    Abrir un Pull Request

### 📄 Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.
👨‍💻 Autor

### Juan Fernando - GitHub
🙏 Agradecimientos
    DeepSeek por la asistencia en desarrollo
    Comunidad React por componentes y mejores prácticas
    Django REST Framework por la robustez del backend

### 🌐 URLs de Desarrollo
Servicio	URL	Puerto
Frontend	http://localhost:3000	3000
Backend	http://localhost:8000	8000
n8n	http://localhost:5678	5678
PostgreSQL	localhost	5432

## Nota:
Requiere Docker y Docker Compose instalados.
Proyecto realizado por equipo conformado:
Juan Fernando Prieto Gomez 219747719.
Diego Andres Hernandez Roddriguez 216028371.

