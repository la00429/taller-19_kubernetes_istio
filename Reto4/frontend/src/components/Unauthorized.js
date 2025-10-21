import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-icon">
          <div className="lock-icon">🔒</div>
        </div>
        
        <h1 className="error-title">Acceso No Autorizado</h1>
        
        <div className="error-message">
          <p>Lo sentimos, no tienes permisos para acceder a esta página.</p>
          <p>Por favor, verifica que tengas las credenciales correctas o contacta al administrador.</p>
        </div>

        <div className="error-details">
          <div className="detail-item">
            <span className="detail-label">Código de error:</span>
            <span className="detail-value">401 - Unauthorized</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Timestamp:</span>
            <span className="detail-value">{new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-primary" 
            onClick={handleGoHome}
          >
            <span className="btn-icon">🏠</span>
            Ir al Dashboard
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleGoLogin}
          >
            <span className="btn-icon">🔑</span>
            Iniciar Sesión
          </button>
        </div>

        <div className="help-text">
          <p>¿Necesitas ayuda? Contacta al equipo de soporte técnico.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
