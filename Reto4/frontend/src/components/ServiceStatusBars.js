import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ServiceStatusBars = () => {
  const [services, setServices] = useState({
    gateway: { status: 'checking', name: 'API Gateway', port: '8080' },
    login: { status: 'checking', name: 'Login Service', port: '8081' },
    user: { status: 'checking', name: 'User Management (Go)', port: '8083' },
    order: { status: 'checking', name: 'Order Management', port: '8082' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      try {
        // Verificar cada servicio individualmente
        const serviceChecks = await Promise.allSettled([
          checkService('http://localhost:8080/actuator/health', 'gateway'),
          checkService('http://localhost:8081/actuator/health', 'login'),
          checkService('http://localhost:8083/health', 'user'),
          checkService('http://localhost:8082/health', 'order')
        ]);

        setServices(prev => {
          const updated = { ...prev };
          serviceChecks.forEach((result, index) => {
            const serviceKeys = ['gateway', 'login', 'user', 'order'];
            const serviceKey = serviceKeys[index];
            if (result.status === 'fulfilled') {
              updated[serviceKey] = { ...updated[serviceKey], status: 'online' };
            } else {
              updated[serviceKey] = { ...updated[serviceKey], status: 'offline' };
            }
          });
          return updated;
        });
      } catch (error) {
        console.error('Error checking services:', error);
      } finally {
        setLoading(false);
      }
    };

    checkServices();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkService = async (url, serviceName) => {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.log(`${serviceName} service check failed:`, error.message);
      return false;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'checking': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'offline': return 'Desconectado';
      case 'checking': return 'Verificando...';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="service-status-container">
        <h3>Estado de Servicios</h3>
        <div className="service-status-loading">
          <div className="loading-spinner"></div>
          <span>Verificando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="service-status-container">
      <h3>Estado de Servicios</h3>
      <div className="service-bars">
        {Object.entries(services).map(([key, service]) => (
          <div key={key} className="service-bar">
            <div className="service-info">
              <div className="service-name">
                <span className="service-icon">●</span>
                {service.name}
              </div>
              <div className="service-port">Puerto {service.port}</div>
            </div>
            <div className="service-status">
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(service.status) }}
              ></div>
              <span className="status-text">{getStatusText(service.status)}</span>
            </div>
            <div className="service-bar-visual">
              <div 
                className="service-bar-fill"
                style={{ 
                  width: service.status === 'online' ? '100%' : 
                         service.status === 'offline' ? '0%' : '50%',
                  backgroundColor: getStatusColor(service.status)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="service-summary">
        <div className="summary-stats">
          <span className="online-count">
            {Object.values(services).filter(s => s.status === 'online').length} en línea
          </span>
          <span className="offline-count">
            {Object.values(services).filter(s => s.status === 'offline').length} desconectados
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusBars;

