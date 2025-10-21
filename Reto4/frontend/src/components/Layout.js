import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import OrderDashboard from './OrderDashboard';
import CustomerSearch from './CustomerSearch';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="content-area">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders/*" element={<OrderDashboard />} />
            <Route path="users/search" element={<CustomerSearch />} />
            <Route path="users/edit" element={<UserEdit />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
