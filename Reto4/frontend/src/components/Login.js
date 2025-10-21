import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    customerId: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isLogin) {
        console.log('Intentando login con:', formData.customerId);
        result = await login(formData.customerId, formData.password);
      } else {
        console.log('Intentando registro con:', formData.customerId);
        result = await register(formData.customerId, formData.password);
        if (result.success) {
          // Después de registrar, hacer login automático
          console.log('Registro exitoso, intentando login automático...');
          result = await login(formData.customerId, formData.password);
        }
      }

      console.log('Resultado de la operación:', result);
      
      if (result.success) {
        console.log('Login exitoso, navegando al dashboard...');
        navigate('/dashboard');
      } else {
        console.log('Error en la operación:', result.message);
        setMessage(result.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setMessage('Error inesperado. Verifique que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}</h2>
      
      {message && (
        <div className={`alert ${message.includes('exitosamente') ? 'alert-success' : 'alert-danger'}`}>
          {message}
          <button 
            type="button" 
            onClick={() => setMessage('')}
            style={{ 
              float: 'right', 
              background: 'none', 
              border: 'none', 
              fontSize: '18px', 
              cursor: 'pointer',
              color: 'inherit'
            }}
            title="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerId">ID de Cliente:</label>
          <input
            type="text"
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            placeholder="Ingrese su ID de cliente"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Ingrese su contraseña"
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
          style={{ width: '100%', marginTop: '10px' }}
        >
          {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrar')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setFormData({ customerId: '', password: '' });
          }}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h4>Información del Sistema:</h4>
        <p><strong>Gateway:</strong> http://localhost:8080</p>
        <p><strong>Eureka:</strong> http://localhost:8761</p>
        <p><strong>Login Service:</strong> Puerto 8081</p>
        
        <div style={{ marginTop: '15px' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={async () => {
              setMessage('Probando conexión...');
              try {
                const response = await fetch('http://localhost:8080/login/authuser', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customerId: 'test', password: 'test' })
                });
                if (response.ok) {
                  setMessage('✅ Conexión exitosa con el servidor');
                } else {
                  setMessage(`❌ Error del servidor: ${response.status}`);
                }
              } catch (error) {
                setMessage('❌ No se puede conectar al servidor');
              }
            }}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            Probar Conexión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
