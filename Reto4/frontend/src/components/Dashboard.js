import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import ServiceStatusBars from './ServiceStatusBars';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Dashboard - Loading data for user:', user?.customerId);
        
        if (!user?.customerId || user.customerId === 'undefined' || user.customerId.trim() === '') {
          console.log('Dashboard - No valid customerId, using default data');
          setStats({
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalCustomers: 1
          });
          setRecentOrders([]);
          setLoading(false);
          return;
        }

        // Verificar token antes de hacer la llamada
        const token = localStorage.getItem('token');
        console.log('Dashboard - Token check:', token ? 'Present' : 'Missing');
        
        // Cargar datos reales de órdenes
        const ordersResponse = await apiService.getOrders(user.customerId);
        const orders = ordersResponse.data || [];
        
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'PENDING').length,
          completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
          totalCustomers: 1
        });
        
        setRecentOrders(orders.slice(0, 5).map(order => ({
          id: order.orderID,
          customer: order.customerid,
          status: order.status,
          date: new Date().toISOString().split('T')[0]
        })));
        
        console.log('Dashboard - Data loaded successfully');
      } catch (error) {
        console.error('Dashboard - Error loading data:', error);
        // Datos por defecto si hay error
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalCustomers: 1
        });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.customerId]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Bienvenido, {user?.customerId}</h1>
          <p>Panel de control del sistema de gestión de órdenes</p>
        </div>
        <div className="dashboard-date">
          <span>{new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Barras de estado de servicios */}
      <ServiceStatusBars />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders-icon">●</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Total Órdenes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon">●</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pendingOrders}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed-icon">●</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedOrders}</div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customers-icon">●</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalCustomers}</div>
            <div className="stat-label">Clientes</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Órdenes Recientes</h2>
            <button className="btn btn-outline">Ver Todas</button>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <button className="btn btn-sm btn-outline">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Acciones Disponibles</h2>
          </div>
          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={() => window.location.href = '/orders/create'}
            >
              <span className="action-icon">●</span>
              <span>Crear Nueva Orden</span>
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => window.location.href = '/orders/list'}
            >
              <span className="action-icon">●</span>
              <span>Ver Mis Órdenes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;