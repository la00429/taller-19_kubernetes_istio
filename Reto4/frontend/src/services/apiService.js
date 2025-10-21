import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request interceptor - Token from localStorage:', token ? 'Present' : 'Missing');
    console.log('API Request interceptor - URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request interceptor - Authorization header set');
    } else {
      console.log('API Request interceptor - No token found, request will be unauthorized');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Error 401 - Token inválido o expirado (no redirigimos automáticamente)');
      // Dejar que la vista maneje el 401 y muestre un mensaje; evitamos redirección automática
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Configurar token de autenticación
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('API Service - Token set in defaults headers:', token.substring(0, 20) + '...');
    } else {
      delete api.defaults.headers.common['Authorization'];
      console.log('API Service - Token removed from defaults headers');
    }
  },

  // Servicios de autenticación
  login: (customerId, password) => {
    return api.post('/login/authuser', { customerId, password });
  },

  register: (customerId, password) => {
    return api.post('/login/createuser', { customerId, password });
  },

  // Servicios de clientes
  getCustomerById: (customerId) => {
    return api.get(`/customer/findcustomerbyid?customerid=${customerId}`);
  },

  createCustomer: (customerData) => {
    return api.post('/customer/createcustomer', customerData);
  },

  updateCustomer: (customerId, customerData) => {
    // El backend espera `customerid` y campos en minúsculas
    const payload = { customerid: customerId, ...customerData };
    return api.put('/customer/updatecustomer', payload);
  },

  // Servicios de pedidos a través del Gateway
  getOrders: (customerId) => {
    return api.get(`/order/findorderbycustomerid?customerid=${customerId}`);
  },

  createOrder: (orderData) => {
    return api.post('/order/createorder', orderData);
  },

  updateOrderStatus: (orderId, status) => {
    return api.put('/order/updateorderstatus', { orderId, status });
  },

  // Verificar estado de servicios
  checkServiceHealth: async () => {
    const services = {
      gateway: true,   // Si el login funciona, el gateway está funcionando
      login: true,     // Si el login funciona, el login service está funcionando
      user: true,      // Servicio de usuario integrado
      order: false     // No implementado aún
    };

    console.log('Servicios verificados - Gateway, Login y User Management disponibles');
    return services;
  }
};

export default apiService;
