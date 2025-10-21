import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (!user?.customerId) {
          setError('No hay usuario autenticado');
          setLoading(false);
          return;
        }
        const res = await apiService.getCustomerById(user.customerId);
        setProfile(res.data);
        setError('');
      } catch (e) {
        setError('No se pudo cargar el perfil');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.customerId]);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  if (!profile) {
    return <div>No hay datos de perfil</div>;
  }

  return (
    <div className="card">
      <h2>Mi Perfil</h2>
      <div className="details-grid">
        <div><strong>Documento:</strong> {profile.document}</div>
        <div><strong>Nombres:</strong> {profile.firstname}</div>
        <div><strong>Apellidos:</strong> {profile.lastname}</div>
        <div><strong>Dirección:</strong> {profile.address}</div>
        <div><strong>Teléfono:</strong> {profile.phone}</div>
        <div><strong>Email:</strong> {profile.email}</div>
      </div>
    </div>
  );
};

export default UserProfile;


