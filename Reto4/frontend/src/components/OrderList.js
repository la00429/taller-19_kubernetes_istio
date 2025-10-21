import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const { user } = useAuth();

  const statusOptions = [
    { value: 'PENDING', label: 'Pendiente', color: '#f39c12' },
    { value: 'PROCESSING', label: 'Procesando', color: '#3498db' },
    { value: 'SHIPPED', label: 'Enviado', color: '#9b59b6' },
    { value: 'DELIVERED', label: 'Entregado', color: '#27ae60' },
    { value: 'CANCELLED', label: 'Cancelado', color: '#e74c3c' }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders(user.customerId);
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar las órdenes: ' + (err.response?.data?.message || err.message));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      
      if (response.data.orderStatusUpdated) {
        // Actualizar la lista de órdenes
        setOrders(orders.map(order => 
          order.orderID === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
      } else {
        alert('Error al actualizar el estado de la orden');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error al actualizar la orden: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || 
           { label: status, color: '#95a5a6' };
  };

  useEffect(() => {
    fetchOrders();
  }, [user.customerId]);

  if (loading) {
    return (
      <div className="order-container">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="card">
        <div className="card-header">
          <h2>Mis Órdenes</h2>
          <p>Gestiona y consulta el estado de tus órdenes</p>
          <button 
            onClick={fetchOrders}
            className="btn btn-secondary"
            disabled={loading}
          >
            Actualizar
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">●</div>
            <h3>No tienes órdenes</h3>
            <p>Cuando crees una orden, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.orderID} className="order-card">
                  <div className="order-header">
                    <h3>Orden #{order.orderID}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <p><strong>Cliente:</strong> {order.customerid}</p>
                    <p><strong>Estado:</strong> {statusInfo.label}</p>
                  </div>

                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
                      className="status-select"
                      disabled={updatingOrder === order.orderID}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    {updatingOrder === order.orderID && (
                      <div className="updating-indicator">
                        <div className="mini-spinner"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
