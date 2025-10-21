import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderDashboard from './components/OrderDashboard';
import Unauthorized from './components/Unauthorized';
import Forbidden from './components/Forbidden';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
        <h3>Cargando...</h3>
        <p>Verificando autenticación...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute - Usuario autenticado, mostrando contenido protegido');
  return children;
}

export default App;
