import React, { useState } from 'react';
import apiService from '../services/apiService';

const UserCreate = () => {
  const [form, setForm] = useState({
    document: '', firstName: '', lastName: '', address: '', phone: '', email: ''
  });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      // Backend espera firstname/lastname en minúsculas
      const payload = {
        document: form.document,
        firstname: form.firstName,
        lastname: form.lastName,
        address: form.address,
        phone: form.phone,
        email: form.email
      };
      const res = await apiService.createCustomer(payload);
      if (res.data?.createCustomerValid) {
        setMsg('Usuario creado');
        setForm({ document: '', firstName: '', lastName: '', address: '', phone: '', email: '' });
      } else {
        setMsg('No se pudo crear el usuario');
      }
    } catch (err) {
      setMsg('Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card">
      <h2>Crear Usuario</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label>Documento
          <input name="document" value={form.document} onChange={onChange} required />
        </label>
        <label>Nombres
          <input name="firstName" value={form.firstName} onChange={onChange} />
        </label>
        <label>Apellidos
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
        <button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear'}</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default UserCreate;


