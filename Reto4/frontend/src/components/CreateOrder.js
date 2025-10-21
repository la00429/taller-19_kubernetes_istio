import React, { useState } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const CreateOrder = () => {
  const [orderData, setOrderData] = useState({
    orderID: '',
    status: 'PENDING'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const statusOptions = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'PROCESSING', label: 'Procesando' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.createOrder({
        customerid: user.customerId,
        orderID: orderData.orderID,
        status: orderData.status
      });

      if (response.data.orderCreated) {
        setMessage('¡Orden creada exitosamente!');
        setOrderData({ orderID: '', status: 'PENDING' });
      } else {
        setMessage('Error al crear la orden');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('Error al crear la orden: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="order-container">
      <div className="card">
        <div className="card-header">
          <h2>Crear Nueva Orden</h2>
          <p>Complete los datos para crear una nueva orden</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="orderID">ID de Orden:</label>
            <input
              type="text"
              id="orderID"
              name="orderID"
              value={orderData.orderID}
              onChange={handleChange}
              required
              placeholder="Ingrese el ID de la orden"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status"
              value={orderData.status}
              onChange={handleChange}
              className="form-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cliente:</label>
            <input
              type="text"
              value={user?.customerId || ''}
              disabled
              className="form-input disabled"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Orden'}
          </button>
        </form>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;

