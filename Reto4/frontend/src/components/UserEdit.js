import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const UserEdit = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', address: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromQueryId = query.get('customerid') || (typeof window !== 'undefined' ? localStorage.getItem('editCustomerId') : null);

  useEffect(() => {
    const load = async () => {
      try {
        const id = fromQueryId || user?.customerId;
        if (!id) {
          setError('No hay cliente seleccionado para editar');
          setLoading(false);
          return;
        }
        const res = await apiService.getCustomerById(id);
        const d = res.data || {};
        setForm({
          firstName: d.firstname || '',
          lastName: d.lastname || '',
          address: d.address || '',
          phone: d.phone || '',
          email: d.email || ''
        });
        // limpiar seleccion temporal para futuras ediciones
        try { localStorage.removeItem('editCustomerId'); } catch {}
        setError('');
      } catch (err) {
        if (err?.response?.status === 401) {
          setError('Tu sesión expiró o no tienes autorización. Inicia sesión nuevamente.');
        } else if (err?.response?.status === 404) {
          setError('Cliente no encontrado');
        } else {
          setError('No se pudo cargar el cliente');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.customerId, fromQueryId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = fromQueryId || user?.customerId;
    if (!id) return;
    try {
      setSaving(true);
      // Backend espera claves en snake/minúsculas
      const payload = {
        customerid: id,
        firstname: form.firstName,
        lastname: form.lastName,
        address: form.address,
        phone: form.phone,
        email: form.email
      };
      const res = await apiService.updateCustomer(id, payload);
      if (res.data?.updateCustomerValid) {
        setMsg('Cliente actualizado');
        setError('');
      } else {
        setError('No se pudo actualizar');
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setError('Tu sesión expiró o no tienes autorización para editar');
      } else {
        setError('Error al actualizar');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card"><h2>Editar Cliente</h2><div>Cargando...</div></div>;
  }

  return (
    <div className="card">
      <h2>Editar Cliente</h2>
      {error && <div className="error-box" style={{ marginBottom: 12 }}>{error}</div>}
      {msg && <div className="success-box" style={{ marginBottom: 12, background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>{msg}</div>}
      <form onSubmit={onSubmit} className="form-grid">
        <label>Nombre
          <input name="firstName" value={form.firstName} onChange={onChange} />
        </label>
        <label>Apellido
          <input name="lastName" value={form.lastName} onChange={onChange} />
        </label>
        <label>Dirección
          <input name="address" value={form.address} onChange={onChange} />
        </label>
        <label>Teléfono
          <input name="phone" value={form.phone} onChange={onChange} />
        </label>
        <label>Email
          <input name="email" value={form.email} onChange={onChange} />
        </label>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          <button type="button" className="btn btn-outline" onClick={() => (window.location.href = '/users/search')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;


