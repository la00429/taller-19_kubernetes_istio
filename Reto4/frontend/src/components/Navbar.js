import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container clearfix">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">ORD</span>
            Sistema de Gestión de Pedidos
          </Link>
        </div>
        
        {isAuthenticated && (
          <div className="nav-content">
            <div className="nav-menu">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <span className="nav-icon">●</span>
                Dashboard
              </Link>
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
              >
                <span className="nav-icon">●</span>
                Órdenes
              </Link>
            </div>
            
            <div className="nav-user">
              <div className="user-info">
                <span className="user-icon">●</span>
                <span className="user-name">{user?.customerId}</span>
              </div>
              <button 
                className="btn btn-secondary logout-btn" 
                onClick={logout}
              >
                <span className="btn-icon">●</span>
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
