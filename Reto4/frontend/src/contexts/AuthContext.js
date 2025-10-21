import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Solo verificar autenticación al montar el componente una vez
    if (initialized) return;
    
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const customerId = localStorage.getItem('customerId');
        
        console.log('AuthContext useEffect - Checking stored auth:', { 
          token: !!token, 
          customerId,
          tokenLength: token ? token.length : 0
        });
        
        if (token && customerId) {
          // Configurar el token en el servicio API
          apiService.setAuthToken(token);
          
          // Verificar si el token es válido
          const isValidToken = await apiService.verifyToken();
          
          if (isValidToken) {
            setIsAuthenticated(true);
            setUser({ customerId });
            console.log('AuthContext useEffect - Token válido, usuario autenticado');
          } else {
            console.log('AuthContext useEffect - Token inválido, limpiando sesión');
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('customerId');
            apiService.setAuthToken(null);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('AuthContext useEffect - No hay token almacenado');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext useEffect - Error inicializando auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [initialized]);

  const login = async (customerId, password) => {
    try {
      console.log('LOGIN START - customerId:', customerId);
      const response = await apiService.login(customerId, password);
      console.log('LOGIN RESPONSE:', response.data);
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        console.log('LOGIN SUCCESS - Token received:', token.substring(0, 20) + '...');
        
        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('customerId', customerId);
        console.log('LOGIN - Token saved to localStorage:', localStorage.getItem('token') ? 'Success' : 'Failed');
        
        // Configurar API service
        apiService.setAuthToken(token);
        console.log('LOGIN - API service token configured');
        
        // Establecer estado inmediatamente sin verificación adicional
        setIsAuthenticated(true);
        setUser({ customerId });
        setInitialized(true); // Marcar como inicializado para evitar re-verificación
        
        console.log('LOGIN COMPLETE - isAuthenticated:', true, 'user:', { customerId });
        return { success: true };
      } else {
        console.log('LOGIN FAILED - Invalid response:', response.data);
        return { success: false, message: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  };

  const register = async (customerId, password) => {
    try {
      await apiService.register(customerId, password);
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrar usuario' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
    apiService.setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setInitialized(false); // Reset para permitir nueva verificación
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  console.log('AuthContext RENDER - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
