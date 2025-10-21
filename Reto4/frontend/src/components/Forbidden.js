import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
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
          <div className="lock-icon">🚫</div>
        </div>
        
        <h1 className="error-title">Acceso Prohibido</h1>
        
        <div className="error-message">
          <p>No tienes permisos para acceder a este recurso.</p>
          <p>Solo puedes acceder a tus propios datos y recursos autorizados.</p>
        </div>

        <div className="error-details">
          <div className="detail-item">
            <span className="detail-label">Código de error:</span>
            <span className="detail-value">403 - Forbidden</span>
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
          <p>¿Necesitas acceso a este recurso? Contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
