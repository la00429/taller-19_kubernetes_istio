import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '●',
      path: '/dashboard',
      hasSubmenu: false
    },
    {
      id: 'users',
      title: 'Clientes',
      icon: '●',
      hasSubmenu: true,
      submenu: [
        { title: 'Buscar Cliente', path: '/users/search' },
        { title: 'Editar Cliente', path: '/users/edit' },
        { title: 'Crear Cliente', path: '/users/create' }
      ]
    },
    {
      id: 'orders',
      title: 'Órdenes',
      icon: '●',
      hasSubmenu: true,
      submenu: [
        { title: 'Ver Órdenes', path: '/orders/list' },
        { title: 'Crear Orden', path: '/orders/create' }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">ORD</span>
          <span className="logo-text">Order Management</span>
        </div>
        <div className="user-profile">
          <div className="user-avatar">
            <span className="avatar-text">{user?.customerId?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div className="user-info">
            <div className="user-name">{user?.customerId || 'Usuario'}</div>
            <div className="user-role">Cliente</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item">
            {item.hasSubmenu ? (
              <>
                <div 
                  className={`nav-link ${expandedMenus[item.id] ? 'expanded' : ''}`}
                  onClick={() => toggleMenu(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-title">{item.title}</span>
                  <span className={`nav-arrow ${expandedMenus[item.id] ? 'rotated' : ''}`}>
                    ▼
                  </span>
                </div>
                {expandedMenus[item.id] && (
                  <div className="submenu">
                    {item.submenu.map((subItem, index) => (
                      <Link
                        key={index}
                        to={subItem.path}
                        className={`submenu-link ${isActive(subItem.path) ? 'active' : ''}`}
                      >
                        <span className="submenu-icon">•</span>
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-title">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Sistema Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
