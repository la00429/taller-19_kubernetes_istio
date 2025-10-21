# Frontend - Sistema de Gestión de Pedidos

## Descripción
Frontend desarrollado en React para el sistema de gestión de pedidos del Reto de Ingeniería de Software II.

## Tecnologías Utilizadas
- **React 18.2.0** - Biblioteca principal para la interfaz de usuario
- **React Router DOM 6.8.0** - Enrutamiento de la aplicación
- **Axios 1.6.0** - Cliente HTTP para comunicación con la API
- **CSS3** - Estilos personalizados

## Características
- ✅ Autenticación JWT centralizada
- ✅ Gestión de sesiones de usuario
- ✅ Interfaz responsive
- ✅ Monitoreo de estado de servicios
- ✅ Manejo de errores
- ✅ Navegación protegida

## Estructura del Proyecto
```
src/
├── components/          # Componentes de React
│   ├── Dashboard.js     # Dashboard principal
│   └── Login.js         # Componente de autenticación
├── contexts/            # Contextos de React
│   └── AuthContext.js   # Contexto de autenticación
├── services/            # Servicios de API
│   └── apiService.js    # Cliente HTTP configurado
├── App.js              # Componente principal
├── App.css             # Estilos de la aplicación
├── index.js            # Punto de entrada
└── index.css           # Estilos globales
```

## Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:8080
```

### Instalación
```bash
cd frontend
npm install
```

### Ejecución
```bash
npm start
```

La aplicación se ejecutará en `http://localhost:3000`

## Funcionalidades

### 1. Autenticación
- **Login**: Iniciar sesión con ID de cliente y contraseña
- **Registro**: Crear nueva cuenta de usuario
- **Logout**: Cerrar sesión y limpiar tokens

### 2. Dashboard
- **Estado de Servicios**: Monitoreo en tiempo real de microservicios
- **Información del Usuario**: Datos de la sesión actual
- **Funcionalidades**: Lista de características disponibles
- **Información Técnica**: Detalles de la arquitectura

### 3. Navegación
- **Rutas Protegidas**: Acceso solo con autenticación válida
- **Redirección Automática**: Login automático si hay token válido

## Integración con Backend

### API Gateway
- **URL Base**: `http://localhost:8080`
- **Autenticación**: Bearer Token JWT
- **CORS**: Configurado para permitir peticiones desde el frontend

### Endpoints Utilizados
- `POST /login/authuser` - Autenticación de usuarios
- `POST /login/createuser` - Registro de usuarios
- `GET /actuator/health` - Estado del gateway

## Desarrollo

### Estructura de Componentes
```jsx
// Ejemplo de uso del contexto de autenticación
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  // Lógica del componente
}
```

### Servicios de API
```javascript
// Ejemplo de uso del servicio de API
import apiService from '../services/apiService';

// Login
const response = await apiService.login('customerId', 'password');

// Verificar estado de servicios
const services = await apiService.checkServiceHealth();
```

## Capturas de Pantalla

### Pantalla de Login
- Formulario de autenticación con validación
- Opción de registro de nuevos usuarios
- Información del sistema y endpoints

### Dashboard Principal
- Estado de servicios en tiempo real
- Información del usuario autenticado
- Panel de pruebas de API
- Información técnica del sistema

## Notas de Desarrollo
- El frontend está configurado para comunicarse con el API Gateway en el puerto 8080
- La autenticación JWT se maneja automáticamente
- Los tokens se almacenan en localStorage
- El proxy está configurado para desarrollo local
