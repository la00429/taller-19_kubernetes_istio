import React, { useState } from 'react';
import CreateOrder from './CreateOrder';
import OrderList from './OrderList';

const OrderDashboard = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="order-dashboard">
      <div className="dashboard-header">
        <h1>Gestión de Órdenes</h1>
        <p>Administra y crea órdenes de manera eficiente</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">●</span>
          Ver Órdenes
        </button>
        <button
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <span className="tab-icon">●</span>
          Crear Orden
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'list' && <OrderList />}
        {activeTab === 'create' && <CreateOrder />}
      </div>
    </div>
  );
};

export default OrderDashboard;
