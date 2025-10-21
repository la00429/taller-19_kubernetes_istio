import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span>Dashboard</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">{user?.customerId}</span>
            <span className="user-role">Usuario</span>
          </div>
          <div className="user-actions">
            <button className="user-avatar">
              <span className="avatar-text">{user?.customerId?.charAt(0)?.toUpperCase() || 'U'}</span>
            </button>
            <button className="logout-btn" onClick={logout}>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
