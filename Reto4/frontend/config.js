// Configuración de la aplicación
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  ORDER_SERVICE_URL: 'http://localhost:8082', // Directo al Order Service
  EUREKA_URL: process.env.REACT_APP_EUREKA_URL || 'http://localhost:8761',
  APP_NAME: 'Sistema de Gestión de Pedidos',
  VERSION: '1.0.0'
};

export default config;
